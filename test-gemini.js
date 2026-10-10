const { GoogleGenAI } = require('@google/genai');
async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Calling Gemini...');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Respond with a simple JSON object: {"status": "ok"}',
      config: {
        responseMimeType: 'application/json',
      },
    });
    console.log('Success:', response.text);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
test();
