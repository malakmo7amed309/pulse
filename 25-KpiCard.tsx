import type { Kpi } from '../../types'
import { signed } from '../../lib/format'
import { ArrowDownIcon, ArrowUpIcon } from './icons'
import { Skeleton } from './Skeleton'

interface KpiCardProps {
  label: string
  kpi: Kpi | null
  format: (n: number) => string
  /** For metrics where down is good (churn). */
  lowerIsBetter?: boolean
  loading?: boolean
}

export function KpiCard({ label, kpi, format, lowerIsBetter = false, loading = false }: KpiCardProps) {
  const up = (kpi?.delta ?? 0) >= 0
  const good = lowerIsBetter ? !up : up
  const flat = Math.abs(kpi?.delta ?? 0) < 0.05

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      {loading || !kpi ? (
        <>
          <Skeleton className="mt-3 h-8 w-32" />
          <Skeleton className="mt-3 h-4 w-40" />
        </>
      ) : (
        <>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{format(kpi.value)}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
                flat
                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  : good
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {!flat && (up ? <ArrowUpIcon width={12} height={12} /> : <ArrowDownIcon width={12} height={12} />)}
              {signed(kpi.delta)}
            </span>
            <span>vs previous period ({format(kpi.previous)})</span>
          </p>
        </>
      )}
    </div>
  )
}
