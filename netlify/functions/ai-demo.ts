import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { goal } = JSON.parse(event.body || '{}');
    if (!goal) return { statusCode: 400, body: JSON.stringify({ error: 'Goal is required' }) };

    const anthropicKey = process.env.NEXT_PUBLIC_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY || '';
    
    if (!anthropicKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Anthropic API key is missing' }) };
    }

    const makeRequest = async (modelName: string) => {
      return fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: modelName,
          max_tokens: 400,
          system: "You are LIFE OS, an AI life coach. When given a goal, respond with a concise, motivating 5-step action plan. Use short bullet points. Keep it under 150 words. Be specific and practical.",
          messages: [{ role: 'user', content: goal }]
        })
      });
    };

    let response = await makeRequest('claude-haiku-4-5-20251001');

    if (!response.ok) {
      const errorText = await response.text();
      // Fallback
      if (response.status === 400 && errorText.includes('model')) {
        response = await makeRequest('claude-3-5-haiku-20241022');
        if (!response.ok) {
           throw new Error(`API Error: ${await response.text()}`);
        }
      } else {
        throw new Error(`API Error: ${errorText}`);
      }
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ text: data.content[0].text }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error: any) {
    console.error('AI Demo Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to generate plan' }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
};
