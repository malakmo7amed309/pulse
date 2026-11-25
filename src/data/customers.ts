import type { Customer, Plan, Status } from '../types'
import { addDays, DATA_END } from '../lib/date'
import { createRandom } from './random'

const FIRST = ['Amira', 'Omar', 'Layla', 'Youssef', 'Nour', 'Karim', 'Salma', 'Hassan', 'Mariam', 'Tarek', 'Dina', 'Ali', 'Hana', 'Sara', 'Mostafa', 'Rana', 'Ahmed', 'Farah', 'Ziad', 'Malak', 'Emma', 'Liam', 'Sofia', 'Noah', 'Chloe', 'Lucas', 'Aisha', 'Ravi', 'Mei', 'Jonas']
const LAST = ['Hassan', 'Mahmoud', 'Farouk', 'Saleh', 'Nasser', 'Ibrahim', 'Khalil', 'Fathy', 'Adel', 'Samir', 'Rizk', 'Morsi', 'Walker', 'Martin', 'Silva', 'Novak', 'Patel', 'Tanaka', 'Keller', 'Dubois', 'Moreau', 'Haddad']
const COMPANY_A = ['Nile', 'Delta', 'Atlas', 'Lumen', 'Orbit', 'Cairo', 'Pixel', 'Harbor', 'Summit', 'Vertex', 'Cedar', 'Bright', 'Northwind', 'Blue', 'Kite']
const COMPANY_B = ['Labs', 'Systems', 'Works', 'Studio', 'Cloud', 'Retail', 'Logistics', 'Health', 'Media', 'Finance', 'Learning']
const COUNTRIES = ['Egypt', 'UAE', 'Saudi Arabia', 'United Kingdom', 'Germany', 'United States', 'France', 'Canada', 'India', 'Netherlands']

const PRICE_PER_SEAT: Record<Plan, number> = { Starter: 12, Pro: 29, Enterprise: 74 }
const SEATS: Record<Plan, [number, number]> = { Starter: [1, 8], Pro: [4, 40], Enterprise: [40, 400] }

function generate(): Customer[] {
  const rnd = createRandom(424242)
  const list: Customer[] = []
  for (let i = 0; i < 248; i++) {
    const first = rnd.pick(FIRST)
    const last = rnd.pick(LAST)
    const company = `${rnd.pick(COMPANY_A)} ${rnd.pick(COMPANY_B)}`
    const r = rnd.next()
    const plan: Plan = r < 0.55 ? 'Starter' : r < 0.88 ? 'Pro' : 'Enterprise'
    const s = rnd.next()
    const status: Status = s < 0.72 ? 'Active' : s < 0.86 ? 'Trial' : 'Churned'
    const [lo, hi] = SEATS[plan]
    const seats = rnd.int(lo, hi)
    list.push({
      id: `C-${String(1001 + i)}`,
      name: `${first} ${last}`,
      email: `${first}.${last}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      company,
      plan,
      status,
      mrr: status === 'Trial' ? 0 : seats * PRICE_PER_SEAT[plan],
      seats,
      country: rnd.pick(COUNTRIES),
      joined: addDays(DATA_END, -rnd.int(0, 690)),
    })
  }
  return list
}

let cache: Customer[] | null = null
export function getCustomers(): Customer[] {
  return (cache ??= generate())
}
