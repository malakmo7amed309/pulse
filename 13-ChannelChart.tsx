import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Overview } from '../../types'
import { count } from '../../lib/format'
import { useChartColors } from './theme'

export function ChannelChart({ data }: { data: Overview['channels'] }) {
  const c = useChartColors()
  return (
    <div role="img" aria-label="New signups by acquisition channel" style={{ height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={c.grid} horizontal={false} />
          <XAxis type="number" stroke={c.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" stroke={c.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={72} />
          <Tooltip
            cursor={{ fill: c.grid, opacity: 0.5 }}
            contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 12, color: c.text }}
            formatter={(value) => [count(Number(value)), 'Signups']}
          />
          <Bar isAnimationActive={false} dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
            {data.map((d, i) => <Cell key={d.name} fill={c.channel[i % c.channel.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
