import { ICalService } from '../../lib/server/calendar/ical'

export async function GET() {
  const ical = new ICalService()
  const calendar = await ical.generateCommonIcal()

  // Nu nog headers enzo...
  // En authenticatie

  const res = new Response(calendar)

  res.headers.set('Content-Type', 'text/calendar')

  return res
}