import { useEffect, useRef, useState } from 'react'
import { count, longDate, money } from '../../lib/format'
import { load, save } from '../../lib/storage'
import { addDays } from '../../lib/date'
import type { Customer } from '../../types'
import { CloseIcon, CopyIcon } from '../ui/icons'

const KEY = 'pulse.notes'

function timeline(c: Customer) {
  const ev = [{ date: c.joined, text: c.status === 'Trial' ? 'Started a free trial' : `Joined on the ${c.plan} plan` }]
  if (c.status !== 'Trial') ev.push({ date: addDays(c.joined, 14), text: `Added seats (${count(c.seats)} total)` })
  if (c.status === 'Churned') ev.push({ date: addDays(c.joined, 120), text: 'Cancelled the subscription' })
  return ev.sort((a, b) => b.date.localeCompare(a.date))
}

export function CustomerDrawer({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!customer) return
    setNote((load<Record<string, string>>(KEY, {}))[customer.id] ?? '')
    setSaved(false)
    setCopied(false)
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [customer, onClose])

  if (!customer) return null
  const c = customer
  const saveNote = () => {
    save(KEY, { ...load<Record<string, string>>(KEY, {}), [c.id]: note })
    setSaved(true)
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(c.email); setCopied(true) } catch { setCopied(false) }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-modal="true" aria-label={`Customer ${c.name}`} className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <p className="text-xs text-slate-500">{c.id}</p>
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{c.company}, {c.country}</p>
          </div>
          <button ref={closeBtn} onClick={onClose} aria-label="Close details" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><CloseIcon width={20} height={20} /></button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {([['Plan', c.plan], ['Status', c.status], ['MRR', c.mrr === 0 ? 'Trial' : money(c.mrr)], ['Seats', count(c.seats)], ['Customer since', longDate(c.joined)], ['Annual value', c.mrr === 0 ? '-' : money(c.mrr * 12)]] as const).map(([k, v]) => (
              <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
            ))}
          </dl>
          <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
            <span className="truncate">{c.email}</span>
            <button onClick={copy} className="ml-2 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-100"><CopyIcon width={14} height={14} />{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <section aria-labelledby="tl">
            <h3 id="tl" className="mb-3 text-sm font-semibold">Activity</h3>
            <ol className="space-y-3 border-l border-slate-200 pl-4 dark:border-slate-700">
              {timeline(c).map((e) => (
                <li key={e.date + e.text} className="relative text-sm">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand-600" />
                  {e.text}<span className="block text-xs text-slate-500">{longDate(e.date)}</span>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <label htmlFor="note" className="mb-2 block text-sm font-semibold">Notes</label>
            <textarea id="note" value={note} onChange={(e) => { setNote(e.target.value); setSaved(false) }} rows={4} placeholder="Add a private note about this account" className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <div className="mt-2 flex items-center gap-3">
              <button onClick={saveNote} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Save note</button>
              {saved && <span role="status" className="text-xs text-emerald-600">Saved in this browser</span>}
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
