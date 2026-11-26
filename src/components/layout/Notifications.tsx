import { useEffect, useRef, useState } from 'react'
import { load, save } from '../../lib/storage'
import { BellIcon } from '../ui/icons'

interface Note {
  id: string
  title: string
  text: string
  when: string
  tone: 'rose' | 'emerald' | 'indigo' | 'amber'
}

const NOTES: Note[] = [
  { id: 'n1', title: 'Churn spike on Pro', text: '6 Pro accounts cancelled in the last 7 days, up from 2 the week before.', when: '12 min ago', tone: 'rose' },
  { id: 'n2', title: 'Enterprise trial converted', text: 'Atlas Systems upgraded to Enterprise (210 seats).', when: '2 h ago', tone: 'emerald' },
  { id: 'n3', title: 'Referral channel growing', text: 'Referral signups are up 18% versus the previous period.', when: 'Yesterday', tone: 'indigo' },
  { id: 'n4', title: 'Weekly digest ready', text: 'Your weekly summary for Revenue and Customers is ready to review.', when: '2 days ago', tone: 'amber' },
]
const DOT = { rose: 'bg-rose-500', emerald: 'bg-emerald-500', indigo: 'bg-indigo-500', amber: 'bg-amber-500' }
const KEY = 'pulse.notifications'

export function Notifications() {
  const [open, setOpen] = useState(false)
  const [read, setRead] = useState<string[]>(() => load<{ read: string[] }>(KEY, { read: [] }).read)
  const ref = useRef<HTMLDivElement>(null)
  const unread = NOTES.filter((n) => !read.includes(n.id)).length

  const mark = (ids: string[]) => {
    const next = [...new Set([...read, ...ids])]
    setRead(next)
    save(KEY, { read: next })
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications, ${unread} unread`}
        aria-expanded={open}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <BellIcon />
        {unread > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">{unread}</span>}
      </button>
      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold">Notifications</p>
            <button onClick={() => mark(NOTES.map((n) => n.id))} disabled={unread === 0} className="text-xs font-medium text-brand-600 hover:underline disabled:text-slate-400 disabled:no-underline dark:text-brand-100">
              Mark all as read
            </button>
          </div>
          <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
            {NOTES.map((n) => {
              const isRead = read.includes(n.id)
              return (
                <li key={n.id}>
                  <button onClick={() => mark([n.id])} className="flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isRead ? 'bg-slate-300 dark:bg-slate-600' : DOT[n.tone]}`} />
                    <span className="min-w-0">
                      <span className={`block text-sm ${isRead ? 'font-normal text-slate-600 dark:text-slate-300' : 'font-semibold'}`}>{n.title}</span>
                      <span className="block text-xs leading-relaxed text-slate-500 dark:text-slate-400">{n.text}</span>
                      <span className="mt-1 block text-[11px] text-slate-400">{n.when}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
