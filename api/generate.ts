import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. Only allow POST requests from your app
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 2. In Node.js runtime, data is in req.body
    const { category, minWords } = req.body;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("API_KEY is missing in Vercel settings.");
      return res.status(500).json({ error: "API Key not configured on server." });
    }

    // 3. Initialize Gemini
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No quotes.`;
    
    // 4. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send the JSON response back
    return res.status(200).json({ name: text.trim() });

  } catch (error: any) {
    console.error("Vercel Function Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
