const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const compactUsd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })
const num = new Intl.NumberFormat('en-US')
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export const money = (n: number) => usd.format(n)
export const moneyCompact = (n: number) => compactUsd.format(n)
export const count = (n: number) => num.format(Math.round(n))
export const countCompact = (n: number) => compact.format(n)
export const percent = (n: number, digits = 1) => `${n.toFixed(digits)}%`
export const signed = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`

const md = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
const mdy = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const my = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' })

export const shortDate = (iso: string) => md.format(new Date(iso + 'T00:00:00Z'))
export const longDate = (iso: string) => mdy.format(new Date(iso + 'T00:00:00Z'))
export const monthLabel = (iso: string) => my.format(new Date(iso + 'T00:00:00Z'))
