import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { useDemo } from '../context/DemoContext'
import { useTheme, type Theme } from '../context/ThemeContext'
import { useProfile } from '../context/ProfileContext'
import { remove } from '../lib/storage'
import { useState } from 'react'

const THEMES: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { latencyMs, failing, setLatencyMs, setFailing } = useDemo()
  const { profile, update, reset } = useProfile()
  const [saved, setSaved] = useState(false)
  const [draft, setDraft] = useState({ name: profile.name, email: profile.email, workspace: profile.workspace })
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)
  const valid = draft.name.trim() !== '' && draft.workspace.trim() !== '' && emailOk
  const input = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900'
  const toggles = [
    { key: 'weeklyDigest', label: 'Weekly digest', text: 'A summary of revenue and customers every Monday.' },
    { key: 'churnAlerts', label: 'Churn alerts', text: 'Tell me when cancellations rise above normal.' },
    { key: 'newSignupAlerts', label: 'New signup alerts', text: 'Tell me about each new Enterprise signup.' },
  ] as const
  const resetAll = () => {
    ;['pulse.profile', 'pulse.notifications', 'pulse.notes'].forEach(remove)
    reset()
    setDraft({ name: 'Malak Mohamed', email: 'malak@lumencloud.dev', workspace: 'Lumen Cloud' })
    setSaved(false)
  }

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

        <Card title="Profile" subtitle="Shown in the top bar. Saved in this browser.">
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => { e.preventDefault(); if (valid) { update({ name: draft.name.trim(), email: draft.email.trim(), workspace: draft.workspace.trim() }); setSaved(true) } }}
          >
            <label className="text-sm font-medium">Name<input className={input} value={draft.name} onChange={(e) => { setDraft({ ...draft, name: e.target.value }); setSaved(false) }} /></label>
            <label className="text-sm font-medium">Workspace<input className={input} value={draft.workspace} onChange={(e) => { setDraft({ ...draft, workspace: e.target.value }); setSaved(false) }} /></label>
            <label className="text-sm font-medium sm:col-span-2">Email
              <input type="email" className={input} value={draft.email} aria-invalid={!emailOk} onChange={(e) => { setDraft({ ...draft, email: e.target.value }); setSaved(false) }} />
              {!emailOk && <span className="mt-1 block text-xs text-rose-600">Enter a valid email address.</span>}
            </label>
            <div className="flex items-center gap-3 sm:col-span-2">
              <button type="submit" disabled={!valid} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">Save profile</button>
              {saved && <span role="status" className="text-xs text-emerald-600">Profile saved</span>}
            </div>
          </form>
        </Card>

        <Card title="Notifications" subtitle="Choose which emails you would get from a real workspace.">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {toggles.map((t) => (
              <li key={t.key} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div><p className="text-sm font-medium" id={t.key}>{t.label}</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t.text}</p></div>
                <button role="switch" aria-checked={profile[t.key]} aria-labelledby={t.key} onClick={() => update({ [t.key]: !profile[t.key] })} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${profile[t.key] ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${profile[t.key] ? 'translate-x-5' : ''}`} />
                </button>
              </li>
            ))}
          </ul>
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

        <Card title="Reset" subtitle="Clears the profile, notification state and customer notes saved in this browser.">
          <button onClick={resetAll} className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950">Reset saved data</button>
        </Card>
      </div>
    </>
  )
}
