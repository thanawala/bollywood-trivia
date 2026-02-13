import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // 1. Get the data sent from your frontend
  const { category, minWords } = await req.json();
  
  // 2. Access the API Key (Securely on the server)
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API Key not found in Vercel settings." }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const ai = new GoogleGenAI(apiKey);
    // Using 1.5-flash as it is fast and reliable for this type of task
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ name: text.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
