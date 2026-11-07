
import { supabase } from '../lib/supabase'
import type { Product } from '../data/products'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('id', { ascending: true })

  if (error) {
    throw error
  }

  return data as Product[]
}
