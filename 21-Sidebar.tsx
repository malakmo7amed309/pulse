import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'
import { CloseIcon, DashboardIcon, LogoIcon, RevenueIcon, SettingsIcon, UsersIcon } from '../ui/icons'
import { savedFilterSearch } from '../../hooks/useFilters'

interface NavItem {
  to: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  /** Pages that use the date range and plan filters carry them along. */
  keepsFilters: boolean
}

const NAV: NavItem[] = [
  { to: '/', label: 'Overview', icon: DashboardIcon, keepsFilters: true },
  { to: '/revenue', label: 'Revenue', icon: RevenueIcon, keepsFilters: true },
  { to: '/customers', label: 'Customers', icon: UsersIcon, keepsFilters: false },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, keepsFilters: false },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const search = savedFilterSearch()
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              <LogoIcon width={18} height={18} />
            </span>
            <span className="text-lg font-semibold tracking-tight">Pulse</span>
          </div>
          <button onClick={onClose} aria-label="Close menu" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800">
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-2">
          {NAV.map(({ to, label, icon: Icon, keepsFilters }) => (
            <NavLink
              key={to}
              to={{ pathname: to, search: keepsFilters ? search : '' }}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-100'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon width={18} height={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="m-3 rounded-xl bg-slate-100 p-4 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p className="font-medium text-slate-900 dark:text-slate-100">Demo data</p>
          <p className="mt-1 leading-relaxed">A fictional SaaS company. Numbers are generated in the browser, with no backend.</p>
        </div>
      </aside>
    </>
  )
}
