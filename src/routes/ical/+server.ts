import { generateActivityIcal } from '$lib/server/calendar/ical'

export async function GET() {
  const ical = await generateActivityIcal()

  // Nu nog headers enzo...

  return new Response(ical)
}