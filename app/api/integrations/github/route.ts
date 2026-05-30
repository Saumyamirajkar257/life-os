import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocsFromServer, getDocFromServer, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

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
    const { uid, username, repository, action } = body;

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    // 1. Fetch habits collection for user
    const habitsColRef = collection(db, 'users', uid, 'habits');
    const qSnap = await getDocsFromServer(habitsColRef);

    let matchedHabitId: string | null = null;
    let habitTitle = '';

    qSnap.forEach((doc) => {
      const data = doc.data();
      const title = (data.title || '').toLowerCase();
      // Search for coding/dev keywords
      if (
        title.includes('code') ||
        title.includes('coding') ||
        title.includes('github') ||
        title.includes('program') ||
        title.includes('develop')
      ) {
        matchedHabitId = doc.id;
        habitTitle = data.title;
      }
    });

    if (matchedHabitId) {
      const todayStr = new Date().toISOString().split('T')[0];
      const habitDocRef = doc(db, 'users', uid, 'habits', matchedHabitId);
      
      // Add today's date to completed dates
      await updateDoc(habitDocRef, {
        completedDates: arrayUnion(todayStr),
        currentStreak: 1 // Baseline streak increment fallback
      });

      const message = `GitHub Webhook triggered: Commits registered by ${username || 'developer'} in ${repository || 'repo'}. Checked off habit: "${habitTitle}".`;
      
      // Add server-side notification
      await addServerNotification(
        uid,
        'GitHub Commit Logged',
        `Pushed code to repository "${repository || 'unknown'}" and completed habit "${habitTitle}".`,
        'github'
      );

      return NextResponse.json({
        success: true,
        message
      });
    }

    const message = 'GitHub webhook logged. No matching coding/programming habit found in user dashboard to auto-complete.';
    
    await addServerNotification(
      uid,
      'GitHub Webhook Event',
      `Commit received in repository "${repository || 'unknown'}" but no matching coding habit was found to check off.`,
      'github'
    );

    return NextResponse.json({
      success: true,
      message
    });
  } catch (error: any) {
    console.error('Error handling GitHub webhook:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
