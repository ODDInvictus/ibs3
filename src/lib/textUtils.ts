export function formatPrice(price: number): string {
  return price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

export function getSlug(title: string): string {
  return title.toLowerCase().replace(/ /g, '-')
}