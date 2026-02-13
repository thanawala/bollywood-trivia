import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // This confirms the key is reaching the Vercel server
  console.log("DEBUG: Key starts with:", process.env.API_KEY ? process.env.API_KEY.substring(0, 4) : "UNDEFINED");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key missing in Vercel settings." });
  }

  try {
    // FIX: Instead of just passing 'apiKey', pass an object with the property 'apiKey'
    const genAI = new GoogleGenAI(apiKey); 
    
    // Explicitly fetching the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const { category, minWords } = req.body;
    const prompt = `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ name: text.trim() });
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    // If the error persists, this will tell us if it's a 'key' issue or a 'model' issue
    return res.status(500).json({ error: error.message });
  }
}
