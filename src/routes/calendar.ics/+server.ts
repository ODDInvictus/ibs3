import { generateActivityIcal } from '$lib/server/calendar/ical'

export async function GET() {
  const ical = await generateActivityIcal()

  // Nu nog headers enzo...
  // En authenticatie

  const res = new Response(ical)

  res.headers.set('Content-Type', 'text/calendar')

  return res
}