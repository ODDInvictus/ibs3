
// Currently in dark mode?
export function isDarkMode(): boolean {
  return !!document.querySelector(':root')?.classList.contains('dark');
}

// Randomly sort an array where the result is the same every day, but different every day
export function randomSortDay<T>(array: T[]): T[] {
  const date = new Date()
  const num = date.getDate() + date.getMonth() + date.getFullYear()
  return shuffle(array, num)
}

function shuffle<T>(array: T[], num: number): T[] {
  let currentIndex = array.length,  randomIndex;
  const random = seed(num)

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function seed(s: number) {
  const mask = 0xffffffff;
  let m_w  = (123456789 + s) & mask;
  let m_z  = (987654321 - s) & mask;

  return function() {
    m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

    let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
  }
}

type ICalEventType = {
  title: string
  eventId: string
  description?: string
  location?: string
  startTime: Date
  endTime?: Date
  url?: string
}

/*
 ICal functions inspired by
 https://github.com/josephj/react-icalendar-link
*/

export function generateICal(event: ICalEventType) {
  const body: string[] = []

  const endTime: Date = event.endTime ?? new Date(event.startTime.getTime())

  if (!event.endTime) {
    endTime.setHours(endTime.getHours() + 1)
  }

  body.push('BEGIN:VCALENDAR')
  body.push('VERSION:2.0')
  body.push('PRODID:-//O.D.D. Invictus//Invictus Bier Systeem//NL')
  body.push('BEGIN:VEVENT')
  body.push(`DTSTAMP:${formatDate(new Date())}`)
  body.push(`DTSTART:${formatDate(event.startTime)}`)
  body.push(`UID:uid_${event.eventId}.ical@oddinvictus.nl`)
  body.push(`SUMMARY:${event.title}`)
  body.push(`DTEND:${formatDate(endTime)}`)
  if (event.url) body.push(`URL:${event.url}`)
  if (event.description) body.push(`DESCRIPTION:${event.description} \n ${event.url}`)
  if (event.location) body.push(`LOCATION:${event.location}`)
  body.push('END:VEVENT')
  body.push('END:VCALENDAR')

  return `data:text/calendar;charset=utf8,${encodeURIComponent(body.join('\n'))}`
}

export function formatDate(dateTime: Date): string {
  return [
    dateTime.getUTCFullYear(),
    pad(dateTime.getUTCMonth() + 1),
    pad(dateTime.getUTCDate()),
    "T",
    pad(dateTime.getUTCHours()),
    pad(dateTime.getUTCMinutes()) + "00Z"
  ].join("");
}


export function pad(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }
  return `${num}`;
}