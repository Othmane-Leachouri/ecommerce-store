import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Store, Users } from 'lucide-react'
import './AdminLayout.css'

const links = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={18} />, end: false },
]

export default function AdminLayout() {
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

        <NavLink to="/" className="ad-link ad-store">
          <Store size={18} />
          <span>Back to store</span>
        </NavLink>
      </aside>

      <div className="ad-content">
        <Outlet />
      </div>
    </div>
  )
}