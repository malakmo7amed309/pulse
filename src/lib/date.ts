import type { DateRange } from '../types'

const DAY = 86_400_000

/** Parse an ISO date as UTC midnight so day maths never drifts with timezones. */
export const parse = (iso: string): number => Date.parse(iso + 'T00:00:00Z')
export const iso = (ms: number): string => new Date(ms).toISOString().slice(0, 10)
export const addDays = (isoDate: string, n: number): string => iso(parse(isoDate) + n * DAY)
export const daysBetween = (from: string, to: string): number => Math.round((parse(to) - parse(from)) / DAY) + 1

/** The dataset ends on a fixed day so the demo looks the same for everyone. */
export const DATA_END = '2026-11-24'
export const DATA_START = '2025-01-01'

export const PRESETS = [
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
  { id: '12m', label: '12 months', days: 365 },
] as const

export function presetRange(days: number): DateRange {
  return { from: addDays(DATA_END, -(days - 1)), to: DATA_END }
}

/** The period of equal length immediately before `range`. */
export function previousRange(range: DateRange): DateRange {
  const n = daysBetween(range.from, range.to)
  return { from: addDays(range.from, -n), to: addDays(range.from, -1) }
}

export function clampRange(range: DateRange): DateRange {
  let { from, to } = range
  if (from > to) [from, to] = [to, from]
  if (from < DATA_START) from = DATA_START
  if (to > DATA_END) to = DATA_END
  if (from > to) from = to
  return { from, to }
}

export const isValidIso = (s: string | null): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(parse(s))
