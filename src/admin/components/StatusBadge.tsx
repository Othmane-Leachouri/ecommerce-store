import type { CustomerStatus } from '../services/customerService'

interface StatusBadgeProps {
  status: CustomerStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`cm-badge cm-badge-${status.toLowerCase()}`}>{status}</span>
}