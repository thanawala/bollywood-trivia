import { GoogleGenAI } from "@google/genai";

export default async function handler(req: Request) {
  // 1. Check if it's a POST request
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
  }

  try {
    const { category, minWords } = await req.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key missing in Vercel settings." }), { status: 500 });
    }

    // NEW UNIFIED SYNTAX:
    // The constructor expects an object with apiKey, not just a string
    const ai = new GoogleGenAI({ apiKey });

    // In the new SDK, we call ai.models.generateContent directly
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{
        role: 'user',
        parts: [{ text: `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.` }]
      }]
    });
    
    // The response structure has also changed in the unified SDK
    const text = response.text || "Engine error";

    return new Response(JSON.stringify({ name: text.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
