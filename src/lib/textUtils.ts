export function formatPrice(price: number): string {
  return price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

export function getSlug(id: number, title: string): string {
  return '' + id + '-' + title.toLowerCase().replace(/ /g, '-')
}

export function prettySlug(slug: string): string {
  return slug.replace(/-/g, ' ')
}