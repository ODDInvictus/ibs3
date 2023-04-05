export function formatPrice(price: number): string {
  return price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}