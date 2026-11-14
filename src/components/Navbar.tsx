import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { store } from '../data/store'
import DarkMode from './DarkMode'

export default function Navbar({ cartCount }: { cartCount: number }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <img src={store.logo} alt={store.name} />
          
          <span>{store.name}</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
        </nav>
        

        <Link to="/cart" className="cart-button" aria-label={`Shopping bag, ${cartCount} items`}>
          <ShoppingBag size={21} strokeWidth={1.6} />
          
          <span className="cart-count">{cartCount}</span>
          <ArrowRight size={15} className="cart-arrow" />
        </Link>
        <DarkMode />
      </div>
    </header>
  )
}