import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  generateDailyBriefing,
  detectBurnout,
  generateInsights,
  generateGoalMilestones,
  calculateLifeScore,
  askConversationalCoach,
} from '@/services/ai';

const getGeminiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
};

// Generate query embedding using text-embedding-004
async function getQueryEmbedding(text: string): Promise<number[]> {
  const apiKey = getGeminiKey();
  if (!apiKey) return [];
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.embedding?.values || [];
    }
  } catch (e) {
    console.error('Failed to get query embedding:', e);
  }
  return [];
}

// Dot product similarity calculation
function calculateSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, context, goalName, goalType, message, uid } = body;

    switch (action) {
      case 'briefing': {
        const briefing = await generateDailyBriefing(context);
        return NextResponse.json(briefing);
      }
      case 'burnout': {
        const status = await detectBurnout(context);
        return NextResponse.json(status);
      }
      case 'insights': {
        const insights = await generateInsights(context);
        return NextResponse.json(insights);
      }
      case 'milestones': {
        const milestones = await generateGoalMilestones(goalName, goalType);
        return NextResponse.json(milestones);
      }
      case 'lifescore': {
        const score = await calculateLifeScore(context);
        return NextResponse.json(score);
      }
      case 'chat': {
        let semanticContext = '';

        if (uid && message) {
          try {
            // 1. Generate Query Vector
            const queryVector = await getQueryEmbedding(message);

            if (queryVector.length > 0) {
              // 2. Fetch User Vault Embeddings from Firestore
              const colRef = collection(db, 'users', uid, 'vault_embeddings');
              const qSnap = await getDocs(colRef);
              
              const scoredDocs: { title: string; category: string; notes: string; score: number }[] = [];

              qSnap.forEach((doc) => {
                const data = doc.data();
                if (data.vector && Array.isArray(data.vector)) {
                  const score = calculateSimilarity(queryVector, data.vector);
                  scoredDocs.push({
                    title: data.title,
                    category: data.category,
                    notes: data.notes,
                    score
                  });
                }
              });

              // 3. Sort by similarity score desc
              scoredDocs.sort((a, b) => b.score - a.score);

              // 4. Extract top 3 matches above a threshold (e.g. 0.3)
              const topMatches = scoredDocs.filter(d => d.score > 0.3).slice(0, 3);
              if (topMatches.length > 0) {
                semanticContext = topMatches.map(m => 
                  `- [${m.category}] ${m.title}: "${m.notes}" (Similarity: ${Math.round(m.score * 100)}%)`
                ).join('\n');
              }
            }
          } catch (e) {
            console.warn('RAG semantic search failed, defaulting to basic prompt context:', e);
          }
        }

        const response = await askConversationalCoach(message, context, semanticContext);
        return NextResponse.json({ response });
      }
      default:
        return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
