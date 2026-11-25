import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Filters, PlanFilter } from '../types'
import { clampRange, isValidIso, PRESETS, presetRange } from '../lib/date'
import { PLANS } from '../data/metrics'

export type PresetId = (typeof PRESETS)[number]['id'] | 'custom'
const DEFAULT_PRESET: PresetId = '30d'
const STORE = 'pulse:filters'

/** Filters live in the URL, so any view can be shared or bookmarked. */
export function parseFilters(params: URLSearchParams): { filters: Filters; preset: PresetId } {
  const planParam = params.get('plan')
  const plan: PlanFilter = PLANS.find((p) => p === planParam) ?? 'All'
  const from = params.get('from')
  const to = params.get('to')
  if (isValidIso(from) && isValidIso(to)) {
    return { filters: { ...clampRange({ from, to }), plan }, preset: 'custom' }
  }
  const preset = PRESETS.find((p) => p.id === params.get('range')) ?? PRESETS.find((p) => p.id === DEFAULT_PRESET)!
  return { filters: { ...presetRange(preset.days), plan }, preset: preset.id }
}

/** The query string the sidebar appends so filters follow you between pages. */
export function savedFilterSearch(): string {
  try {
    return sessionStorage.getItem(STORE) ?? ''
  } catch {
    return ''
  }
}

export function useFilters() {
  const [params, setParams] = useSearchParams()
  const hasFilters = params.has('range') || params.has('from') || params.has('plan')
  // Arriving without filters (a sidebar click) restores the last ones used.
  const effective = useMemo(() => {
    if (hasFilters) return params
    return new URLSearchParams(savedFilterSearch())
  }, [hasFilters, params])
  const { filters, preset } = useMemo(() => parseFilters(effective), [effective])

  const commit = useCallback(
    (next: URLSearchParams) => {
      try {
        sessionStorage.setItem(STORE, next.toString())
      } catch {
        /* storage can be unavailable in private mode; the URL still works */
      }
      setParams(next, { replace: true })
    },
    [setParams],
  )

  const setPreset = useCallback(
    (id: Exclude<PresetId, 'custom'>) => {
      const next = new URLSearchParams(effective)
      next.delete('from')
      next.delete('to')
      next.set('range', id)
      commit(next)
    },
    [effective, commit],
  )

  const setCustom = useCallback(
    (from: string, to: string) => {
      if (!isValidIso(from) || !isValidIso(to)) return
      const next = new URLSearchParams(effective)
      const r = clampRange({ from, to })
      next.delete('range')
      next.set('from', r.from)
      next.set('to', r.to)
      commit(next)
    },
    [effective, commit],
  )

  const setPlan = useCallback(
    (plan: PlanFilter) => {
      const next = new URLSearchParams(effective)
      if (plan === 'All') next.delete('plan')
      else next.set('plan', plan)
      commit(next)
    },
    [effective, commit],
  )

  return { filters, preset, setPreset, setCustom, setPlan }
}
