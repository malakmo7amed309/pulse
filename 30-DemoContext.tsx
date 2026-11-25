import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { apiSettings } from '../data/api'

interface DemoValue {
  latencyMs: number
  failing: boolean
  setLatencyMs: (n: number) => void
  setFailing: (b: boolean) => void
}

const DemoContext = createContext<DemoValue | null>(null)

/** Lets the Settings page slow the fake API down or make it fail, to show the loading and error states. */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [latencyMs, setLatency] = useState(apiSettings.latencyMs)
  const [failing, setFail] = useState(apiSettings.failing)

  // Write to the fake API straight away so the very next request sees the change.
  const setLatencyMs = useCallback((n: number) => {
    apiSettings.latencyMs = n
    setLatency(n)
  }, [])
  const setFailing = useCallback((b: boolean) => {
    apiSettings.failing = b
    setFail(b)
  }, [])

  const value = useMemo(() => ({ latencyMs, failing, setLatencyMs, setFailing }), [latencyMs, failing, setLatencyMs, setFailing])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoValue {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider')
  return ctx
}
