import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
      const focusSnap = await getDoc(focusDocRef);
      
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

      return NextResponse.json({
        success: true,
        message: `Calendar sync triggered: "${eventName}" event has ${type}ed. Strict Focus Mode toggled to: ${strictMode ? 'ACTIVE (Locked)' : 'INACTIVE'}.`
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Calendar sync logged. Non-focus related event.'
    });
  } catch (error: any) {
    console.error('Error handling Google Calendar event webhook:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
