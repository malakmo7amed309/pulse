import type { Customer } from '../types'

const cell = (v: string | number) => {
  const s = String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function customersToCsv(rows: Customer[]): string {
  const head = ['ID', 'Name', 'Email', 'Company', 'Plan', 'Status', 'MRR (USD)', 'Seats', 'Country', 'Joined']
  const lines = rows.map((c) => [c.id, c.name, c.email, c.company, c.plan, c.status, c.mrr, c.seats, c.country, c.joined].map(cell).join(','))
  return [head.join(','), ...lines].join('\n')
}

export function downloadText(filename: string, text: string, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
