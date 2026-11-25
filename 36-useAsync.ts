import { useCallback, useEffect, useRef, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading'; data: T | null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

/**
 * Runs an async loader whenever `key` changes and ignores answers that arrive
 * after a newer request started, so fast filter changes never show stale data.
 * `data` keeps the previous result while reloading so the page does not flash.
 */
export function useAsync<T>(load: () => Promise<T>, key: string) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading', data: null, error: null })
  const latest = useRef(0)
  const loader = useRef(load)
  loader.current = load

  const run = useCallback(() => {
    const id = ++latest.current
    setState((s) => ({ status: 'loading', data: s.data, error: null }))
    loader.current().then(
      (data) => id === latest.current && setState({ status: 'success', data, error: null }),
      (error: unknown) =>
        id === latest.current &&
        setState({ status: 'error', data: null, error: error instanceof Error ? error : new Error(String(error)) }),
    )
  }, [])

  useEffect(() => {
    run()
    return () => {
      latest.current++
    }
  }, [key, run])

  return { ...state, reload: run }
}
