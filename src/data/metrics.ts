import type { Channel, DailyMetric, Plan } from '../types'
import { addDays, DATA_END, DATA_START, daysBetween, parse } from '../lib/date'
import { createRandom } from './random'

export const PLANS: readonly Plan[] = ['Starter', 'Pro', 'Enterprise']
export const CHANNELS: readonly Channel[] = ['Organic', 'Paid', 'Referral', 'Outbound']

/** Per-plan shape of the business: how big it starts, how fast it grows, how it churns. */
const PLAN_MODEL: Record<Plan, { base: number; growth: number; users: number; churn: number; signups: number }> = {
  Starter: { base: 900, growth: 1.1, users: 1800, churn: 0.0022, signups: 9 },
  Pro: { base: 1700, growth: 1.9, users: 760, churn: 0.0012, signups: 4.2 },
  Enterprise: { base: 2100, growth: 2.4, users: 90, churn: 0.0006, signups: 0.55 },
}

const CHANNEL_MIX: Record<Plan, number[]> = {
  Starter: [0.38, 0.3, 0.22, 0.1],
  Pro: [0.3, 0.26, 0.24, 0.2],
  Enterprise: [0.12, 0.1, 0.28, 0.5],
}

/** Weekday shape: weekends are quieter. Index 0 is Sunday. */
const WEEKDAY = [0.7, 1.02, 1.08, 1.1, 1.06, 0.98, 0.72]

function generate(): DailyMetric[] {
  const rnd = createRandom(20261124)
  const total = daysBetween(DATA_START, DATA_END)
  const rows: DailyMetric[] = []
  const users: Record<Plan, number> = { Starter: PLAN_MODEL.Starter.users, Pro: PLAN_MODEL.Pro.users, Enterprise: PLAN_MODEL.Enterprise.users }

  for (let i = 0; i < total; i++) {
    const date = addDays(DATA_START, i)
    const weekday = new Date(parse(date)).getUTCDay()
    const month = new Date(parse(date)).getUTCMonth()
    // Mild seasonality: a dip in summer, a push in November and December.
    const season = 1 + (month === 10 || month === 11 ? 0.08 : 0) - (month >= 5 && month <= 7 ? 0.05 : 0)

    for (const plan of PLANS) {
      const m = PLAN_MODEL[plan]
      const trend = m.base + m.growth * i
      const revenue = Math.max(0, Math.round(trend * WEEKDAY[weekday] * season * (1 + rnd.noise(0.12))))
      const signups = Math.max(0, Math.round(m.signups * WEEKDAY[weekday] * season * (1 + i / 700) * (1 + rnd.noise(0.5))))
      const churned = Math.max(0, Math.round(users[plan] * m.churn * (1 + rnd.noise(0.9))))
      users[plan] = Math.max(1, users[plan] + signups - churned)

      const channel = { Organic: 0, Paid: 0, Referral: 0, Outbound: 0 } as Record<Channel, number>
      for (let s = 0; s < signups; s++) {
        let r = rnd.next()
        let c = 0
        while (c < 3 && r > CHANNEL_MIX[plan][c]) {
          r -= CHANNEL_MIX[plan][c]
          c++
        }
        channel[CHANNELS[c]]++
      }
      rows.push({ date, plan, revenue, signups, activeUsers: users[plan], churned, channel })
    }
  }
  return rows
}

/** Generated once, on first use. About 2,000 rows. */
let cache: DailyMetric[] | null = null
export function getDailyMetrics(): DailyMetric[] {
  return (cache ??= generate())
}
