
import { Container } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import type { Product } from '../data/products'

type Props = {
  products: Product[]
  onAdd: (product: Product) => void
}

export default function Home({ products, onAdd }: Props) {
  return (
    <main>
      
      <div className="container">
<div className='TitleHome'></div>
      <div className="grid">
        {(products ?? []).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
          />
        ))}
      </div>
      </div>
    </main>
  )
}
