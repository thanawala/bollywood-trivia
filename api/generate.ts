import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Confirming key arrival
  const apiKey = process.env.API_KEY;
  console.log("DEBUG: Key detected, prefix:", apiKey ? apiKey.substring(0, 4) : "NONE");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "API Key missing in Vercel settings." });
  }

  try {
    // FIX: Pass the key inside an object { apiKey: ... }
    // This is the most reliable method for Node.js environments
    const genAI = new GoogleGenAI({ apiKey }); 
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const { category, minWords } = req.body;
    const prompt = `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ name: text.trim() });
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
