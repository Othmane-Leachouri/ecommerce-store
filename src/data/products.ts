
export const store = {
  name: 'ÉLORA PARFUMS',
   logo: 'https://cdn.realisticicon.com/medias/realicon/256px/perfume-bottle-icon-ed91_256px.png',
  whatsappNumber: '212600000000',
  currency: 'MAD',
}

export type Product = {
  id: number
  name: string
  price: number
  description: string
  image: string
}

export type CartItem = Product & { quantity: number }
export const products: Product[] = [
  {
    id: 1,
    name: 'Dior Sauvage',
    price: 50,
    description: 'Fresh and woody fragrance for men.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500',
  },
  {
    id: 2,
    name: 'Chanel Coco Mademoiselle',
    price: 25,
    description: 'Elegant floral fragrance for women.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  },
  {
    id: 3,
    name: 'Bleu de Chanel',
    price: 20,
    description: 'Fresh and woody fragrance.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'YSL Libre',
    price: 70,
    description: 'Floral and elegant fragrance.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500',
  },
  {
    id: 5,
    name: 'Armani Acqua di Gio',
    price: 20,
    description: 'Fresh aquatic fragrance.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  },
  {
    id: 6,
    name: 'Lancôme La Vie Est Belle',
    price: 80,
    description: 'Sweet and floral fragrance.',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500',
  },
]