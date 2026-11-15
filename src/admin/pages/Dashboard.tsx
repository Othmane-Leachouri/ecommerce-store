import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, Wallet } from 'lucide-react'
import { getDashboardData, type DashboardData } from '../services/dashboardService'
import StatCard from '../components/StatCard'
import { formatDate, formatMAD } from '../components/CustomerDetails'
import './Customers.css' // shared admin styles (stat cards, table, status pill)
import './Dashboard.css'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setData(await getDashboardData())
      } catch (err) {
        console.error('Error loading dashboard:', err)
        setError('Unable to load the dashboard.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="container">Loading dashboard...</div>
  if (error || !data) return <div className="container">{error}</div>

  const maxDay = Math.max(...data.last7Days.map((d) => d.value), 1)

  return (
    <div className="container">
      <header className="cm-header">
        <div>
          <h1>Dashboard</h1>
          <p className="cm-muted">Overview of your store activity.</p>
        </div>
      </header>

      <section className="cm-stats">
        <StatCard icon={<Wallet size={20} />} label="Total Revenue" value={`${formatMAD(data.revenue)} MAD`} />
        <StatCard icon={<ShoppingBag size={20} />} label="Total Orders" value={String(data.totalOrders)} />
        <StatCard icon={<Users size={20} />} label="Customers" value={String(data.totalCustomers)} />
        <StatCard icon={<Package size={20} />} label="Products" value={String(data.totalProducts)} />
      </section>

      <section className="db-grid">
        <div className="db-panel">
          <h2>Revenue, last 7 days</h2>
          <div className="db-bars">
            {data.last7Days.map((d, i) => (
              <div key={i} className="db-bar-col" title={`${formatMAD(d.value)} MAD`}>
                <span className="db-bar-value">{d.value > 0 ? formatMAD(d.value) : ''}</span>
                <div className="db-bar" style={{ height: `${(d.value / maxDay) * 100}%` }} />
                <span className="db-bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="db-panel">
          <h2>Best sellers</h2>
          {data.topProducts.length === 0 && <p className="cm-muted">No sales yet.</p>}
          <ol className="db-top">
            {data.topProducts.map((p) => (
              <li key={p.name}>
                <span>{p.name}</span>
                <span className="cm-muted">{p.quantity} sold</span>
                <strong>{formatMAD(p.revenue)} MAD</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="db-panel db-recent">
        <div className="db-panel-head">
          <h2>Recent orders</h2>
          <Link to="/admin/customers" className="db-link">View customers</Link>
        </div>
        <div className="cm-table-wrap">
          <table className="cm-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total (MAD)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customerName}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>{formatMAD(o.total)}</td>
                  <td><span className="cm-order-status">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.recentOrders.length === 0 && <p className="cm-empty">No orders yet.</p>}
        </div>
      </section>
    </div>
  )
}