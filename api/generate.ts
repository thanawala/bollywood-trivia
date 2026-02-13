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

    // FIX: Use the latest supported model ID
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt
    });

    return res.status(200).json({ name: response.text.trim() });
    
  } catch (error: any) {
    // If it STILL says 404, the model might have been fully retired.
    // Try updating to "gemini-2.0-flash" for the latest support.
    console.error("Gemini API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
