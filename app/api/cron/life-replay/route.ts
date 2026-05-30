import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, getDocs, collection, setDoc } from 'firebase/firestore';

const getGeminiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
};

// Call Gemini API to generate structured slideshow Replay
async function generateAIReplayContent(scope: string, stats: any): Promise<any> {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    throw new Error('Missing Gemini API Key');
  }

  const systemPrompt = `You are the Cinematic Life Historian of LIFE OS.
Analyze the user's weekly/monthly/yearly progress stats.
Generate a structured, highly motivating, Spotify-Wrapped style presentation card data set.
Format the output as a valid JSON object matching the following structure:
{
  "motivationTitle": "A custom theme or title for this period",
  "personalityClass": "A creative title (e.g. 'The Relentless Executor')",
  "themeColor": "text-rose-400" | "text-amber-400" | "text-emerald-400" | "text-violet-400" | "text-blue-400",
  "aiSummary": "1-2 sentences reviewing their balance of work, habits, finances, and focus.",
  "brutalCritique": "1 sentence of constructive, direct, Apple/Notion style critique.",
  "achievementAward": "A custom title for their highest effort check-in"
}`;

  const userPrompt = `
Scope: ${scope}
User Stats:
- Completed Tasks Count: ${stats.completedTasks}
- Habit Check-ins Count: ${stats.habitCheckins}
- Journal Entries Count: ${stats.journalEntries}
- Net Savings (in Rupees): ₹${stats.netSavings}
- Achievements Logged: ${stats.achievements}
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          responseMimeType: 'application/json'
        }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return JSON.parse(rawText.trim());
    } else {
      const errText = await response.text();
      console.error(`Gemini Replay Cron returned error: ${response.status} - ${errText}`);
      throw new Error(`Gemini API Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to contact Gemini API in Cron Replay:', error);
    // Return high-fidelity local fallback
    return {
      motivationTitle: `The Path of ${stats.completedTasks > 2 ? 'High Execution' : 'Consistency'}`,
      personalityClass: stats.completedTasks > 2 ? 'The Hyper-focused Scholar' : 'The Balanced Zen Master',
      themeColor: stats.completedTasks > 2 ? 'text-amber-400' : 'text-emerald-400',
      aiSummary: `You checked off ${stats.completedTasks} tasks and completed ${stats.habitCheckins} routine checkpoints. Your saving momentum accounts for ₹${stats.netSavings}.`,
      brutalCritique: stats.habitCheckins === 0 
        ? 'Your habits check-ins are zero. Execution is the only currency.' 
        : 'Sleep consistency and scheduling study hours before noon will maximize results.',
      achievementAward: 'Consistency Vanguard'
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, scope } = body;

    if (!uid || !scope) {
      return NextResponse.json({ error: 'Missing parameters: uid and scope are required' }, { status: 400 });
    }

    const validScopes = ['day', 'week', 'month', 'year'];
    if (!validScopes.includes(scope)) {
      return NextResponse.json({ error: `Invalid scope: must be one of ${validScopes.join(', ')}` }, { status: 400 });
    }

    // 1. Fetch raw data from Firestore to aggregate
    let completedTasks = 0;
    let habitCheckins = 0;
    let journalEntries = 0;
    let netSavings = 0;
    let achievements = 0;

    const daysLimit = scope === 'day' ? 1 : scope === 'week' ? 7 : scope === 'month' ? 30 : 365;
    const cutoffDate = new Date(Date.now() - daysLimit * 24 * 60 * 60 * 1000);

    const checkDate = (dateStr: string) => {
      try {
        const d = new Date(dateStr);
        return d >= cutoffDate;
      } catch (e) {
        return false;
      }
    };

    // A. Tasks Fetch
    try {
      const qSnap = await getDocs(collection(db, 'users', uid, 'tasks'));
      qSnap.forEach((doc) => {
        const data = doc.data();
        if (data.completed && data.dueDate && checkDate(data.dueDate)) {
          completedTasks++;
        }
      });
    } catch (e) {
      console.warn('Failed to query tasks:', e);
    }

    // B. Habits Fetch
    try {
      const qSnap = await getDocs(collection(db, 'users', uid, 'habits'));
      qSnap.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.completedDates)) {
          const matching = data.completedDates.filter((d: string) => checkDate(d));
          habitCheckins += matching.length;
        }
      });
    } catch (e) {
      console.warn('Failed to query habits:', e);
    }

    // C. Finance Fetch
    try {
      const qSnap = await getDocs(collection(db, 'users', uid, 'finance_transactions'));
      qSnap.forEach((doc) => {
        const data = doc.data();
        const txDate = data.date || data.createdAt;
        if (txDate && checkDate(txDate)) {
          netSavings += data.amount || 0;
        }
      });
    } catch (e) {
      console.warn('Failed to query finance:', e);
    }

    // D. Journal Fetch (Monolithic Store)
    try {
      const docSnap = await getDoc(doc(db, 'users', uid, 'store', 'life-os-journal'));
      if (docSnap.exists()) {
        const journalStore = JSON.parse(docSnap.data().value || '{}');
        const entries = journalStore.state?.entries || [];
        if (Array.isArray(entries)) {
          const matching = entries.filter((e: any) => e.date && checkDate(e.date));
          journalEntries = matching.length;
        }
      }
    } catch (e) {
      console.warn('Failed to query journal monolithic store:', e);
    }

    // E. Achievements Fetch
    try {
      const qSnap = await getDocs(collection(db, 'users', uid, 'achievements'));
      qSnap.forEach((doc) => {
        const data = doc.data();
        const dateAdded = data.dateAdded || data.createdAt;
        if (dateAdded && checkDate(dateAdded)) {
          achievements++;
        }
      });
    } catch (e) {
      console.warn('Failed to query achievements:', e);
    }

    const stats = {
      completedTasks,
      habitCheckins,
      journalEntries,
      netSavings,
      achievements
    };

    // 2. Run Gemini Generation
    const aiReplay = await generateAIReplayContent(scope, stats);

    // 3. Save Compiled Replay to Firestore
    const dateKey = new Date().toISOString().split('T')[0];
    const docId = `${scope}-${dateKey}`;
    const replayDocRef = doc(db, 'users', uid, 'life_replays', docId);

    const replayData = {
      id: docId,
      scope,
      date: dateKey,
      stats,
      aiReplay,
      createdAt: new Date().toISOString()
    };

    await setDoc(replayDocRef, replayData);

    return NextResponse.json({ success: true, data: replayData });
  } catch (error: any) {
    console.error('Error generating Cron Life Replay:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
