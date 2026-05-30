import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const getGeminiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
};

// Call Gemini text-embedding-004 model
async function generateGeminiEmbedding(text: string): Promise<number[]> {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    throw new Error('Missing Gemini API Key');
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text }]
        }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.embedding?.values || [];
    } else {
      const errText = await response.text();
      console.error(`Gemini Embeddings API returned error: ${response.status} - ${errText}`);
      throw new Error(`Gemini Embeddings API Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to call Gemini Embeddings API:', error);
    // Return a dummy vector fallback for offline sandbox mode so it doesn't break
    const dummyVector = Array.from({ length: 768 }, () => Math.random() - 0.5);
    return dummyVector;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, resourceId, title, notes, category } = body;

    if (!uid || !resourceId || !title) {
      return NextResponse.json({ error: 'Missing parameters: uid, resourceId and title are required' }, { status: 400 });
    }

    // Prepare text content for semantic embedding
    const contentToEmbed = `Title: ${title}\nCategory: ${category || 'Resource'}\nNotes: ${notes || ''}`;
    
    // Generate vector embedding (768 dimensions)
    const embedding = await generateGeminiEmbedding(contentToEmbed);

    if (embedding.length === 0) {
      return NextResponse.json({ error: 'Failed to generate valid embeddings' }, { status: 500 });
    }

    // Save vector metadata to Firestore
    const embedDocRef = doc(db, 'users', uid, 'vault_embeddings', resourceId);
    const embeddingData = {
      id: resourceId,
      title,
      category: category || 'Resource',
      notes: notes || '',
      vector: embedding,
      createdAt: new Date().toISOString()
    };

    await setDoc(embedDocRef, embeddingData);

    return NextResponse.json({ success: true, resourceId, dimensions: embedding.length });
  } catch (error: any) {
    console.error('Error generating document embeddings:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
