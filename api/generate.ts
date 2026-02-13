import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Confirm the API key is reaching the server
  const apiKey = process.env.API_KEY;
  console.log("DEBUG: Key Prefix:", apiKey ? apiKey.substring(0, 4) : "MISSING");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "Server error: API_KEY is not defined in Vercel." });
  }

try {
    const ai = new GoogleGenAI({ apiKey });
    
    const { category, minWords } = req.body;
    const prompt = `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.`;
    
    // FIX: Pass the model name as a direct string without the "models/" prefix
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }] // Full schema for v1beta
    });

    return res.status(200).json({ name: response.text.trim() });
    
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
