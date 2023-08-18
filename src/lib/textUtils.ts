export function formatPrice(price: number): string {
  return price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

export function getSlug(id: number, title: string): string {
  return '' + id + '-' + title.toLowerCase().replace(/ /g, '-')
}

export function prettySlug(slug: string): string {
  return slug.replace(/-/g, ' ')
}

export function mergeClassNames(...classNames: string[]): string {
  if (classNames.length === 0) return ''
  if (classNames.length === 1) return classNames[0]
  return classNames.join(' ')
}