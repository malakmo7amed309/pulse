import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SeriesPoint } from '../../types'
import { count } from '../../lib/format'
import { useChartColors } from './theme'

export function SignupsChart({ data }: { data: SeriesPoint[] }) {
  const c = useChartColors()
  return (
    <div role="img" aria-label="New signups over the selected period" style={{ height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={c.grid} vertical={false} />
          <XAxis dataKey="label" stroke={c.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis stroke={c.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            cursor={{ fill: c.grid, opacity: 0.5 }}
            contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 12, color: c.text }}
            labelStyle={{ color: c.text, fontWeight: 600 }}
            formatter={(value) => [count(Number(value)), 'Signups']}
          />
          <Bar isAnimationActive={false} dataKey="signups" fill={c.plan.Pro} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
