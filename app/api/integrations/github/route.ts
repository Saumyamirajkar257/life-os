import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, username, repository, action } = body;

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    // 1. Fetch habits collection for user
    const habitsColRef = collection(db, 'users', uid, 'habits');
    const qSnap = await getDocs(habitsColRef);

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

      return NextResponse.json({
        success: true,
        message: `GitHub Webhook triggered: Commits registered by ${username || 'developer'} in ${repository || 'repo'}. Checked off habit: "${habitTitle}".`
      });
    }

    return NextResponse.json({
      success: true,
      message: 'GitHub webhook logged. No matching coding/programming habit found in user dashboard to auto-complete.'
    });
  } catch (error: any) {
    console.error('Error handling GitHub webhook:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
