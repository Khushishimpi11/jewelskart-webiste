// Product images
import productRing from '@/assets/product-ring.jpg';
import productRing2 from '@/assets/product-ring-2.jpg';
import productNecklace from '@/assets/product-necklace.jpg';
import productNecklace2 from '@/assets/product-necklace-2.jpg';
import productEarrings from '@/assets/product-earrings.jpg';
import productEarrings2 from '@/assets/product-earrings-2.jpg';
import productBracelet from '@/assets/product-bracelet.jpg';
import productBracelet2 from '@/assets/product-bracelet-2.jpg';
import categoryRings from '@/assets/category-rings.jpg';
import categoryNecklaces from '@/assets/category-necklaces.jpg';
import categoryEarrings from '@/assets/category-earrings.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'pendants' | 'bangles';
  isRing: boolean;
  sizes?: string[];
  description: string;
  material: string;
  isBestSeller?: boolean;
  isSpecial?: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: 'rings', name: 'Rings', image: categoryRings, productCount: 48 },
  { id: 'necklaces', name: 'Necklaces', image: categoryNecklaces, productCount: 36 },
  { id: 'earrings', name: 'Earrings', image: categoryEarrings, productCount: 42 },
  { id: 'bracelets', name: 'Bracelets', image: productBracelet, productCount: 28 },
  { id: 'pendants', name: 'Pendants', image: productNecklace2, productCount: 32 },
  { id: 'bangles', name: 'Bangles', image: productBracelet2, productCount: 24 },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Eternal Diamond Solitaire',
    price: 4999,
    originalPrice: 5999,
    image: productRing,
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8', '9'],
    description: 'A timeless diamond solitaire set in 18K white gold, featuring a brilliant round-cut diamond.',
    material: '18K White Gold, VS1 Diamond',
    isBestSeller: true,
    tags: ['diamond', 'engagement', 'luxury'],
  },
  {
    id: '2',
    name: 'Golden Teardrop Pendant',
    price: 2499,
    image: productNecklace,
    category: 'necklaces',
    isRing: false,
    description: 'An elegant teardrop pendant adorned with pavé diamonds on an 18K gold chain.',
    material: '18K Yellow Gold, Diamond Accents',
    isBestSeller: true,
    tags: ['gold', 'pendant', 'elegant'],
  },
  {
    id: '3',
    name: 'Celestial Drop Earrings',
    price: 3299,
    image: productEarrings,
    category: 'earrings',
    isRing: false,
    description: 'Stunning drop earrings featuring octagon-cut crystals with rose gold settings.',
    material: '18K Rose Gold, Crystal',
    isBestSeller: true,
    tags: ['drop', 'crystal', 'evening'],
  },
  {
    id: '4',
    name: 'Diamond Tennis Bracelet',
    price: 6999,
    image: productBracelet,
    category: 'bracelets',
    isRing: false,
    description: 'Classic tennis bracelet with perfectly matched round brilliant diamonds.',
    material: '18K White Gold, VVS Diamonds',
    isBestSeller: true,
    isSpecial: true,
    tags: ['tennis', 'diamond', 'classic'],
  },
  {
    id: '5',
    name: 'Vintage Rose Ring',
    price: 1899,
    originalPrice: 2299,
    image: productRing2,
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8', '9'],
    description: 'A romantic vintage-inspired ring with intricate filigree details.',
    material: '14K Rose Gold, Champagne Diamond',
    isBestSeller: true,
    tags: ['vintage', 'romantic', 'filigree'],
  },
  {
    id: '6',
    name: 'Pearl Strand Necklace',
    price: 1599,
    image: productNecklace2,
    category: 'necklaces',
    isRing: false,
    description: 'Luxurious Akoya pearl strand with a 14K gold clasp.',
    material: 'Akoya Pearls, 14K Gold Clasp',
    isSpecial: true,
    tags: ['pearl', 'classic', 'bridal'],
  },
  {
    id: '7',
    name: 'Diamond Stud Earrings',
    price: 2199,
    image: productEarrings2,
    category: 'earrings',
    isRing: false,
    description: 'Brilliant round diamond studs in a classic four-prong setting.',
    material: '18K White Gold, SI1 Diamonds',
    isBestSeller: true,
    tags: ['studs', 'diamond', 'everyday'],
  },
  {
    id: '8',
    name: 'Charm Link Bracelet',
    price: 2899,
    image: productBracelet2,
    category: 'bracelets',
    isRing: false,
    description: 'Playful charm bracelet featuring Art Deco-inspired pendants.',
    material: '18K Yellow Gold, Diamond Accents',
    isSpecial: true,
    tags: ['charm', 'artdeco', 'gift'],
  },
  {
    id: '9',
    name: 'Sapphire Halo Ring',
    price: 3899,
    image: productRing,
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8', '9'],
    description: 'Stunning blue sapphire surrounded by a halo of brilliant diamonds.',
    material: '18K White Gold, Blue Sapphire, Diamonds',
    isBestSeller: true,
    tags: ['sapphire', 'halo', 'luxury'],
  },
  {
    id: '10',
    name: 'Layered Gold Necklace',
    price: 1899,
    image: productNecklace,
    category: 'necklaces',
    isRing: false,
    description: 'Delicate layered necklace with multiple chains in varying lengths.',
    material: '14K Yellow Gold',
    isBestSeller: true,
    tags: ['layered', 'gold', 'trendy'],
  },
  {
    id: '11',
    name: 'Emerald Cut Diamond Ring',
    price: 7999,
    originalPrice: 8999,
    image: productRing2,
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8', '9'],
    description: 'Exceptional emerald cut diamond set in a sleek platinum band.',
    material: 'Platinum, E-Color Diamond',
    isSpecial: true,
    tags: ['emerald-cut', 'platinum', 'premium'],
  },
  {
    id: '12',
    name: 'Chandelier Earrings',
    price: 4599,
    image: productEarrings,
    category: 'earrings',
    isRing: false,
    description: 'Dramatic chandelier earrings with cascading diamonds.',
    material: '18K White Gold, Diamond Cascade',
    isSpecial: true,
    tags: ['chandelier', 'statement', 'evening'],
  },
  {
    id: '13',
    name: 'Ruby Heart Pendant',
    price: 3299,
    image: productNecklace2,
    category: 'pendants',
    isRing: false,
    description: 'Heart-shaped ruby pendant symbolizing eternal love.',
    material: '18K Rose Gold, Natural Ruby',
    isBestSeller: true,
    isSpecial: true,
    tags: ['ruby', 'heart', 'romantic'],
  },
  {
    id: '14',
    name: 'Classic Gold Bangle',
    price: 2199,
    image: productBracelet,
    category: 'bangles',
    isRing: false,
    description: 'Sleek and timeless gold bangle with a polished finish.',
    material: '18K Yellow Gold',
    isBestSeller: true,
    tags: ['bangle', 'classic', 'gold'],
  },
  {
    id: '15',
    name: 'Twisted Diamond Band',
    price: 2599,
    image: productRing,
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8', '9'],
    description: 'Modern twisted band design with pave diamonds.',
    material: '14K White Gold, Pave Diamonds',
    isBestSeller: true,
    tags: ['modern', 'twisted', 'band'],
  },
  {
    id: '16',
    name: 'Opal Drop Earrings',
    price: 1799,
    image: productEarrings2,
    category: 'earrings',
    isRing: false,
    description: 'Iridescent opal drops set in delicate gold frames.',
    material: '14K Rose Gold, Australian Opal',
    isSpecial: true,
    tags: ['opal', 'drop', 'unique'],
  },
];

export const heroSlides = [
  {
    id: 1,
    heading: 'Timeless Elegance',
    subheading: 'Discover our exquisite collection of handcrafted jewellery, where every piece tells a story of luxury and sophistication.',
    cta: 'Explore Collection',
    image: productRing,
  },
  {
    id: 2,
    heading: 'Eternal Beauty',
    subheading: 'Adorn yourself with pieces that transcend time. Our diamonds are selected for their exceptional brilliance.',
    cta: 'Shop Diamonds',
    image: productNecklace,
  },
  {
    id: 3,
    heading: 'Crafted Perfection',
    subheading: 'Each creation is meticulously crafted by master artisans, ensuring unparalleled quality and beauty.',
    cta: 'View New Arrivals',
    image: productEarrings,
  },
];

export const ringSizes = ['5', '6', '7', '8', '9', '10'];
