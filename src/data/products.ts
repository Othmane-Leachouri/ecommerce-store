
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
    description: 'Fresh and woody fragrance for men with bergamot and amber notes.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500',
  },
  {
    id: 2,
    name: 'Chanel Coco Mademoiselle',
    price: 120,
    description: 'Elegant feminine fragrance with orange, rose and patchouli notes.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  },
  {
    id: 3,
    name: 'Bleu de Chanel',
    price: 95,
    description: 'Sophisticated woody aromatic fragrance with citrus and incense.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'YSL Libre',
    price: 150,
    description: 'Bold floral fragrance combining lavender, orange blossom and vanilla.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500',
  },
  {
    id: 5,
    name: 'Armani Acqua di Gio',
    price: 85,
    description: 'Fresh aquatic fragrance with marine, citrus and woody notes.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  },
  {
    id: 6,
    name: 'Lancôme La Vie Est Belle',
    price: 180,
    description: 'Sweet and elegant feminine perfume with iris, vanilla and praline.',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500',
  },
  {
    id: 7,
    name: 'Versace Eros',
    price: 110,
    description: 'Intense masculine fragrance with mint, green apple and tonka bean.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  },
  {
    id: 8,
    name: 'Paco Rabanne 1 Million',
    price: 75,
    description: 'Warm spicy fragrance with cinnamon, leather and amber accords.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500',
  },
  {
    id: 9,
    name: 'Gucci Bloom',
    price: 135,
    description: 'Rich white floral fragrance with jasmine, tuberose and Rangoon creeper.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500',
  },
  {
    id: 10,
    name: 'Jean Paul Gaultier Le Male',
    price: 90,
    description: 'Classic masculine fragrance with lavender, mint and vanilla.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  },
  {
    id: 11,
    name: 'Carolina Herrera Good Girl',
    price: 160,
    description: 'Sensual floral fragrance with jasmine, cocoa and tonka bean.',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500',
  },
  {
    id: 12,
    name: 'Tom Ford Black Orchid',
    price: 220,
    description: 'Luxurious dark fragrance with black orchid, spices and patchouli.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500',
  },
  {
    id: 13,
    name: 'Dolce & Gabbana Light Blue',
    price: 100,
    description: 'Refreshing Mediterranean fragrance with lemon, apple and cedarwood.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  },
  {
    id: 14,
    name: 'Burberry Her',
    price: 145,
    description: 'Modern fruity floral perfume with berries, jasmine and musk.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500',
  },
  {
    id: 15,
    name: 'Givenchy Gentleman',
    price: 115,
    description: 'Elegant woody fragrance with iris, pepper and black vanilla.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500',
  },
  {
    id: 16,
    name: 'Valentino Born in Roma',
    price: 175,
    description: 'Contemporary floral fragrance with jasmine, vanilla and cashmeran.',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500',
  },
  {
    id: 17,
    name: 'Hugo Boss Bottled',
    price: 80,
    description: 'Warm everyday fragrance with apple, cinnamon and sandalwood.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  },
  {
    id: 18,
    name: 'Prada Paradoxe',
    price: 190,
    description: 'Feminine amber floral fragrance with neroli, jasmine and vanilla.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500',
  },
  {
    id: 19,
    name: 'Montblanc Explorer',
    price: 65,
    description: 'Adventurous woody fragrance with bergamot, vetiver and patchouli.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500',
  },
  {
    id: 20,
    name: 'Azzaro The Most Wanted',
    price: 125,
    description: 'Intense spicy fragrance with cardamom, caramel and amber wood.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  },

]