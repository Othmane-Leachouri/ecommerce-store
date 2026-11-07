import { store } from '../data/products'
import type { Product } from '../data/products'

type Props = {
  product: Product
  onAdd: (product: Product) => void
}

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <p className="price">
          {product.price} {store.currency}
        </p>
        <button className="btn" onClick={() => onAdd(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}
