import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile drawer on navigation and on Escape, and return to the top of the page.
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
