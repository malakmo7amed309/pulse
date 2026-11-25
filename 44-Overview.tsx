import { ChannelChart } from '../components/charts/ChannelChart'
import { PlanChart } from '../components/charts/PlanChart'
import { RevenueChart } from '../components/charts/RevenueChart'
import { FilterBar } from '../components/layout/FilterBar'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState, ErrorState } from '../components/ui/StateViews'
import { fetchOverview } from '../data/api'
import { useAsync } from '../hooks/useAsync'
import { useFilters } from '../hooks/useFilters'
import { count, money, moneyCompact, percent } from '../lib/format'

export default function Overview() {
  const { filters } = useFilters()
  const { status, data, error, reload } = useAsync(() => fetchOverview(filters), `${filters.from}|${filters.to}|${filters.plan}`)
  const loading = status === 'loading'
  const empty = data !== null && data.kpis.revenue.value === 0 && data.kpis.signups.value === 0

  return (
    <>
      <PageHeader title="Overview" subtitle="How the business is doing in the selected period, compared with the one before it." />
      <FilterBar />

      {status === 'error' ? (
        <Card><ErrorState message={error.message} onRetry={reload} /></Card>
      ) : empty ? (
        <Card><EmptyState title="No activity in this range" text="Try a longer date range or a different plan." /></Card>
      ) : (
        <div className={`space-y-6 transition-opacity ${loading && data ? 'opacity-60' : ''}`} aria-busy={loading}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Revenue" kpi={data?.kpis.revenue ?? null} format={money} loading={!data} />
            <KpiCard label="Active users" kpi={data?.kpis.users ?? null} format={count} loading={!data} />
            <KpiCard label="New signups" kpi={data?.kpis.signups ?? null} format={count} loading={!data} />
            <KpiCard label="Churn rate" kpi={data?.kpis.churn ?? null} format={(n) => percent(n, 2)} lowerIsBetter loading={!data} />
          </div>

          <Card title="Revenue" subtitle={data ? `${moneyCompact(data.kpis.revenue.value)} over ${data.days} days` : 'Loading'}>
            {data ? <RevenueChart data={data.series} /> : <Skeleton className="h-[300px] w-full" />}
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Signups by channel" subtitle="Where new customers came from">
              {data ? <ChannelChart data={data.channels} /> : <Skeleton className="h-[240px] w-full" />}
            </Card>
            <Card title="Revenue by plan" subtitle="Share of revenue in the period">
              {data ? <PlanChart data={data.plans} /> : <Skeleton className="h-[176px] w-full" />}
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
