const { GoogleGenAI } = require('@google/genai');

async function listModels() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const models = await ai.models.list();
    for (const m of models) {
      console.log(m.name);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}
listModels();
