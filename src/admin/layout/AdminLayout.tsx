import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Package, Store, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './AdminLayout.css'

const links = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={18} />, end: false },
  { to: '/admin/products', label: 'Products', icon: <Package size={18} />, end: false },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="ad-shell">
      <aside className="ad-sidebar">
        <p className="ad-brand">ÉLORA PARFUMS</p>

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