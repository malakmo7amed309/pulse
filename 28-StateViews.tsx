import type { ReactNode } from 'react'
import { AlertIcon, InboxIcon } from './icons'

interface StateProps {
  title: string
  text: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, text, action, className = '' }: StateProps) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}>
      <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <InboxIcon width={24} height={24} />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry, className = '' }: { message: string; onRetry: () => void; className?: string }) {
  return (
    <div role="alert" className={`flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}>
      <div className="mb-3 rounded-full bg-rose-100 p-3 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
        <AlertIcon width={24} height={24} />
      </div>
      <h3 className="text-sm font-semibold">Could not load this data</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  )
}
