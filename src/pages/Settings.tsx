import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { useDemo } from '../context/DemoContext'
import { useTheme, type Theme } from '../context/ThemeContext'

const THEMES: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { latencyMs, failing, setLatencyMs, setFailing } = useDemo()

  return (
    <>
      <PageHeader title="Settings" subtitle="Appearance, and controls for trying out the loading and error states." />
      <div className="grid max-w-3xl gap-6">
        <Card title="Appearance" subtitle="Saved in this browser. The first visit follows your system setting.">
          <div role="group" aria-label="Theme" className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                aria-pressed={theme === t.id}
                className={`rounded-md px-4 py-1.5 text-sm font-medium ${theme === t.id ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Demo controls" subtitle="The data comes from a fake API in the browser. These settings change how it behaves.">
          <div className="space-y-6">
            <div>
              <label htmlFor="latency" className="flex items-center justify-between text-sm font-medium">
                Response delay
                <span className="tabular-nums text-slate-500 dark:text-slate-400">{latencyMs} ms</span>
              </label>
              <input id="latency" type="range" min={0} max={3000} step={100} value={latencyMs} onChange={(e) => setLatencyMs(Number(e.target.value))} className="mt-2 w-full accent-brand-600" />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Slow it down to see the skeleton loading states on every page.</p>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium" id="fail-label">Make the API fail</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Every request returns an error. Open Overview or Customers to see the error state and its retry button.</p>
              </div>
              <button
                role="switch"
                aria-checked={failing}
                aria-labelledby="fail-label"
                onClick={() => setFailing(!failing)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${failing ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${failing ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
