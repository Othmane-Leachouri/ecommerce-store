
import ProductCard from '../components/ProductCard'
import type { Product } from '../data/products'

type Props = {
  products: Product[]
  onAdd: (product: Product) => void
}

export default function Home({ products, onAdd }: Props) {
  return (
    <main className="container">
      <h1>Our Products</h1>

      <div className="grid">
        {(products ?? []).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
          />
        ))}
      </div>
    </main>
  )
}
