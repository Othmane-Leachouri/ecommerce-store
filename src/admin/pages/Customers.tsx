import { useEffect, useMemo, useState } from 'react'
import { Eye, Repeat, Search, SlidersHorizontal, UserPlus, Users, Wallet } from 'lucide-react'
import {
  getCustomers,
  getCustomerStats,
  type Customer,
  type CustomerStatus,
} from '../services/customerService'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import CustomerDetails, { formatDate, formatMAD } from '../components/CustomerDetails'
import './Customers.css'

type StatusFilter = 'all' | CustomerStatus
type DateFilter = 'all' | '30' | '90' | 'older'
type SortOption = 'recent' | 'spent-desc' | 'spent-asc' | 'orders-desc' | 'orders-asc'

const DAY_MS = 1000 * 60 * 60 * 24

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [sort, setSort] = useState<SortOption>('recent')
  const [selected, setSelected] = useState<Customer | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setCustomers(await getCustomers())
      } catch (err) {
        console.error('Error loading customers:', err)
        setError('Unable to load customers.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => getCustomerStats(customers), [customers])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    const phoneTerm = term.replace(/\D/g, '')

    const list = customers.filter((c) => {
      const matchesSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        (phoneTerm !== '' && c.phone.replace(/\D/g, '').includes(phoneTerm))

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter

      const age = (Date.now() - new Date(c.firstOrderDate).getTime()) / DAY_MS
      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === '30' && age <= 30) ||
        (dateFilter === '90' && age <= 90) ||
        (dateFilter === 'older' && age > 90)

      return matchesSearch && matchesStatus && matchesDate
    })

    return [...list].sort((a, b) => {
      switch (sort) {
        case 'spent-desc':
          return b.totalSpent - a.totalSpent
        case 'spent-asc':
          return a.totalSpent - b.totalSpent
        case 'orders-desc':
          return b.totalOrders - a.totalOrders
        case 'orders-asc':
          return a.totalOrders - b.totalOrders
        default:
          return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
      }
    })
  }, [customers, search, statusFilter, dateFilter, sort])

  if (loading) return <div className="container">Loading customers...</div>
  if (error) return <div className="container">{error}</div>

  return (
    <div className="container cm-page">
      <header className="cm-header">
        <div>
          <h1>Customers</h1>
          <p className="cm-muted">Manage your customers and their shopping activity.</p>
        </div>
        <span className="cm-count">{stats.totalCustomers} customers</span>
      </header>

      <section className="cm-stats">
        <StatCard icon={<Users size={20} />} label="Total Customers" value={String(stats.totalCustomers)} />
        <StatCard
          icon={<UserPlus size={20} />}
          label="New Customers"
          value={String(stats.newCustomers)}
          hint="Last 30 days"
        />
        <StatCard
          icon={<Repeat size={20} />}
          label="Returning Customers"
          value={String(stats.returningCustomers)}
          hint="2 orders or more"
        />
        <StatCard
          icon={<Wallet size={20} />}
          label="Average Customer Spending"
          value={`${formatMAD(stats.averageSpent)} MAD`}
        />
      </section>

      <section className="cm-toolbar">
        <label className="cm-search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search by name or phone number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button
          className="cm-filter-btn"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </section>

      {showFilters && (
        <section className="cm-filters">
          <label>
            Status
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="VIP">VIP</option>
            </select>
          </label>
          <label>
            Customer since
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value as DateFilter)}>
              <option value="all">Any date</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="older">Older than 90 days</option>
            </select>
          </label>
          <label>
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
              <option value="recent">Latest order</option>
              <option value="spent-desc">Total spent (high to low)</option>
              <option value="spent-asc">Total spent (low to high)</option>
              <option value="orders-desc">Orders (most to least)</option>
              <option value="orders-asc">Orders (least to most)</option>
            </select>
          </label>
        </section>
      )}

      <div className="cm-table-wrap">
        <table className="cm-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone Number</th>
              <th>Total Orders</th>
              <th>Total Spent (MAD)</th>
              <th>Last Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)}>
                <td>
                  <div className="cm-customer">
                    <div className="cm-avatar">{c.name.charAt(0).toUpperCase()}</div>
                    <span>{c.name}</span>
                  </div>
                </td>
                <td>{c.phone || '-'}</td>
                <td>{c.totalOrders}</td>
                <td>{formatMAD(c.totalSpent)}</td>
                <td>{formatDate(c.lastOrderDate)}</td>
                <td>
                  <StatusBadge status={c.status} />
                </td>
                <td>
                  <button
                    className="cm-icon-btn"
                    aria-label={`View ${c.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected(c)
                    }}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p className="cm-empty">No customers match your search.</p>}
      </div>

      {selected && <CustomerDetails customer={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}