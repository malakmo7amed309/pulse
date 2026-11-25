export type Plan = 'Starter' | 'Pro' | 'Enterprise'
export type PlanFilter = Plan | 'All'
export type Status = 'Active' | 'Trial' | 'Churned'
export type Channel = 'Organic' | 'Paid' | 'Referral' | 'Outbound'

/** One row per calendar day, per plan. The whole dashboard is derived from these. */
export interface DailyMetric {
  date: string // ISO yyyy-mm-dd
  plan: Plan
  revenue: number // USD
  signups: number
  activeUsers: number
  churned: number
  channel: Record<Channel, number> // signups per acquisition channel
}

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  plan: Plan
  status: Status
  mrr: number
  seats: number
  country: string
  joined: string // ISO date
}

export interface DateRange {
  from: string
  to: string
}

export interface Filters extends DateRange {
  plan: PlanFilter
}

export interface Kpi {
  value: number
  previous: number
  /** Percent change versus the previous period of the same length. */
  delta: number
}

export interface SeriesPoint {
  date: string
  label: string
  revenue: number
  previousRevenue: number
  signups: number
}

export interface Overview {
  kpis: { revenue: Kpi; users: Kpi; signups: Kpi; churn: Kpi }
  series: SeriesPoint[]
  channels: { name: Channel; value: number }[]
  plans: { name: Plan; value: number }[]
  days: number
}

export type SortKey = 'name' | 'plan' | 'status' | 'mrr' | 'seats' | 'joined'
export type SortDir = 'asc' | 'desc'

export interface CustomerQuery {
  q: string
  plan: PlanFilter
  status: Status | 'All'
  sort: SortKey
  dir: SortDir
  page: number
  pageSize: number
}

export interface CustomerPage {
  rows: Customer[]
  total: number
  page: number
  pageCount: number
}
