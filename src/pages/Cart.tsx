import { useState } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../data/store'
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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function orderOnWhatsApp() {
    if (!name || !phone || !address) {
      alert('Please fill in all the fields.')
      return
    }

    const productLines = cart.map(
      (item) => `- ${item.name} | ${item.quantity} x ${item.price} ${store.currency}`
    )

    const message = [
      `Nouvelle commande - ${store.name}`,
      '',
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      `Adresse : ${address}`,
      '',
      'Produits :',
      ...productLines,
      '',
      `Total : ${total} ${store.currency}`,
    ].join('\n')

    const url = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
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
              <button onClick={() => onChangeQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => onChangeQuantity(item.id, 1)}>+</button>
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
        <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button className="btn btn-whatsapp" onClick={orderOnWhatsApp}>
          Commander via WhatsApp
        </button>
      </div>
    </main>
  )
}
