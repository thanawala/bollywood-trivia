import { GoogleGenerativeAI } from "@google/genai";

export default async function handler(req, res) {
  // Confirming key arrival for debugging
  const apiKey = process.env.API_KEY;
  console.log("DEBUG: Processing request, key prefix:", apiKey ? apiKey.substring(0, 4) : "NONE");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing in Vercel settings." });
  }

  try {
    // 1. INITIALIZE: Pass the key directly as a string
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. GET MODEL: Use the 1.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const { category, minWords } = req.body;
    const prompt = `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.`;
    
    // 3. GENERATE: The result contains the response data
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ name: text.trim() });
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
