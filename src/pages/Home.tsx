import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import type { Product } from '../data/products'

export default function Home({ onAdd }: { onAdd: (product: Product) => void }) {
  return (
    <main className="container">
      <h1>Our Products</h1>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </main>
  )
}
