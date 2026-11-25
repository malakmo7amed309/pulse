import type { Channel, CustomerPage, CustomerQuery, DailyMetric, DateRange, Filters, Kpi, Overview, Plan, SeriesPoint, Customer } from '../types'
import { addDays, daysBetween, previousRange } from './date'
import { monthLabel, shortDate } from './format'
import { CHANNELS, PLANS } from '../data/metrics'

const inRange = (m: { date: string }, r: DateRange) => m.date >= r.from && m.date <= r.to
const planMatch = (plan: Plan, filter: Filters['plan']) => filter === 'All' || plan === filter

const sum = (rows: DailyMetric[], pick: (m: DailyMetric) => number) => rows.reduce((t, m) => t + pick(m), 0)
const delta = (value: number, previous: number) => (previous === 0 ? 0 : ((value - previous) / previous) * 100)
const kpi = (value: number, previous: number): Kpi => ({ value, previous, delta: delta(value, previous) })

/** Active users is a level, not a flow: take the value on the last day of the period. */
function activeOn(rows: DailyMetric[], day: string) {
  return sum(rows.filter((m) => m.date === day), (m) => m.activeUsers)
}

/** Churn rate: customers lost in the period as a share of the average active base. */
function churnRate(rows: DailyMetric[], range: DateRange) {
  const days = daysBetween(range.from, range.to)
  const lost = sum(rows, (m) => m.churned)
  const base = sum(rows, (m) => m.activeUsers) / days
  return base === 0 ? 0 : (lost / base) * 100
}

/** Pick a bucket size so a chart never has more than about 60 points. */
export function bucketSize(days: number) {
  return days <= 60 ? 1 : days <= 180 ? 7 : 30
}

function labelFor(date: string, size: number) {
  return size === 30 ? monthLabel(date) : shortDate(date)
}

export function buildOverview(all: DailyMetric[], filters: Filters): Overview {
  const range: DateRange = { from: filters.from, to: filters.to }
  const prev = previousRange(range)
  const mine = all.filter((m) => planMatch(m.plan, filters.plan))
  const cur = mine.filter((m) => inRange(m, range))
  const before = mine.filter((m) => inRange(m, prev))
  const days = daysBetween(range.from, range.to)

  const kpis = {
    revenue: kpi(sum(cur, (m) => m.revenue), sum(before, (m) => m.revenue)),
    users: kpi(activeOn(cur, range.to), activeOn(before, prev.to)),
    signups: kpi(sum(cur, (m) => m.signups), sum(before, (m) => m.signups)),
    churn: kpi(churnRate(cur, range), churnRate(before, prev)),
  }

  // Revenue and signups per day, then grouped into buckets.
  const size = bucketSize(days)
  const byDay = (rows: DailyMetric[]) => {
    const map = new Map<string, { revenue: number; signups: number }>()
    for (const m of rows) {
      const cell = map.get(m.date) ?? { revenue: 0, signups: 0 }
      cell.revenue += m.revenue
      cell.signups += m.signups
      map.set(m.date, cell)
    }
    return map
  }
  const curDays = byDay(cur)
  const prevDays = byDay(before)
  const series: SeriesPoint[] = []
  for (let start = 0; start < days; start += size) {
    let revenue = 0
    let previousRevenue = 0
    let signups = 0
    const end = Math.min(start + size, days)
    for (let i = start; i < end; i++) {
      revenue += curDays.get(addDays(range.from, i))?.revenue ?? 0
      signups += curDays.get(addDays(range.from, i))?.signups ?? 0
      previousRevenue += prevDays.get(addDays(prev.from, i))?.revenue ?? 0
    }
    const date = addDays(range.from, start)
    series.push({ date, label: labelFor(date, size), revenue, previousRevenue, signups })
  }

  const channels = CHANNELS.map((name: Channel) => ({ name, value: sum(cur, (m) => m.channel[name]) }))
  const plans = PLANS.filter((p) => planMatch(p, filters.plan)).map((name) => ({
    name,
    value: sum(cur.filter((m) => m.plan === name), (m) => m.revenue),
  }))

  return { kpis, series, channels, plans, days }
}

const planRank: Record<Plan, number> = { Starter: 0, Pro: 1, Enterprise: 2 }

export function queryCustomers(all: Customer[], query: CustomerQuery): CustomerPage {
  const q = query.q.trim().toLowerCase()
  let rows = all.filter((c) => {
    if (query.plan !== 'All' && c.plan !== query.plan) return false
    if (query.status !== 'All' && c.status !== query.status) return false
    if (!q) return true
    return [c.name, c.email, c.company, c.country, c.id].some((v) => v.toLowerCase().includes(q))
  })

  const dir = query.dir === 'asc' ? 1 : -1
  rows = [...rows].sort((a, b) => {
    switch (query.sort) {
      case 'name': return a.name.localeCompare(b.name) * dir
      case 'plan': return (planRank[a.plan] - planRank[b.plan]) * dir
      case 'status': return a.status.localeCompare(b.status) * dir
      case 'mrr': return (a.mrr - b.mrr) * dir
      case 'seats': return (a.seats - b.seats) * dir
      case 'joined': return a.joined.localeCompare(b.joined) * dir
    }
  })

  const total = rows.length
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize))
  const page = Math.min(Math.max(1, query.page), pageCount)
  const start = (page - 1) * query.pageSize
  return { rows: rows.slice(start, start + query.pageSize), total, page, pageCount }
}
