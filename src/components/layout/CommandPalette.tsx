import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { getCustomers } from '../../data/customers'
import { SearchIcon } from '../ui/icons'

interface Item {
  id: string
  label: string
  hint: string
  run: () => void
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { toggle, theme } = useTheme()
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setText('')
      setIndex(0)
      setTimeout(() => input.current?.focus(), 0)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  const items = useMemo<Item[]>(() => {
    const go = (to: string) => () => navigate(to)
    const base: Item[] = [
      { id: 'overview', label: 'Go to Overview', hint: 'Page', run: go('/') },
      { id: 'revenue', label: 'Go to Revenue', hint: 'Page', run: go('/revenue') },
      { id: 'customers', label: 'Go to Customers', hint: 'Page', run: go('/customers') },
      { id: 'settings', label: 'Go to Settings', hint: 'Page', run: go('/settings') },
      { id: 'theme', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', hint: 'Action', run: toggle },
    ]
    const q = text.trim().toLowerCase()
    if (!q) return base
    const pages = base.filter((b) => b.label.toLowerCase().includes(q))
    const people = getCustomers()
      .filter((c) => `${c.name} ${c.company} ${c.email}`.toLowerCase().includes(q))
      .slice(0, 6)
      .map<Item>((c) => ({ id: c.id, label: c.name, hint: c.company, run: go(`/customers?q=${encodeURIComponent(c.name)}`) }))
    return [...pages, ...people]
  }, [text, navigate, theme, toggle])

  if (!open) return null
  const choose = (i: Item) => {
    onClose()
    i.run()
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, items.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && items[index]) choose(items[index])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 p-4 pt-[12vh]" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKey} className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
          <SearchIcon width={18} height={18} className="text-slate-400" />
          <input ref={input} value={text} onChange={(e) => { setText(e.target.value); setIndex(0) }} aria-label="Search pages, actions and customers" placeholder="Search pages, actions and customers" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
          <kbd className="rounded border border-slate-300 px-1.5 text-[10px] text-slate-500 dark:border-slate-600">Esc</kbd>
        </div>
        <ul role="listbox" className="max-h-80 overflow-y-auto p-2">
          {items.length === 0 && <li className="px-3 py-6 text-center text-sm text-slate-500">Nothing found for "{text}"</li>}
          {items.map((it, i) => (
            <li key={it.id} role="option" aria-selected={i === index}>
              <button onMouseEnter={() => setIndex(i)} onClick={() => choose(it)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${i === index ? 'bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-100' : ''}`}>
                <span>{it.label}</span>
                <span className="text-xs text-slate-400">{it.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
