import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SeriesPoint } from '../../types'
import { money, moneyCompact } from '../../lib/format'
import { useChartColors } from './theme'

export function RevenueChart({ data, height = 300 }: { data: SeriesPoint[]; height?: number }) {
  const c = useChartColors()
  return (
    <div role="img" aria-label="Revenue over the selected period compared with the previous period" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.brand} stopOpacity={0.35} />
              <stop offset="100%" stopColor={c.brand} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={c.grid} vertical={false} />
          <XAxis dataKey="label" stroke={c.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis stroke={c.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={52} tickFormatter={(v: number) => moneyCompact(v)} />
          <Tooltip
            contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 12, color: c.text }}
            labelStyle={{ color: c.text, fontWeight: 600 }}
            formatter={(value, name) => [money(Number(value)), String(name)]}
          />
          <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Area isAnimationActive={false} type="monotone" dataKey="revenue" name="This period" stroke={c.brand} strokeWidth={2} fill="url(#rev)" />
          <Line isAnimationActive={false} type="monotone" dataKey="previousRevenue" name="Previous period" stroke={c.muted} strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
