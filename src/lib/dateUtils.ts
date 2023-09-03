export function getDutchMonth(date: Date) {
  switch (date.getMonth()) {
    case 0:
      return 'januari';
    case 1:
      return 'februari';
    case 2:
      return 'maart';
    case 3:
      return 'april';
    case 4:
      return 'mei';
    case 5:
      return 'juni';
    case 6:
      return 'juli';
    case 7:
      return 'augustus';
    case 8:
      return 'september';
    case 9:
      return 'oktober';
    case 10:
      return 'november';
    case 11:
      return 'december';
    default:
      return 'onbekend';
  }
}

export function formatDateHumanReadable(date: Date): string {
  return date.toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateTimeHumanReadable(date: Date): string {
  return date.toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}

export function formatDateMonthYear(date: Date | null) {
  if (!date) return 'datum onbekend'

  return date.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long' })
}

export function toDateString(date: Date | null) {
  if (!date) return 'datum onbekend'

  return date.toLocaleDateString('nl')
}

export function toBirthday(date: Date | null) {
  if (!date) return 'datum onbekend'

  const month = getDutchMonth(date)
  const day = date.getDate()

  return `${day} ${month}`
}

export function daysLeftTill(date: Date | null) {
  if (!date) return -1

  const today = new Date()
  const dateCopy = new Date(date)

  // Set both times to 00:00:00
  dateCopy.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  dateCopy.setFullYear(today.getFullYear())

  // If the date is in the past, add a year
  if (dateCopy.getTime() < today.getTime()) {
    dateCopy.setFullYear(dateCopy.getFullYear() + 1)
  }

  const days = Math.floor((dateCopy.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return days
}

export function toAge(birthDate: Date | null) {
  if (!birthDate) return -1

  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }

  return age;
}