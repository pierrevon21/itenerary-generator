import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyAoVKRjf0vyAQuBcxSl8-QumSuB7izvES8')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { location } = body

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const prompt = `
You are a local travel expert specializing in Philippine destinations.  
Create a detailed 3-day travel itinerary for ${location}, Philippines.  

Requirements:
- Include top attractions, hidden gems, and cultural highlights.  
- Suggest local dishes or restaurants to try each day.  
- Add practical travel tips (e.g., best time to visit, transportation, budgeting).  
- Use a friendly, conversational tone that feels like a local guide.  
- For each attraction, include:
  - A short description (1–2 sentences)
  - A Google Maps link to the exact location (use format: "📍 [Place Name](https://www.google.com/maps?q=Place+Name,+Location)")
  - Do **not** use placeholder URLs — generate real map search links.
- Format neatly and clearly with sections like:

  🗓️ **Day 1 – [Theme or Focus]**
  - Morning:
  - Afternoon:
  - Evening:
  - 💡 Travel Tip:
  - 🍽️ Food to Try:
  - 🗺️ View all locations on Google Maps

  🗓️ **Day 2 – ...**
  ... and so on.

- End with a short summary paragraph highlighting the overall vibe of the trip.  
- Provide at least one credible reference or tourism website link about ${location} at the end (e.g., official tourism page or travel guide).  
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  return { itinerary: text }
})
