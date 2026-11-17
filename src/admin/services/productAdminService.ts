import { supabase } from '../../lib/supabase'

export interface AdminProduct {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export interface NewProduct {
  name: string
  description: string
  price: number
  image: string
}

interface ProductRow {
  id: number
  name: string
  description: string | null
  price: number | string
  image: string | null
}

function toProduct(row: ProductRow): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price),
    image: row.image ?? '',
  }
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, image')
    .order('id', { ascending: false })

  if (error) throw error
  return ((data ?? []) as ProductRow[]).map(toProduct)
}

export async function addProduct(product: NewProduct): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select('id, name, description, price, image')
    .single()

  if (error) throw error
  return toProduct(data as ProductRow)
}