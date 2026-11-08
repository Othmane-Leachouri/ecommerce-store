
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cart from './pages/Cart'
import type { Product, CartItem } from './data/products'
import { getProducts } from './services/productService'
import Footer from './components/Footer'

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Get products from Supabase
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Unable to load products.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Save cart
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

  function changeQuantity(id: number, change: number) {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + change }
          : item
      )
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
        <Route
          path="/"
          element={
            loading ? (
              <main className="container">Loading products...</main>
            ) : error ? (
              <main className="container">{error}</main>
            ) : (
              <Home products={products} onAdd={addToCart} />
            )
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              onChangeQuantity={changeQuantity}
              onRemove={removeFromCart}
            />
          }
        />
      </Routes>
       <Footer />
    </>
  )
}
