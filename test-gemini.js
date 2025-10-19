import { GoogleGenerativeAI } from '@google/generative-ai'

// ✅ Replace with your actual key or load from env
const genAI = new GoogleGenerativeAI('AIzaSyAoVKRjf0vyAQuBcxSl8-QumSuB7izvES8')

async function testGemini() {
  try {
    const models = await genAI.listModels()
    console.log(models)

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(
      "Say 'Hello from Gemini 1.5 Flash!' in a friendly tone."
    )
    console.log('✅ Success! Gemini responded:')
    console.log(result.response.text())
  } catch (err) {
    console.error('❌ Error while calling Gemini API:')
    console.error(err)
  }
}

testGemini()
