export type Product = {
  id: string
  name: string
  price: number
  category: string
  palette: string
  imagePosition: string
  label?: string
  description: string
}

export const categories = [
  { id: 'all', label: 'All flowers' },
  { id: 'favourites', label: 'Bestsellers' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'thank-you', label: 'Thank you' },
  { id: 'just-because', label: 'Just because' },
]

export const products: Product[] = [
  {
    id: 'soft-hours',
    name: 'Soft Hours',
    price: 128,
    category: 'favourites',
    palette: 'Blush tulips · ivory ranunculus',
    imagePosition: '0% 0%',
    label: 'Bestseller',
    description: 'Blush tulips and creamy ranunculus, gathered for slow mornings and thoughtful hellos.',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    price: 168,
    category: 'birthday',
    palette: 'Calla lilies · garden roses',
    imagePosition: '100% 0%',
    label: 'A little sunshine',
    description: 'Sculptural golden calla lilies with garden roses. A bright, considered birthday gift.',
  },
  {
    id: 'peach-cloud',
    name: 'Peach Cloud',
    price: 145,
    category: 'thank-you',
    palette: 'Coral anemones · apricot roses',
    imagePosition: '0% 100%',
    description: 'A warm mix of coral anemones, apricot roses and soft greenery, tied by hand.',
  },
  {
    id: 'blue-skies',
    name: 'Blue Skies',
    price: 118,
    category: 'just-because',
    palette: 'Blue delphinium · white daisies',
    imagePosition: '100% 100%',
    label: 'New in',
    description: 'Blue delphinium and little white daisies for the kind of day that needs a lift.',
  },
  {
    id: 'petal-letter',
    name: 'Petal Letter',
    price: 98,
    category: 'thank-you',
    palette: 'Seasonal stems · handwritten note',
    imagePosition: '0% 0%',
    description: 'A sweet petite bunch with a handwritten note, made for a simple thank you.',
  },
  {
    id: 'sunroom',
    name: 'The Sunroom',
    price: 188,
    category: 'favourites',
    palette: 'Yellow calla lilies · cream roses',
    imagePosition: '100% 0%',
    label: 'Bestseller',
    description: 'Our most generous golden arrangement, finished in textured paper and ribbon.',
  },
  {
    id: 'little-celebration',
    name: 'Little Celebration',
    price: 138,
    category: 'birthday',
    palette: 'Garden roses · anemones',
    imagePosition: '0% 100%',
    description: 'A joyful little celebration bouquet, ready to make an ordinary day feel special.',
  },
  {
    id: 'wild-hello',
    name: 'Wild Hello',
    price: 155,
    category: 'just-because',
    palette: 'Daisies · blue delphinium',
    imagePosition: '100% 100%',
    description: 'Playful field-inspired flowers, gathered loosely and wrapped in blush paper.',
  },
]

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0,
  }).format(value)
