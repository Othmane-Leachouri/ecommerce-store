
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../data/store'
import { supabase } from '../lib/supabase'
import type { CartItem } from '../data/products'

type Props = {
  cart: CartItem[]
  onChangeQuantity: (id: number, change: number) => void
  onRemove: (id: number) => void
}

export default function Cart({ cart, onChangeQuantity, onRemove }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  async function orderOnWhatsApp() {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in all the fields.')
      return
    }

    if (loading) return

    const whatsappTab = window.open('about:blank', '_blank')

    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.functions.invoke('swift-api', {
        body: {
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_address: address.trim(),
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        },
      })

      if (error) {
        const functionError = error as {
          message?: string
          context?: Response
        }

        if (functionError.context instanceof Response) {
          const details = await functionError.context.clone()
            .json()
            .catch(() => null)

          throw new Error(
            details?.error ||
            details?.message ||
            functionError.message ||
            'Unable to create order'
          )
        }

        throw new Error(functionError.message || 'Function error')
      }

      const result =
        typeof data === 'string' ? JSON.parse(data) : data

      if (!result?.success || !result?.order_id) {
        throw new Error(result?.error || 'Unable to create order')
      }

      const message = [
        `Bonjour, je viens de passer une commande sur ${store.name}.`,
        `Référence de commande : #${result.order_id}`,
        `Total : ${result.total} ${store.currency}`,
      ].join('\n')

      const url = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`

      if (whatsappTab) {
        whatsappTab.location.href = url
      } else {
        window.location.href = url
      }

    } catch (err) {
      whatsappTab?.close()

      console.error('Order error:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create your order. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="container">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn-link">
          Back to products
        </Link>
      </main>
    )
  }

  return (
    <main className="container">
      <h1>Your Cart</h1>

      <div className="cart-list">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />

            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>
                {item.price} {store.currency}
              </p>
            </div>

            <div className="quantity">
              <button onClick={() => onChangeQuantity(item.id, -1)}>
                -
              </button>

              <span>{item.quantity}</span>

              <button onClick={() => onChangeQuantity(item.id, 1)}>
                +
              </button>
            </div>

            <button className="remove" onClick={() => onRemove(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <p className="total">
        Total: {total} {store.currency}
      </p>

      <div className="form">
        <h2>Your information</h2>

        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        
        {error && <p className="error">{error}</p>}

        <button
          className="btn btn-whatsapp"
          onClick={orderOnWhatsApp}
          disabled={loading}
        >
          {loading ? 'Processing order...' : 'Commander via WhatsApp'}
        </button>
      </div>
    </main>
  )
}
