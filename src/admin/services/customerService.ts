import { supabase } from '../../lib/supabase'

// ---------- Types ----------

export type CustomerStatus = 'Active' | 'Inactive' | 'VIP'

export interface OrderItemDetail {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
}

export interface CustomerOrder {
  id: number
  total: number
  status: string
  createdAt: string
  items: OrderItemDetail[]
}

export interface Customer {
  id: string // normalized phone number
  name: string
  phone: string
  address: string | null
  totalOrders: number
  totalSpent: number
  firstOrderDate: string
  lastOrderDate: string
  status: CustomerStatus
  orders: CustomerOrder[]
}

export interface CustomerStats {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  averageSpent: number
}

// ---------- Rules (change the numbers here) ----------

export const CUSTOMER_RULES = {
  vipMinOrders: 3,
  vipMinSpent: 1000, // MAD
  inactiveAfterDays: 90,
  newWithinDays: 30,
  returningMinOrders: 2,
}

// Order statuses that must NOT count in the totals (example: ['cancelled']).
// Fill this once we know the real values of orders.status.
export const EXCLUDED_STATUSES: string[] = []

// ---------- Helpers ----------

const DAY_MS = 1000 * 60 * 60 * 24

function daysSince(date: string): number {
  return (Date.now() - new Date(date).getTime()) / DAY_MS
}

// 06 12 34 56 78, +212612345678 and 212612345678 become the same key.
function normalizePhone(phone: string | null): string {
  let digits = (phone ?? '').replace(/\D/g, '')
  if (digits.startsWith('212')) digits = '0' + digits.slice(3)
  return digits
}

function getStatus(totalOrders: number, totalSpent: number, lastOrderDate: string): CustomerStatus {
  if (
    totalOrders >= CUSTOMER_RULES.vipMinOrders ||
    totalSpent >= CUSTOMER_RULES.vipMinSpent
  ) {
    return 'VIP'
  }
  if (daysSince(lastOrderDate) > CUSTOMER_RULES.inactiveAfterDays) return 'Inactive'
  return 'Active'
}

// ---------- Data ----------

interface OrderRow {
  id: number
  customer_name: string | null
  customer_phone: string | null
  customer_address: string | null
  total: number
  status: string
  created_at: string
}

interface OrderItemRow {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: number
}

export async function getCustomers(): Promise<Customer[]> {
  const [ordersRes, itemsRes, productsRes] = await Promise.all([
    supabase
      .from('orders')
      .select('id, customer_name, customer_phone, customer_address, total, status, created_at')
      .order('created_at', { ascending: false }),
    supabase.from('order_items').select('id, order_id, product_id, quantity, unit_price'),
    supabase.from('products').select('id, name'),
  ])

  if (ordersRes.error) throw ordersRes.error
  if (itemsRes.error) throw itemsRes.error
  if (productsRes.error) throw productsRes.error

  const orders = (ordersRes.data ?? []) as OrderRow[]
  const items = (itemsRes.data ?? []) as OrderItemRow[]
  const productNames = new Map<number, string>(
    (productsRes.data ?? []).map((p: { id: number; name: string }) => [p.id, p.name])
  )

  // Items grouped by order
  const itemsByOrder = new Map<number, OrderItemDetail[]>()
  for (const item of items) {
    const list = itemsByOrder.get(item.order_id) ?? []
    list.push({
      id: item.id,
      productId: item.product_id,
      productName: productNames.get(item.product_id) ?? 'Unknown product',
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
    })
    itemsByOrder.set(item.order_id, list)
  }

  // Orders grouped by customer (phone number)
  const groups = new Map<string, OrderRow[]>()
  for (const order of orders) {
    const key = normalizePhone(order.customer_phone) || `order-${order.id}`
    const list = groups.get(key) ?? []
    list.push(order)
    groups.set(key, list)
  }

  const customers: Customer[] = []

  for (const [key, group] of groups) {
    // Orders are already sorted from newest to oldest
    const latest = group[0]
    const counted = group.filter((o) => !EXCLUDED_STATUSES.includes(o.status))
    const totalSpent = counted.reduce((sum, o) => sum + Number(o.total), 0)
    const lastOrderDate = latest.created_at
    const firstOrderDate = group[group.length - 1].created_at

    customers.push({
      id: key,
      name: latest.customer_name?.trim() || 'Unknown customer',
      phone: latest.customer_phone ?? '',
      address: latest.customer_address,
      totalOrders: counted.length,
      totalSpent,
      firstOrderDate,
      lastOrderDate,
      status: getStatus(counted.length, totalSpent, lastOrderDate),
      orders: group.map((o) => ({
        id: o.id,
        total: Number(o.total),
        status: o.status,
        createdAt: o.created_at,
        items: itemsByOrder.get(o.id) ?? [],
      })),
    })
  }

  return customers
}

export function getCustomerStats(customers: Customer[]): CustomerStats {
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  return {
    totalCustomers: customers.length,
    newCustomers: customers.filter(
      (c) => daysSince(c.firstOrderDate) <= CUSTOMER_RULES.newWithinDays
    ).length,
    returningCustomers: customers.filter(
      (c) => c.totalOrders >= CUSTOMER_RULES.returningMinOrders
    ).length,
    averageSpent: customers.length ? totalSpent / customers.length : 0,
  }
}