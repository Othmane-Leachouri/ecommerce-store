import { store } from '../data/store'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>
        © {year} {store.name}. All rights reserved.
      </p>
      <a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noreferrer">
        Contact us on WhatsApp
      </a>
    </footer>
  )
}