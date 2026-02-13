import { GoogleGenAI } from "@google/genai";

export default async function handler(req: Request) {
  // 1. Standard safety check
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    const { category, minWords } = await req.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key missing in Vercel settings." }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Modern SDK constructor
    const ai = new GoogleGenAI({ apiKey });

    // Unified syntax for the generation call
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{
        role: 'user',
        parts: [{ text: `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.` }]
      }]
    });
    
    const text = response.text || "Engine error";

    return new Response(JSON.stringify({ name: text.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Vercel Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
