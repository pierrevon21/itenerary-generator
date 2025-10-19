export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  const username = 'pierrevon23'

  try {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?country=PH&featureClass=P&maxRows=10&orderby=population&username=${username}&q=${q}`
    )

    const text = await response.text()

    try {
      const data = JSON.parse(text)
      return data
    } catch {
      console.error('GeoNames non-JSON response:', text)
      throw createError({ statusCode: 500, statusMessage: 'Invalid response from GeoNames' })
    }
  } catch (err) {
    console.error('GeoNames proxy error:', err)
    throw createError({ statusCode: 500, statusMessage: 'GeoNames fetch failed' })
  }
})
