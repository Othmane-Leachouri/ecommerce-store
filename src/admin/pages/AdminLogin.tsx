import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './AdminLogin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Already logged in: go straight to the dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin', { replace: true })
    })
  }, [navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const cleanEmail = email.trim()
    if (!cleanEmail || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })
    setLoading(false)

    if (signInError) {
      // Same message for every error, so it never reveals which part was wrong
      setError('Incorrect email or password.')
      return
    }

    navigate('/admin', { replace: true })
  }

  return (
    <main className="al-page">
      <section className="al-card" aria-labelledby="al-title">
        <div className="al-icon" aria-hidden="true">
          <ShieldCheck size={24} />
        </div>
        <p className="al-brand">ÉLORA PARFUMS</p>
        <h1 id="al-title">Admin sign in</h1>
        <p className="al-muted">Sign in to manage your store.</p>

        <form className="al-form" onSubmit={handleSubmit} noValidate>
          <label>
            Email address
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error)}
            />
          </label>

          <label>
            Password
            <div className="al-password">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
              />
              <button
                type="button"
                className="al-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <p className="al-error" role="alert" aria-live="polite">
            {error}
          </p>

          <button type="submit" className="al-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <Link to="/" className="al-back">
          Back to store
        </Link>
      </section>
    </main>
  )
}