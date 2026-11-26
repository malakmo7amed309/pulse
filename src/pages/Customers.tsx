import { useEffect, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Badge, type Tone } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Pagination } from '../components/ui/Pagination'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState, ErrorState } from '../components/ui/StateViews'
import { CustomerDrawer } from '../components/customers/CustomerDrawer'
import { customersToCsv, downloadText } from '../lib/csv'
import { getCustomers } from '../data/customers'
import { queryCustomers } from '../lib/analytics'
import { ArrowDownIcon, ArrowUpIcon, DownloadIcon, SearchIcon } from '../components/ui/icons'
import { fetchCustomers } from '../data/api'
import { PLANS } from '../data/metrics'
import { useAsync } from '../hooks/useAsync'
import { PAGE_SIZE, useCustomerQuery } from '../hooks/useCustomerQuery'
import { count, longDate, money } from '../lib/format'
import type { Customer, Plan, PlanFilter, SortKey, Status } from '../types'

const STATUS_TONE: Record<Status, Tone> = { Active: 'green', Trial: 'amber', Churned: 'slate' }
const PLAN_TONE: Record<Plan, Tone> = { Starter: 'slate', Pro: 'indigo', Enterprise: 'violet' }

const field = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

interface Column {
  key: SortKey
  label: string
  align?: 'right'
  /** Hide on small screens so the table fits without scrolling. */
  hide?: 'sm' | 'md' | 'lg'
}

const COLUMNS: Column[] = [
  { key: 'name', label: 'Customer' },
  { key: 'plan', label: 'Plan' },
  { key: 'status', label: 'Status', hide: 'sm' },
  { key: 'seats', label: 'Seats', align: 'right', hide: 'lg' },
  { key: 'mrr', label: 'MRR', align: 'right' },
  { key: 'joined', label: 'Joined', hide: 'md' },
]
const HIDE = { sm: 'hidden sm:table-cell', md: 'hidden md:table-cell', lg: 'hidden lg:table-cell' }

export default function Customers() {
  const { query, update, sortBy, clear } = useCustomerQuery()
  const { status, data, error, reload } = useAsync(() => fetchCustomers(query), JSON.stringify(query))

  // The box keeps its own text so typing is instant; the URL (and the request) follows 250ms later.
  const [text, setText] = useState(query.q)
  useEffect(() => setText(query.q), [query.q])
  useEffect(() => {
    if (text === query.q) return
    const t = setTimeout(() => update({ q: text }), 250)
    return () => clearTimeout(t)
  }, [text, query.q, update])

  const [selected, setSelected] = useState<Customer | null>(null)
  const exportCsv = () => {
    const all = queryCustomers(getCustomers(), { ...query, page: 1, pageSize: 100000 }).rows
    downloadText('pulse-customers.csv', customersToCsv(all))
  }

  const loading = status === 'loading'
  const filtered = query.q !== '' || query.plan !== 'All' || query.status !== 'All'

  return (
    <>
      <PageHeader title="Customers" subtitle="Search, filter and sort every account. The URL keeps your view, so you can share it." />

      <Card className="overflow-hidden !p-0">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center dark:border-slate-800">
          <div className="relative flex-1">
            <SearchIcon width={16} height={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <label htmlFor="search" className="sr-only">Search customers</label>
            <input id="search" type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search name, email, company or country" className={`${field} w-full pl-9`} />
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="plan">Plan</label>
            <select id="plan" className={`${field} flex-1`} value={query.plan} onChange={(e) => update({ plan: e.target.value as PlanFilter })}>
              <option value="All">All plans</option>
              {PLANS.map((p) => <option key={p}>{p}</option>)}
            </select>
            <label className="sr-only" htmlFor="status">Status</label>
            <select id="status" className={`${field} flex-1`} value={query.status} onChange={(e) => update({ status: e.target.value })}>
              <option value="All">All statuses</option>
              {(['Active', 'Trial', 'Churned'] as Status[]).map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={exportCsv} className={`${field} inline-flex items-center gap-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-800`}><DownloadIcon width={16} height={16} />Export CSV</button>
          </div>
        </div>

        {status === 'error' ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : data && data.total === 0 ? (
          <EmptyState
            title="No customers match"
            text={filtered ? 'Nothing matches the current search and filters.' : 'There are no customers yet.'}
            action={filtered ? <button onClick={clear} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Clear filters</button> : undefined}
          />
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading && data ? 'opacity-60' : ''}`} aria-busy={loading}>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  {COLUMNS.map((c) => {
                    const active = query.sort === c.key
                    return (
                      <th key={c.key} scope="col" aria-sort={active ? (query.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`px-4 py-3 font-medium ${c.hide ? HIDE[c.hide] : ''}`}>
                        <button onClick={() => sortBy(c.key)} className={`inline-flex items-center gap-1 uppercase tracking-wide hover:text-slate-900 dark:hover:text-white ${c.align === 'right' ? 'float-right' : ''} ${active ? 'text-slate-900 dark:text-white' : ''}`}>
                          {c.label}
                          {active && (query.dir === 'asc' ? <ArrowUpIcon width={12} height={12} /> : <ArrowDownIcon width={12} height={12} />)}
                        </button>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data
                  ? data.rows.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <button onClick={() => setSelected(c)} className="text-left font-medium text-brand-700 hover:underline dark:text-brand-100">{c.name}</button>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{c.company} <span className="hidden sm:inline">- {c.email}</span></div>
                        </td>
                        <td className="px-4 py-3"><Badge tone={PLAN_TONE[c.plan]}>{c.plan}</Badge></td>
                        <td className={`px-4 py-3 ${HIDE.sm}`}><Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge></td>
                        <td className={`px-4 py-3 text-right tabular-nums ${HIDE.lg}`}>{count(c.seats)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{c.mrr === 0 ? <span className="text-slate-400">Trial</span> : money(c.mrr)}</td>
                        <td className={`px-4 py-3 text-slate-500 dark:text-slate-400 ${HIDE.md}`}>{longDate(c.joined)}</td>
                      </tr>
                    ))
                  : Array.from({ length: PAGE_SIZE }, (_, i) => (
                      <tr key={i}>
                        <td colSpan={COLUMNS.length} className="px-4 py-3.5"><Skeleton className="h-9 w-full" /></td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > 0 && (
          <Pagination page={data.page} pageCount={data.pageCount} total={data.total} pageSize={PAGE_SIZE} onPage={(p) => update({ page: String(p) }, false)} />
        )}
      </Card>
      <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />
    </>
  )
}
