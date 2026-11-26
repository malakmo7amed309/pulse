import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DemoProvider } from './context/DemoContext'
import { ProfileProvider } from './context/ProfileContext'
import { ThemeProvider } from './context/ThemeContext'
import Customers from './pages/Customers'
import NotFound from './pages/NotFound'
import Overview from './pages/Overview'
import Revenue from './pages/Revenue'
import Settings from './pages/Settings'

// HashRouter keeps every route working on GitHub Pages, which has no server-side routing.
export default function App() {
  return (
    <ThemeProvider>
      <DemoProvider>
        <ProfileProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Overview />} />
              <Route path="revenue" element={<Revenue />} />
              <Route path="customers" element={<Customers />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </ProfileProvider>
      </DemoProvider>
    </ThemeProvider>
  )
}
