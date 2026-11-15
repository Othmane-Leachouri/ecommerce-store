import { useEffect } from 'react'
import { X, Phone, MapPin } from 'lucide-react'
import type { Customer } from '../services/customerService'
import StatusBadge from './StatusBadge'

interface CustomerDetailsProps {
  customer: Customer
  onClose: () => void
}

export function formatMAD(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function CustomerDetails({ customer, onClose }: CustomerDetailsProps) {
  // Close with the Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div
        className="cm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Details of ${customer.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="cm-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="cm-modal-head">
          <div className="cm-avatar cm-avatar-lg">{customer.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{customer.name}</h2>
            <StatusBadge status={customer.status} />
          </div>
        </div>

        <div className="cm-info">
          <p>
            <Phone size={15} /> {customer.phone || 'No phone number'}
          </p>
          <p>
            <MapPin size={15} /> {customer.address || 'No address'}
          </p>
        </div>

        <div className="cm-summary">
          <div>
            <span>Total orders</span>
            <strong>{customer.totalOrders}</strong>
          </div>
          <div>
            <span>Total spent</span>
            <strong>{formatMAD(customer.totalSpent)} MAD</strong>
          </div>
          <div>
            <span>Customer since</span>
            <strong>{formatDate(customer.firstOrderDate)}</strong>
          </div>
        </div>

        <h3 className="cm-section-title">Order history</h3>
        <div className="cm-orders">
          {customer.orders.map((order) => (
            <article key={order.id} className="cm-order">
              <div className="cm-order-head">
                <strong>Order #{order.id}</strong>
                <span className="cm-order-status">{order.status}</span>
                <span className="cm-muted">{formatDate(order.createdAt)}</span>
                <strong className="cm-order-total">{formatMAD(order.total)} MAD</strong>
              </div>
              <ul className="cm-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.productName} <span className="cm-muted">× {item.quantity}</span>
                    </span>
                    <span>{formatMAD(item.unitPrice * item.quantity)} MAD</span>
                  </li>
                ))}
                {order.items.length === 0 && <li className="cm-muted">No products found.</li>}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}