import { useTheme } from '../../context/ThemeContext'

/** Recharts takes colours as props, so it cannot use Tailwind's dark: classes. */
export function useChartColors() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  return {
    axis: dark ? '#94a3b8' : '#64748b',
    grid: dark ? '#1e293b' : '#e2e8f0',
    tooltipBg: dark ? '#0f172a' : '#ffffff',
    tooltipBorder: dark ? '#334155' : '#e2e8f0',
    text: dark ? '#e2e8f0' : '#0f172a',
    brand: dark ? '#818cf8' : '#4f46e5',
    muted: dark ? '#64748b' : '#94a3b8',
    plan: { Starter: '#38bdf8', Pro: '#6366f1', Enterprise: '#a855f7' } as Record<string, string>,
    channel: ['#6366f1', '#38bdf8', '#34d399', '#f59e0b'],
  }
}
