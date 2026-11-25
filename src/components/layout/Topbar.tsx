import { MenuIcon, MoonIcon, SunIcon } from '../ui/icons'
import { useTheme } from '../../context/ThemeContext'

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <button onClick={onMenu} aria-label="Open menu" aria-controls="sidebar" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800">
        <MenuIcon />
      </button>
      <p className="hidden text-sm text-slate-500 lg:block dark:text-slate-400">Lumen Cloud <span aria-hidden="true">/</span> Analytics</p>
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white" title="Malak Mohamed">MM</span>
      </div>
    </header>
  )
}
