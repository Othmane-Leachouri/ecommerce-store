import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, Package, Store, Users, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './AdminLayout.css'

const links = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={18} />, end: false },
  { to: '/admin/products', label: 'Products', icon: <Package size={18} />, end: false },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false) // mobile menu

  // Close the mobile menu after going to another page
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // While the mobile menu is open: Escape closes it and the page behind does not scroll
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="ad-shell">
      {/* Top bar: phones and small tablets only */}
      <header className="ad-topbar">
        <button
          type="button"
          className="ad-icon-btn"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="ad-sidebar"
        >
          <Menu size={20} />
        </button>
        <p className="ad-brand">ÉLORA PARFUMS</p>
      </header>

      {open && <div className="ad-backdrop" onClick={() => setOpen(false)} />}

      <aside id="ad-sidebar" className={`ad-sidebar${open ? ' open' : ''}`}>
        <div className="ad-side-head">
          <p className="ad-brand">ÉLORA PARFUMS</p>
          <button type="button" className="ad-icon-btn ad-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="ad-nav" aria-label="Admin">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `ad-link${isActive ? ' active' : ''}`}
            >
              {l.icon}
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ad-bottom">
          <NavLink to="/" className="ad-link ad-store">
            <Store size={18} />
            <span>Back to store</span>
          </NavLink>
          <button type="button" className="ad-link ad-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="ad-content">
        <Outlet />
      </div>
    </div>
  )
}