import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CustomerQuery, PlanFilter, SortDir, SortKey, Status } from '../types'
import { PLANS } from '../data/metrics'

export const PAGE_SIZE = 10
const SORT_KEYS: SortKey[] = ['name', 'plan', 'status', 'mrr', 'seats', 'joined']
const STATUSES: Status[] = ['Active', 'Trial', 'Churned']

/** Search, filters, sort and page all live in the URL. */
export function useCustomerQuery() {
  const [params, setParams] = useSearchParams()

  const query: CustomerQuery = useMemo(() => {
    const sort = SORT_KEYS.find((k) => k === params.get('sort')) ?? 'mrr'
    const dir: SortDir = params.get('dir') === 'asc' ? 'asc' : params.get('dir') === 'desc' ? 'desc' : sort === 'name' ? 'asc' : 'desc'
    const page = Number.parseInt(params.get('page') ?? '1', 10)
    return {
      q: params.get('q') ?? '',
      plan: (PLANS.find((p) => p === params.get('plan')) ?? 'All') as PlanFilter,
      status: STATUSES.find((s) => s === params.get('status')) ?? 'All',
      sort,
      dir,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: PAGE_SIZE,
    }
  }, [params])

  const update = useCallback(
    (patch: Partial<Record<'q' | 'plan' | 'status' | 'sort' | 'dir' | 'page', string>>, resetPage = true) => {
      const next = new URLSearchParams(params)
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === '' || value === 'All') next.delete(key)
        else next.set(key, value)
      }
      if (resetPage && !('page' in patch)) next.delete('page')
      setParams(next, { replace: true })
    },
    [params, setParams],
  )

  const sortBy = useCallback(
    (key: SortKey) => {
      // Clicking the active column flips direction; a new column starts sensible.
      const dir: SortDir = query.sort === key ? (query.dir === 'asc' ? 'desc' : 'asc') : key === 'name' ? 'asc' : 'desc'
      update({ sort: key, dir })
    },
    [query.sort, query.dir, update],
  )

  const clear = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams])

  return { query, update, sortBy, clear }
}
