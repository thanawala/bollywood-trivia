import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Debugging: Check for the Key
  const apiKey = process.env.API_KEY;
  console.log("DEBUG: Key Prefix:", apiKey ? apiKey.substring(0, 4) : "MISSING");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "Server error: API_KEY is not defined." });
  }

  try {
    // 2. Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // 3. Get input from req.body (Auto-parsed in Vercel Node.js)
    const { category, minWords } = req.body;
    const prompt = `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Send standard JSON response
    return res.status(200).json({ name: text.trim() });
  } catch (error: any) {
    console.error("Gemini Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
