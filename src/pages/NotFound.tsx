import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/StateViews'

export default function NotFound() {
  return (
    <EmptyState
      className="py-24"
      title="Page not found"
      text="That page does not exist."
      action={<Link to="/" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Back to overview</Link>}
    />
  )
}
