import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Overview } from '../../types'
import { money, percent } from '../../lib/format'
import { useChartColors } from './theme'

export function PlanChart({ data }: { data: Overview['plans'] }) {
  const c = useChartColors()
  const total = data.reduce((t, d) => t + d.value, 0)
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div role="img" aria-label="Revenue share by plan" className="h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 12, color: c.text }}
              itemStyle={{ color: c.text }}
              formatter={(value) => [money(Number(value)), 'Revenue']}
            />
            <Pie isAnimationActive={false} data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none">
              {data.map((d) => <Cell key={d.name} fill={c.plan[d.name]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.plan[d.name] }} />
              {d.name}
            </span>
            <span className="tabular-nums text-slate-500 dark:text-slate-400">
              {money(d.value)} <span className="text-slate-400">({percent(total === 0 ? 0 : (d.value / total) * 100, 0)})</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
