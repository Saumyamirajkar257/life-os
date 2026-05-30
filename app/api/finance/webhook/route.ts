import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const getGeminiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
};

// Use Gemini to convert foreign currencies to INR and categorize the transaction
async function processWebhookTransaction(merchant: string, amount: number, currency: string): Promise<any> {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    throw new Error('Missing Gemini API Key');
  }

  const systemPrompt = `You are the Financial Architect AI of LIFE OS.
Analyze a raw transaction. Convert foreign currencies to Indian Rupees (₹) using a baseline rate (e.g. 1 USD = 84.0 INR, 1 EUR = 91.0 INR).
Categorize the spend into one of the following: 'Food', 'Transport', 'Bills & Utilities', 'Entertainment', 'Shopping', 'Education', 'Salary', 'Investment'.
Clean up the merchant name (e.g. "UBER * TRIP 1234 HELP.UBER" -> "Uber Cab").
Format the output as a valid JSON object:
{
  "name": "Clean Merchant Name",
  "amount": number (positive value in INR),
  "category": "Food" | "Transport" | "Bills & Utilities" | "Entertainment" | "Shopping" | "Education" | "Salary" | "Investment",
  "notes": "Short audit note explaining the original foreign spending details."
}`;

  const userPrompt = `Raw Transaction: ${merchant}\nAmount: ${amount} ${currency}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
          responseMimeType: 'application/json'
        }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return JSON.parse(rawText.trim());
    } else {
      throw new Error(`Gemini status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to run Gemini transaction classification:', error);
    // Hardcoded high-fidelity fallback converter
    let convertedAmount = amount;
    let rate = 1.0;
    if (currency.toUpperCase() === 'USD') {
      rate = 84.0;
      convertedAmount = amount * 84.0;
    } else if (currency.toUpperCase() === 'EUR') {
      rate = 91.0;
      convertedAmount = amount * 91.0;
    }

    let category = 'Shopping';
    const lowerMerch = merchant.toLowerCase();
    if (lowerMerch.includes('uber') || lowerMerch.includes('cab') || lowerMerch.includes('ride') || lowerMerch.includes('train')) {
      category = 'Transport';
    } else if (lowerMerch.includes('starbucks') || lowerMerch.includes('mcdonald') || lowerMerch.includes('food') || lowerMerch.includes('rest')) {
      category = 'Food';
    } else if (lowerMerch.includes('steam') || lowerMerch.includes('netflix') || lowerMerch.includes('spotify') || lowerMerch.includes('disney')) {
      category = 'Entertainment';
    } else if (lowerMerch.includes('aws') || lowerMerch.includes('vercel') || lowerMerch.includes('github') || lowerMerch.includes('cloud')) {
      category = 'Bills & Utilities';
    }

    return {
      name: merchant.split('*')[0].trim() || merchant,
      amount: Math.round(convertedAmount),
      category,
      notes: `Offline Webhook Fallback. Converted original ${amount} ${currency} at baseline rate ${rate}.`
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, merchant, amount, currency } = body;

    if (!uid || !merchant || amount === undefined || !currency) {
      return NextResponse.json({ error: 'Missing parameters: uid, merchant, amount, and currency are required' }, { status: 400 });
    }

    // Call Gemini to convert and clean transaction details
    const parsedTx = await processWebhookTransaction(merchant, amount, currency);

    // Save transaction to Firestore
    const txId = `tx-webhook-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const txDocRef = doc(db, 'users', uid, 'finance_transactions', txId);

    const transactionData = {
      id: txId,
      name: parsedTx.name,
      amount: parsedTx.amount, // positive number for expense inside the store state
      category: parsedTx.category,
      notes: parsedTx.notes,
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    await setDoc(txDocRef, transactionData);

    return NextResponse.json({ success: true, transaction: transactionData });
  } catch (error: any) {
    console.error('Error handling Plaid finance webhook:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
