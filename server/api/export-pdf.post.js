// server/api/export-pdf.post.js
import puppeteer from 'puppeteer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { html, fileName = 'itinerary.pdf' } = body

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
  })

  await browser.close()

  // Return PDF
  event.node.res.setHeader('Content-Type', 'application/pdf')
  event.node.res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  event.node.res.end(pdfBuffer)
})
