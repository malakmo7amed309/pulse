import { MenuIcon, MoonIcon, SearchIcon, SunIcon } from '../ui/icons'
import { initials, useProfile } from '../../context/ProfileContext'
import { Notifications } from './Notifications'
import { useTheme } from '../../context/ThemeContext'

export function Topbar({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) {
  const { theme, toggle } = useTheme()
  const { profile } = useProfile()
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <button onClick={onMenu} aria-label="Open menu" aria-controls="sidebar" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800">
        <MenuIcon />
      </button>
      <p className="hidden text-sm text-slate-500 lg:block dark:text-slate-400">{profile.workspace} <span aria-hidden="true">/</span> Analytics</p>
      <div className="flex items-center gap-2">
        <button onClick={onSearch} aria-label="Open search" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
          <SearchIcon width={16} height={16} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-slate-300 px-1 text-[10px] sm:inline dark:border-slate-600">Ctrl K</kbd>
        </button>
        <Notifications />
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white" title={profile.name}>{initials(profile.name)}</span>
      </div>
    </header>
  )
}
