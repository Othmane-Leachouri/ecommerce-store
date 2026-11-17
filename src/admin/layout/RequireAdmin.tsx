import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

interface RequireAdminProps {
  children: ReactNode
}

// Shows the admin pages only when someone is logged in.
// Real data protection is done by the RLS policies in Supabase, not by this component.
export default function RequireAdmin({ children }: RequireAdminProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  if (checking) return <div className="container">Checking access...</div>
  if (!session) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}