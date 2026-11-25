import { useFilters } from '../../hooks/useFilters'
import { DATA_END, DATA_START, PRESETS } from '../../lib/date'
import { longDate } from '../../lib/format'
import { PLANS } from '../../data/metrics'
import type { PlanFilter } from '../../types'

const field = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

/** Date range and plan. Every chart and KPI on the page reads these. */
export function FilterBar() {
  const { filters, preset, setPreset, setCustom, setPlan } = useFilters()
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Date range" className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              aria-pressed={preset === p.id}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                preset === p.id
                  ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <label className="sr-only" htmlFor="from">From</label>
          <input id="from" type="date" className={field} value={filters.from} min={DATA_START} max={filters.to} onChange={(e) => setCustom(e.target.value, filters.to)} />
          <span aria-hidden="true">to</span>
          <label className="sr-only" htmlFor="to">To</label>
          <input id="to" type="date" className={field} value={filters.to} min={filters.from} max={DATA_END} onChange={(e) => setCustom(filters.from, e.target.value)} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <p className="text-xs text-slate-500 dark:text-slate-400">{longDate(filters.from)} - {longDate(filters.to)}</p>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          Plan
          <select className={field} value={filters.plan} onChange={(e) => setPlan(e.target.value as PlanFilter)}>
            <option value="All">All plans</option>
            {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>
    </div>
  )
}
