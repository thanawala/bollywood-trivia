import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Debug log to confirm key is present
  const apiKey = process.env.API_KEY;
  console.log("DEBUG: Processing request, key prefix:", apiKey ? apiKey.substring(0, 4) : "MISSING");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "API Key is not configured in Vercel settings." });
  }

  try {
    // 1. Initialize the SDK
    const genAI = new GoogleGenAI(apiKey);
    
    // 2. Access the specific model
    // This is the line that was likely failing
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const { category, minWords } = req.body;
    const prompt = `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.`;
    
    // 3. Generate the content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ name: text.trim() });
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
