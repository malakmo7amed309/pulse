import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { load, save, remove } from '../lib/storage'

export interface Profile {
  name: string
  email: string
  workspace: string
  weeklyDigest: boolean
  churnAlerts: boolean
  newSignupAlerts: boolean
}

const DEFAULT: Profile = { name: 'Malak Mohamed', email: 'malak@lumencloud.dev', workspace: 'Lumen Cloud', weeklyDigest: true, churnAlerts: true, newSignupAlerts: false }
const KEY = 'pulse.profile'

interface Value {
  profile: Profile
  update: (patch: Partial<Profile>) => void
  reset: () => void
}
const Ctx = createContext<Value | null>(null)

export const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?'

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => load(KEY, DEFAULT))
  const update = useCallback((patch: Partial<Profile>) => {
    setProfile((p) => {
      const next = { ...p, ...patch }
      save(KEY, next)
      return next
    })
  }, [])
  const reset = useCallback(() => {
    remove(KEY)
    setProfile(DEFAULT)
  }, [])
  const value = useMemo(() => ({ profile, update, reset }), [profile, update, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProfile(): Value {
  const c = useContext(Ctx)
  if (!c) throw new Error('useProfile must be used inside ProfileProvider')
  return c
}
