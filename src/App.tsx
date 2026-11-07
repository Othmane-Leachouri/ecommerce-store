import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cart from './pages/Cart'
import type { Product, CartItem } from './data/products'

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Save the cart every time it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(product: Product) {
    const existing = cart.find((item) => item.id === product.id)
    if (existing) {
      changeQuantity(product.id, 1)
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  // Quantity 0 removes the product
  function changeQuantity(id: number, change: number) {
    const updated = cart
      .map((item) => (item.id === id ? { ...item, quantity: item.quantity + change } : item))
      .filter((item) => item.quantity > 0)
    setCart(updated)
  }

  function removeFromCart(id: number) {
    setCart(cart.filter((item) => item.id !== id))
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home onAdd={addToCart} />} />
        <Route
          path="/cart"
          element={<Cart cart={cart} onChangeQuantity={changeQuantity} onRemove={removeFromCart} />}
        />
      </Routes>
    </>
  )
}
