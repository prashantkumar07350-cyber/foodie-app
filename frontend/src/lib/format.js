export function money(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '₹0'
  return '₹' + (Number.isInteger(n) ? n : n.toFixed(2)).toLocaleString('en-IN')
}

export function deliveryLabel(fee) {
  return Number(fee) === 0 ? 'Free delivery' : money(fee) + ' delivery'
}

export function minOrderLabel(min) {
  return Number(min) > 0 ? 'Min ' + money(min) : ''
}