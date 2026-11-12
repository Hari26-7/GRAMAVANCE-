import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  try {
    const { message } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are 'Gramavance AI', an expert development assistant for rural micro-economies and Self-Help Groups (SHGs). Provide clear, step-by-step guidance on government grants, subsidy stacking, and financial readiness. Use Markdown, bullet points, and empathetic language."
    });

    const result = await model.generateContent(message);
    res.status(200).json({ text: await result.response.text() });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
