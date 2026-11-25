import type { CustomerPage, CustomerQuery, Filters, Overview } from '../types'
import { buildOverview, queryCustomers } from '../lib/analytics'
import { getCustomers } from './customers'
import { getDailyMetrics } from './metrics'

/**
 * A pretend backend. Each call waits a little and can be told to fail, so the
 * loading and error states in the UI are real code paths, not mock-ups.
 * Swapping this file for fetch() calls is the only change a real API needs.
 */
export interface ApiSettings {
  latencyMs: number
  failing: boolean
}

export const apiSettings: ApiSettings = { latencyMs: 600, failing: false }

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function respond<T>(produce: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (apiSettings.failing) reject(new ApiError('The analytics service did not respond.'))
      else resolve(produce())
    }, apiSettings.latencyMs)
  })
}

export const fetchOverview = (filters: Filters) => respond<Overview>(() => buildOverview(getDailyMetrics(), filters))
export const fetchCustomers = (query: CustomerQuery) => respond<CustomerPage>(() => queryCustomers(getCustomers(), query))
