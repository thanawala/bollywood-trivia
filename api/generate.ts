import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. Keep the debug log to be safe
  console.log("DEBUG: Key starts with:", process.env.API_KEY ? process.env.API_KEY.substring(0, 4) : "UNDEFINED");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing in Vercel settings." });
  }

  try {
    // FIX: Pass the apiKey directly as a string to the constructor
    const genAI = new GoogleGenAI(apiKey);
    
    // Explicitly set the model version
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
