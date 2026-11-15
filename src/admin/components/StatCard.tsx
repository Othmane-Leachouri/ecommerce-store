import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  hint?: string
}

export default function StatCard({ icon, label, value, hint }: StatCardProps) {
  return (
    <div className="cm-stat">
      <div className="cm-stat-icon">{icon}</div>
      <div>
        <p className="cm-stat-label">{label}</p>
        <p className="cm-stat-value">{value}</p>
        {hint && <p className="cm-stat-hint">{hint}</p>}
      </div>
    </div>
  )
}