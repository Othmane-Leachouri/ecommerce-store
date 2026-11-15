import { supabase } from '../../lib/supabase'
import { EXCLUDED_STATUSES, getCustomers } from './customerService'

export interface RecentOrder {
  id: number
  customerName: string
  total: number
  status: string
  createdAt: string
}

export interface TopProduct {
  name: string
  quantity: number
  revenue: number
}

export interface DayRevenue {
  label: string
  value: number
}

export interface DashboardData {
  revenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
  last7Days: DayRevenue[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const [customers, productsRes] = await Promise.all([
    getCustomers(),
    supabase.from('products').select('id', { count: 'exact', head: true }),
  ])
  if (productsRes.error) throw productsRes.error

  // All orders, with the customer name, without the excluded statuses
  const orders = customers
    .flatMap((c) => c.orders.map((o) => ({ ...o, customerName: c.name })))
    .filter((o) => !EXCLUDED_STATUSES.includes(o.status))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const revenue = orders.reduce((sum, o) => sum + o.total, 0)

  const recentOrders = orders.slice(0, 8).map((o) => ({
    id: o.id,
    customerName: o.customerName,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt,
  }))

  // Best-selling products
  const sales = new Map<string, TopProduct>()
  for (const order of orders) {
    for (const item of order.items) {
      const current = sales.get(item.productName) ?? { name: item.productName, quantity: 0, revenue: 0 }
      current.quantity += item.quantity
      current.revenue += item.quantity * item.unitPrice
      sales.set(item.productName, current)
    }
  }
  const topProducts = [...sales.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5)

  // Revenue for each of the last 7 days
  const last7Days: DayRevenue[] = []
  for (let i = 6; i >= 0; i--) {
    const day = new Date()
    day.setDate(day.getDate() - i)
    const value = orders
      .filter((o) => new Date(o.createdAt).toDateString() === day.toDateString())
      .reduce((sum, o) => sum + o.total, 0)
    last7Days.push({ label: day.toLocaleDateString('en-GB', { weekday: 'short' }), value })
  }

  return {
    revenue,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: productsRes.count ?? 0,
    recentOrders,
    topProducts,
    last7Days,
  }
}