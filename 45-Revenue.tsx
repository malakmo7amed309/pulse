import { RevenueChart } from '../components/charts/RevenueChart'
import { SignupsChart } from '../components/charts/SignupsChart'
import { FilterBar } from '../components/layout/FilterBar'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'
import { ErrorState } from '../components/ui/StateViews'
import { fetchOverview } from '../data/api'
import { useAsync } from '../hooks/useAsync'
import { useFilters } from '../hooks/useFilters'
import { count, money, signed } from '../lib/format'
import { bucketSize } from '../lib/analytics'

export default function Revenue() {
  const { filters } = useFilters()
  const { status, data, error, reload } = useAsync(() => fetchOverview(filters), `${filters.from}|${filters.to}|${filters.plan}`)
  const loading = status === 'loading'
  const bucket = data ? bucketSize(data.days) : 1
  const unit = bucket === 1 ? 'Day' : bucket === 7 ? 'Week of' : 'Month of'

  return (
    <>
      <PageHeader title="Revenue" subtitle="Revenue and signups, grouped by day, week or month depending on the range." />
      <FilterBar />

      {status === 'error' ? (
        <Card><ErrorState message={error.message} onRetry={reload} /></Card>
      ) : (
        <div className={`space-y-6 transition-opacity ${loading && data ? 'opacity-60' : ''}`} aria-busy={loading}>
          <Card title="Revenue trend" subtitle="Solid line is this period, dashed line is the period before">
            {data ? <RevenueChart data={data.series} height={340} /> : <Skeleton className="h-[340px] w-full" />}
          </Card>

          <Card title="New signups">
            {data ? <SignupsChart data={data.series} /> : <Skeleton className="h-[240px] w-full" />}
          </Card>

          <Card title="Breakdown" subtitle="Newest first" className="overflow-hidden !p-0">
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">{unit}</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">Revenue</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">Change</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">Signups</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data
                    ? [...data.series].reverse().map((p) => {
                        const change = p.previousRevenue === 0 ? 0 : ((p.revenue - p.previousRevenue) / p.previousRevenue) * 100
                        return (
                          <tr key={p.date}>
                            <td className="px-4 py-2.5">{p.label}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums">{money(p.revenue)}</td>
                            <td className={`px-4 py-2.5 text-right tabular-nums ${change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{signed(change)}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums">{count(p.signups)}</td>
                          </tr>
                        )
                      })
                    : Array.from({ length: 6 }, (_, i) => (
                        <tr key={i}><td colSpan={4} className="px-4 py-2.5"><Skeleton className="h-5 w-full" /></td></tr>
                      ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
