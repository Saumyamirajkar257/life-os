import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDocFromServer, setDoc, updateDoc } from 'firebase/firestore';

async function addServerNotification(uid: string, title: string, description: string, type: 'info' | 'success' | 'warning' | 'error' | 'github' | 'calendar') {
  try {
    const notifDocRef = doc(db, 'users', uid, 'store', 'life-os-notifications');
    const notifSnap = await getDocFromServer(notifDocRef);
    
    let storeData = { state: { notifications: [] as any[] }, version: 0 };
    if (notifSnap.exists()) {
      try {
        storeData = JSON.parse(notifSnap.data().value || '{"state":{"notifications":[]},"version":0}');
      } catch (e) {}
    }
    
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      description,
      timestamp: 'Just now',
      type,
      read: false,
    };
    
    if (!storeData.state) storeData.state = { notifications: [] };
    if (!Array.isArray(storeData.state.notifications)) storeData.state.notifications = [];
    
    storeData.state.notifications.unshift(newNotif);
    if (storeData.state.notifications.length > 50) {
      storeData.state.notifications = storeData.state.notifications.slice(0, 50);
    }
    
    await setDoc(notifDocRef, { value: JSON.stringify(storeData) });
  } catch (error) {
    console.error('Error adding server-side notification:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, eventName, type } = body; // type = 'start' | 'end'

    if (!uid || !eventName || !type) {
      return NextResponse.json({ error: 'Missing parameters: uid, eventName, and type are required' }, { status: 400 });
    }

    const lowerEvent = eventName.toLowerCase();
    const isFocusBlock = 
      lowerEvent.includes('study') ||
      lowerEvent.includes('focus') ||
      lowerEvent.includes('exam') ||
      lowerEvent.includes('code') ||
      lowerEvent.includes('midterm') ||
      lowerEvent.includes('project');

    if (isFocusBlock) {
      // Fetch user base focus settings from the store document
      const focusDocRef = doc(db, 'users', uid, 'store', 'life-os-focus');
      const focusSnap = await getDocFromServer(focusDocRef);
      
      let strictMode = true;
      if (type === 'start') {
        strictMode = true;
      } else if (type === 'end') {
        strictMode = false;
      }

      if (focusSnap.exists()) {
        const storeData = JSON.parse(focusSnap.data().value || '{}');
        if (storeData.state) {
          storeData.state.strictMode = strictMode;
          storeData.state.calendarSynced = true;
        }
        await updateDoc(focusDocRef, { value: JSON.stringify(storeData) });
      }

      const message = `Calendar sync triggered: "${eventName}" event has ${type}ed. Strict Focus Mode toggled to: ${strictMode ? 'ACTIVE (Locked)' : 'INACTIVE'}.`;

      await addServerNotification(
        uid,
        strictMode ? 'Strict Focus Mode Active' : 'Focus Mode Finished',
        `Google Calendar event "${eventName}" has ${type}ed. Strict Timer and distraction blockers are now ${strictMode ? 'active and locked' : 'disabled'}.`,
        'calendar'
      );

      return NextResponse.json({
        success: true,
        message
      });
    }

    const message = 'Calendar sync logged. Non-focus related event.';

    await addServerNotification(
      uid,
      'Calendar Event Ignored',
      `Event "${eventName}" received but it is not study or focus-related.`,
      'calendar'
    );

    return NextResponse.json({
      success: true,
      message
    });
  } catch (error: any) {
    console.error('Error handling Google Calendar event webhook:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
