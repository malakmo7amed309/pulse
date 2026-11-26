/** localStorage that never throws (private mode, quota). */
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? ({ ...(typeof fallback === 'object' ? fallback : {}), ...JSON.parse(raw) } as T) : fallback
  } catch {
    return fallback
  }
}
export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}
export function remove(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
