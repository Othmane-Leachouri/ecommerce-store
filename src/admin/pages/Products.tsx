import { useEffect, useState, type FormEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { addProduct, getAdminProducts, type AdminProduct } from '../services/productAdminService'
import { formatMAD } from '../components/CustomerDetails'
import './Customers.css' // shared admin styles (header, table)
import './Products.css'

const emptyForm = { name: '', description: '', price: '', image: '' }

export default function Products() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setProducts(await getAdminProducts())
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Unable to load products.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function closeForm() {
    setShowForm(false)
    setForm(emptyForm)
    setFormError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    setSuccess('')

    const name = form.name.trim()
    const price = Number(form.price)
    const image = form.image.trim()

    if (!name) return setFormError('Please enter the product name.')
    if (!Number.isFinite(price) || price <= 0) return setFormError('Please enter a valid price.')
    try {
      new URL(image)
    } catch {
      return setFormError('Please enter a valid image link (starting with https://).')
    }

    setSaving(true)
    try {
      const created = await addProduct({ name, description: form.description.trim(), price, image })
      setProducts((current) => [created, ...current])
      setSuccess(`"${created.name}" was added to the store.`)
      closeForm()
    } catch (err) {
      console.error('Error adding product:', err)
      setFormError('Could not save the product. Check the Supabase policy for products.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="container">Loading products...</div>
  if (error) return <div className="container">{error}</div>

  return (
    <div className="container">
      <header className="cm-header">
        <div>
          <h1>Products</h1>
          <p className="cm-muted">Add new perfumes to your store. {products.length} products in total.</p>
        </div>
        {!showForm && (
          <button type="button" className="pr-btn pr-btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add product
          </button>
        )}
      </header>

      {success && <p className="pr-success" role="status">{success}</p>}

      {showForm && (
        <form className="pr-form" onSubmit={handleSubmit} noValidate>
          <div className="pr-form-head">
            <h2>New product</h2>
            <button type="button" className="cm-icon-btn" onClick={closeForm} aria-label="Close form">
              <X size={16} />
            </button>
          </div>

          <div className="pr-grid">
            <label>
              Name
              <input value={form.name} onChange={(e) => update('name', e.target.value)} />
            </label>
            <label>
              Price (MAD)
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
              />
            </label>
            <label className="pr-full">
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
              />
            </label>
            <label className="pr-full">
              Image link
              <input
                type="url"
                placeholder="https://..."
                value={form.image}
                onChange={(e) => update('image', e.target.value)}
              />
            </label>
          </div>

          {form.image.trim() && (
            <img
              className="pr-preview"
              src={form.image.trim()}
              alt="Preview"
              onError={(e) => (e.currentTarget.style.display = 'none')}
              onLoad={(e) => (e.currentTarget.style.display = 'block')}
            />
          )}

          <p className="pr-error" role="alert" aria-live="polite">{formError}</p>

          <div className="pr-actions">
            <button type="button" className="pr-btn" onClick={closeForm}>Cancel</button>
            <button type="submit" className="pr-btn pr-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save product'}
            </button>
          </div>
        </form>
      )}

      <div className="cm-table-wrap">
        <table className="cm-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Price (MAD)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ cursor: 'default' }}>
                <td>
                  <div className="cm-customer">
                    {p.image ? <img className="pr-thumb" src={p.image} alt="" loading="lazy" /> : <div className="pr-thumb" />}
                    <span>{p.name}</span>
                  </div>
                </td>
                <td className="pr-desc">{p.description}</td>
                <td>{formatMAD(p.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="cm-empty">No products yet.</p>}
      </div>
    </div>
  )
}