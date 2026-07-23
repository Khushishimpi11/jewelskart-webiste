// Product images imports
// ======================

// RING IMAGES (18 rings - 2 images each)
import ring1 from '@/assets/Ring/Ring/rrrr.png';
import ringb from '@/assets/Ring/Ring/rrr.png'
import ring2 from '@/assets/Ring/Ring/1.png';
import ring2b from '@/assets/Ring/Ring/1a.png'
import ring3 from '@/assets/Ring/Ring/2.png';
import ring3b from '@/assets/Ring/Ring/2a.png'
import ring4 from '@/assets/Ring/Ring/3.png';
import ring4b from '@/assets/Ring/Ring/3a.png'
import ring5 from '@/assets/Ring/Ring/4.png';
import ring5b from '@/assets/Ring/Ring/4a.png'
import ring6 from '@/assets/Ring/Ring/5.png';
import ring6b from '@/assets/Ring/Ring/5a.png'
import ring7 from '@/assets/Ring/Ring/6.png';
import ring7b from '@/assets/Ring/Ring/6a.png'
import ring8 from '@/assets/Ring/Ring/7.png';
import ring8b from '@/assets/Ring/Ring/7a.png'
import ring9 from '@/assets/Ring/Ring/8.png';
import ring9b from '@/assets/Ring/Ring/8a.png'
import ring10 from '@/assets/Ring/Ring/9.png';
import ring10b from '@/assets/Ring/Ring/9.png'
import ring11 from '@/assets/Ring/Ring/10.png';
import ring11b from '@/assets/Ring/Ring/10a.png'
import ring12 from '@/assets/Ring/Ring/11.png';
import ring12b from '@/assets/Ring/Ring/11a.png'
import ring13 from '@/assets/Ring/Ring/12.png';
import ring13b from '@/assets/Ring/Ring/12a.png'
import ring14 from '@/assets/Ring/Ring/13.png';
import ring14b from '@/assets/Ring/Ring/13a.png'

// PENDANT IMAGES (16 images from chain imports)
import pendant1 from '@/assets/Ring/Ring/m.png';
import pendant1b from '@/assets/m.png';
import pendant2 from '@/assets/pendantmodel/1.png';
import pendant2b from '@/assets/pendantmodel/1a.png';
import pendant3 from '@/assets/pendantmodel/2.png';
import pendant3b from '@/assets/pendantmodel/2a.png';
import pendant4 from '@/assets/pendantmodel/3.png';
import pendant4b from '@/assets/pendantmodel/3a.png';
import pendant5 from '@/assets/pendantmodel/4.png';
import pendant5b from '@/assets/pendantmodel/4a.png';
import pendant6 from '@/assets/pendantmodel/5.png';
import pendant6b from '@/assets/pendantmodel/5a.png';
import pendant7 from '@/assets/pendantmodel/6.png';
import pendant7b from '@/assets/pendantmodel/6a.png';
import pendant8 from '@/assets/pendantmodel/7.png';
import pendant8b from '@/assets/pendantmodel/7a.png';
import pendant9 from '@/assets/pendantmodel/8.png';
import pendant9b from '@/assets/pendantmodel/8.png';
import pendant10 from '@/assets/pendantmodel/9.png';
import pendant10b from '@/assets/pendantmodel/9a.png';
import pendant11 from '@/assets/pendantmodel/10.png';
import pendant11b from '@/assets/pendantmodel/10a.png';
import pendant12 from '@/assets/pendantmodel/11.png';
import pendant12b from '@/assets/pendantmodel/11a.png';
import pendant13 from '@/assets/pendantmodel/12.png';
import pendant13b from '@/assets/pendantmodel/12a.png';
import pendant14 from '@/assets/pendantmodel/13.png';
import pendant14b from '@/assets/pendantmodel/13a.png';
import pendant15 from '@/assets/pendantmodel/14.png';
import pendant15b from '@/assets/pendantmodel/14a.png';
import pendant16 from '@/assets/pendantmodel/15.png';
import pendant16b from '@/assets/pendantmodel/15a.png';

// EARRING IMAGES (20 earrings - 2 images each)
import earring1 from '@/assets/earingmodel/1.png';
import earring1b from '@/assets/earingmodel/1a.jpeg';
import earring2 from '@/assets/earingmodel/2.png';
import earring2b from '@/assets/earingmodel/2a.png';
import earring3 from '@/assets/earingmodel/3.png';
import earring3b from '@/assets/earingmodel/3a.png';
import earring4 from '@/assets/earingmodel/4.png';
import earring4b from '@/assets/earingmodel/4a.png';
import earring5 from '@/assets/earingmodel/5.png';
import earring5b from '@/assets/earingmodel/5a.png';
import earring6 from '@/assets/earingmodel/6.png';
import earring6b from '@/assets/earingmodel/6a.png';
import earring7 from '@/assets/earingmodel/7.png';
import earring7b from '@/assets/earingmodel/7a.png';
import earring8 from '@/assets/earingmodel/8.png';
import earring8b from '@/assets/earingmodel/8a.png';
import earring9 from '@/assets/earingmodel/9.png';
import earring9b from '@/assets/earingmodel/9a.png';
import earring10 from '@/assets/earingmodel/10.png';
import earring10b from '@/assets/earingmodel/10a.png';
import earring11 from '@/assets/earingmodel/11.png';
import earring11b from '@/assets/earingmodel/11a.png';
import earring12 from '@/assets/earingmodel/12.png';
import earring12b from '@/assets/earingmodel/12a.png';
import earring13 from '@/assets/earingmodel/13.png';
import earring13b from '@/assets/earingmodel/13a.png';
import earring14 from '@/assets/earingmodel/14.png';
import earring14b from '@/assets/earingmodel/14a.png';
import earring15 from '@/assets/earingmodel/15.png';
import earring15b from '@/assets/earingmodel/15a.png';
import earring16 from '@/assets/earingmodel/16.png';
import earring16b from '@/assets/earingmodel/16a.png';
import earring17 from '@/assets/earingmodel/17.png';
import earring17b from '@/assets/earingmodel/17a.png';
import earring18 from '@/assets/earingmodel/18.png';
import earring18b from '@/assets/earingmodel/18a.png';
import earring19 from '@/assets/earingmodel/19.png';
import earring19b from '@/assets/earingmodel/19a.png';
import earring20 from '@/assets/earingmodel/20.png';
import earring20b from '@/assets/earingmodel/20a.png';

// ======================
// Interfaces
// ======================

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: 'rings' | 'pendants' | 'earrings';
  isRing: boolean;
  sizes?: string[];
  description: string;
  material: string;
  brand?: string;
  discount?: number;
  rating?: number;
  gst?: number;
  specifications?: {
    goldWeight?: string;
    diamondWeight?: string;
    goldPurity?: string;
    diamondQuality?: string;
    diamondCount?: number;
  };
  isBestSeller?: boolean;
  isSpecial?: boolean;
  isJewelry?: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

// ======================
// Categories (3 categories)
// ======================

export const categories: Category[] = [
  { id: 'rings', name: 'Rings', image: ring1, productCount: 18 },
  { id: 'pendants', name: 'Pendants', image: pendant1, productCount: 16 },
  { id: 'earrings', name: 'Earrings', image: earring1, productCount: 20 },
];

// ======================
// RINGS PRODUCTS (18)
// ======================

export const ringProducts: Product[] = [
  {
    id: 'ring-001',
    name: 'NAKSH',
    price: 43445,
    image: ring1,
    images: [ring1, ringb],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8', '9'],
    description: 'A stunning diamond ring with elegant design, perfect for special occasions. Features a brilliant cut diamond set in premium gold.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.67g',
      diamondWeight: '0.45ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['diamond', 'elegant', 'solitaire', '18k'],
  },
  {
    id: 'ring-002',
    name: 'Luxury Diamond Ring',
    price: 143235,
    image: ring2,
    images: [ring2, ring2b],
    category: 'rings',
    isRing: true,
    sizes: ['6', '7', '8', '9', '10'],
    description: 'Premium quality diamond ring with substantial gold weight. Multiple diamonds create a luxurious, sparkling effect.',
    material: '22K Gold',
    specifications: {
      goldWeight: '10.81g',
      diamondWeight: '0.79ct',
      goldPurity: '22K',
      diamondQuality: 'VS',
      diamondCount: 3
    },
    isSpecial: true,
    tags: ['luxury', 'premium', 'multi-stone', '22k'],
  },
  {
    id: 'ring-003',
    name: 'Statement Diamond Ring',
    price: 262520,
    image: ring3,
    images: [ring3, ring3b],
    category: 'rings',
    isRing: true,
    sizes: ['6', '7', '8', '9'],
    description: 'A magnificent statement piece with impressive diamond weight. Ideal for engagements and special celebrations.',
    material: '22K Gold',
    specifications: {
      goldWeight: '13.22g',
      diamondWeight: '2.31ct',
      goldPurity: '22K',
      diamondQuality: 'VVS',
      diamondCount: 5
    },
    isSpecial: true,
    tags: ['statement', 'engagement', 'vvs', 'heavy'],
  },
  {
    id: 'ring-004',
    name: 'SARIT',
    price: 58240,
    image: ring4,
    images: [ring4, ring4b],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8'],
    description: 'Classic design with a perfect balance of gold and diamond. Suitable for daily wear and everyday elegance.',
    material: '18K Gold',
    specifications: {
      goldWeight: '4.94g',
      diamondWeight: '0.25ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['classic', 'everyday', 'solitaire', '18k'],
  },
  {
    id: 'ring-005',
    name: 'AYAN',
    price: 56885,
    image: ring5,
    images: [ring5, ring5b],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8', '9'],
    description: 'Contemporary design with modern aesthetics. Perfect for the fashion-forward individual.',
    material: '18K Gold',
    specifications: {
      goldWeight: '5.01g',
      diamondWeight: '0.22ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isJewelry: true,
    tags: ['modern', 'fashion', 'contemporary'],
  },
  {
    id: 'ring-006',
    name: 'REYA',
    price: 38495,
    image: ring6,
    images: [ring6, ring6b],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7'],
    description: 'Delicate and feminine design with a subtle diamond accent. Lightweight and comfortable for all-day wear.',
    material: '18K Gold',
    specifications: {
      goldWeight: '2.77g',
      diamondWeight: '0.23ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['delicate', 'feminine', 'lightweight'],
  },
  {
    id: 'ring-007',
    name: 'VIRA',
    price: 79425,
    image: ring7,
    images: [ring7, ring7b],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8', '9'],
    description: 'High diamond weight relative to gold creates maximum sparkle. Eye-catching design that shines from every angle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '3.15g',
      diamondWeight: '0.81ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isJewelry: true,
    tags: ['sparkle', 'brilliant', 'vs'],
  },
  {
    id: 'ring-008',
    name: 'SHIKHA',
    price: 84110,
    image: ring8,
    images: [ring8, ring8b],
    category: 'rings',
    isRing: true,
    sizes: ['6', '7', '8', '9'],
    description: 'Elegant design with substantial diamond weight. Perfect for those who appreciate fine craftsmanship.',
    material: '18K Gold',
    specifications: {
      goldWeight: '4.16g',
      diamondWeight: '0.75ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['elegant', 'vs', 'craftsmanship'],
  },
  {
    id: 'ring-009',
    name: 'AMEYA',
    price: 65820,
    image: ring9,
    images: [ring9, ring9b],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8'],
    description: 'Timeless solitaire design with a beautiful diamond. A perfect choice for engagements or anniversaries.',
    material: '18K Gold',
    specifications: {
      goldWeight: '5.22g',
      diamondWeight: '0.33ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['solitaire', 'timeless', 'engagement'],
  },
  {
    id: 'ring-010',
    name: 'TIRA',
    price: 53490,
    image: ring10,
    images: [ring10, ring10b],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7'],
    description: 'Minimalist design with a small but brilliant diamond. Perfect for those who prefer understated elegance.',
    material: '18K Gold',
    specifications: {
      goldWeight: '4.84g',
      diamondWeight: '0.19ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['minimalist', 'understated', 'simple'],
  },
  {
    id: 'ring-011',
    name: 'NETRA',
    price: 35435,
    image: ring11,
    images: [ring11, ring11b],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7'],
    description: 'Lightweight design comfortable for daily wear. Features a beautiful diamond in a simple setting.',
    material: '18K Gold',
    specifications: {
      goldWeight: '2.41g',
      diamondWeight: '0.23ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['lightweight', 'daily-wear', 'comfort'],
  },
  {
    id: 'ring-012',
    name: 'RITI',
    price: 31220,
    image: ring12,
    images: [ring12, ring12b],
    category: 'rings',
    isRing: true,
    sizes: ['4', '5', '6', '7'],
    description: 'Petite and charming design with a small diamond. Ideal for stacking or as a delicate standalone piece.',
    material: '18K Gold',
    specifications: {
      goldWeight: '2.22g',
      diamondWeight: '0.19ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['petite', 'stackable', 'delicate'],
  },
  {
    id: 'ring-013',
    name: 'ANANTYA',
    price: 1,
    image: ring13,
    images: [ring13, ring13b],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8'],
    description: 'Exceptional value ring with good diamond weight. Beautiful design at an accessible price point.',
    material: '18K Gold',
    specifications: {
      goldWeight: '2.62g',
      diamondWeight: '0.71ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['value', 'affordable', 'good-weight'],
  },
  {
    id: 'ring-014',
    name: 'AARAVI',
    price: 72450,
    image: ring14,
    images: [ring14, ring14b],
    category: 'rings',
    isRing: true,
    sizes: ['5', '6', '7', '8', '9'],
    description: 'A beautiful blend of traditional craftsmanship and modern design. Features a stunning center diamond surrounded by delicate halo accents.',
    material: '18K Gold',
    specifications: {
      goldWeight: '3.42g',
      diamondWeight: '0.58ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 7
    },
    isBestSeller: true,
    tags: ['halo', 'traditional-modern', 'vs', 'diamond'],
  },
];

// ======================
// PENDANT PRODUCTS (16 products using chain images)
// ======================

export const pendantProducts: Product[] = [
  {
    id: 'pendant-001',
    name: 'Delicate Diamond Pendant',
    price: 12649,
    image: pendant1,
    images: [pendant1, pendant1b],
    category: 'pendants',
    isRing: false,
    description: 'Delicate pendant with a subtle diamond accent. Perfect for everyday wear and layering with other pieces.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.73g',
      diamondWeight: '0.07ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['delicate', 'everyday', 'layering', 'pendant'],
  },
  {
    id: 'pendant-002',
    name: 'Mini Diamond Pendant',
    price: 8726,
    image: pendant2,
    images: [pendant2, pendant2b],
    category: 'pendants',
    isRing: false,
    description: 'Miniature diamond pendant, lightweight and comfortable. Adds a touch of sparkle to any outfit.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.52g',
      diamondWeight: '0.03ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isJewelry: true,
    tags: ['mini', 'lightweight', 'sparkle', 'pendant'],
  },
  {
    id: 'pendant-003',
    name: 'Classic Diamond Pendant',
    price: 11369,
    image: pendant3,
    images: [pendant3, pendant3b],
    category: 'pendants',
    isRing: false,
    description: 'Classic design with a balanced gold to diamond ratio. Versatile piece suitable for all occasions.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.63g',
      diamondWeight: '0.06ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['classic', 'versatile', 'balanced', 'pendant'],
  },
  {
    id: 'pendant-004',
    name: 'Elegant Diamond Pendant',
    price: 9293,
    image: pendant4,
    images: [pendant4, pendant4b],
    category: 'pendants',
    isRing: false,
    description: 'Elegant pendant with a subtle diamond. Perfect for both casual and formal wear.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.61g',
      diamondWeight: '0.03ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['elegant', 'casual', 'formal', 'pendant'],
  },
  {
    id: 'pendant-005',
    name: 'Sparkle Diamond Pendant',
    price: 19235,
    image: pendant5,
    images: [pendant5, pendant5b],
    category: 'pendants',
    isRing: false,
    description: 'Higher diamond weight for maximum sparkle. Eye-catching piece that draws attention.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.95g',
      diamondWeight: '0.15ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['sparkle', 'eye-catching', 'vs', 'pendant'],
  },
  {
    id: 'pendant-006',
    name: 'Gold Rich Pendant',
    price: 11262,
    image: pendant6,
    images: [pendant6, pendant6b],
    category: 'pendants',
    isRing: false,
    description: 'Higher gold weight pendant with a subtle diamond. Substantial feel with elegant sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.24g',
      diamondWeight: '0.03ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isJewelry: true,
    tags: ['gold-rich', 'substantial', 'elegant', 'pendant'],
  },
  {
    id: 'pendant-007',
    name: 'Ultra Light Pendant',
    price: 8620,
    image: pendant7,
    images: [pendant7, pendant7b],
    category: 'pendants',
    isRing: false,
    description: 'Ultra lightweight design for maximum comfort. Perfect for those who prefer barely-there jewelry.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.40g',
      diamondWeight: '0.04ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['ultra-light', 'comfort', 'barely-there', 'pendant'],
  },
  {
    id: 'pendant-008',
    name: 'Premium Diamond Pendant',
    price: 18379,
    image: pendant8,
    images: [pendant8, pendant8b],
    category: 'pendants',
    isRing: false,
    description: 'Premium quality pendant with good gold and diamond weight. Substantial piece with excellent sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.33g',
      diamondWeight: '0.10ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['premium', 'substantial', 'vs', 'pendant'],
  },
  {
    id: 'pendant-009',
    name: 'Balanced Diamond Pendant',
    price: 13614,
    image: pendant9,
    images: [pendant9, pendant9b],
    category: 'pendants',
    isRing: false,
    description: 'Well-balanced design with harmonious gold to diamond ratio. Perfect all-rounder piece.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.78g',
      diamondWeight: '0.08ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['balanced', 'harmonious', 'all-rounder', 'pendant'],
  },
  {
    id: 'pendant-010',
    name: 'Gold Focus Pendant',
    price: 13408,
    image: pendant10,
    images: [pendant10, pendant10b],
    category: 'pendants',
    isRing: false,
    description: 'Gold-focused design with higher gold weight relative to diamond. Classic and timeless appeal.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.16g',
      diamondWeight: '0.04ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['gold-focused', 'classic', 'timeless', 'pendant'],
  },
  {
    id: 'pendant-011',
    name: 'Elegant Everyday Pendant',
    price: 12964,
    image: pendant11,
    images: [pendant11, pendant11b],
    category: 'pendants',
    isRing: false,
    description: 'Perfect for everyday wear with just the right amount of sparkle. Comfortable and stylish.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.78g',
      diamondWeight: '0.07ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['everyday', 'comfortable', 'stylish', 'pendant'],
  },
  {
    id: 'pendant-012',
    name: 'Diamond Focus Pendant',
    price: 14193,
    image: pendant12,
    images: [pendant12, pendant12b],
    category: 'pendants',
    isRing: false,
    description: 'Diamond-focused design with higher diamond to gold ratio. Maximum sparkle in a lightweight piece.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.61g',
      diamondWeight: '0.09ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    tags: ['diamond-focused', 'sparkle', 'vs', 'pendant'],
  },
  {
    id: 'pendant-013',
    name: 'Special Edition Pendant',
    price: 15836,
    image: pendant13,
    images: [pendant13, pendant13b],
    category: 'pendants',
    isRing: false,
    description: 'Special edition pendant with premium diamond weight. Exclusive design for discerning customers.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.72g',
      diamondWeight: '0.12ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['special-edition', 'premium', 'exclusive', 'pendant'],
  },
  {
    id: 'pendant-014',
    name: 'Versatile Diamond Pendant',
    price: 12420,
    image: pendant14,
    images: [pendant14, pendant14b],
    category: 'pendants',
    isRing: false,
    description: 'Versatile design that pairs well with chains or wears beautifully alone. Great value piece.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.90g',
      diamondWeight: '0.05ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['versatile', 'pendant-ready', 'value', 'pendant'],
  },
  {
    id: 'pendant-015',
    name: 'Substantial Gold Pendant',
    price: 19175,
    image: pendant15,
    images: [pendant15, pendant15b],
    category: 'pendants',
    isRing: false,
    description: 'Substantial gold weight pendant with good diamond accent. Feels luxurious and looks elegant.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.25g',
      diamondWeight: '0.12ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    tags: ['substantial', 'luxurious', 'vs', 'pendant'],
  },
  {
    id: 'pendant-016',
    name: 'Premium Light Pendant',
    price: 16363,
    image: pendant16,
    images: [pendant16, pendant16b],
    category: 'pendants',
    isRing: false,
    description: 'Premium quality lightweight pendant with good diamond weight. Best of both worlds.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.01g',
      diamondWeight: '0.10ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['premium', 'lightweight', 'vs', 'pendant'],
  },
];

// ======================
// EARRINGS PRODUCTS (20)
// ======================

export const earringProducts: Product[] = [
  {
    id: 'earring-001',
    name: 'Vedansa Symme',
    price: 8999,
    image: earring1,
    images: [earring1, earring1b],
    category: 'earrings',
    isRing: false,
    description: 'Classic diamond studs that add a touch of elegance to any outfit. Perfect for daily wear.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.85g',
      diamondWeight: '0.12ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 2
    },
    isBestSeller: true,
    tags: ['studs', 'everyday', 'classic', 'diamond'],
  },
  {
    id: 'earring-002',
    name: 'Zarisha Etoile',
    price: 15678,
    image: earring2,
    images: [earring2, earring2b],
    category: 'earrings',
    isRing: false,
    description: 'Elegant hoop earrings with a continuous diamond line. Lightweight and comfortable for all-day wear.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.42g',
      diamondWeight: '0.18ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 6
    },
    isJewelry: true,
    tags: ['hoops', 'elegant', 'diamond-line'],
  },
  {
    id: 'earring-003',
    name: 'Vaerika Cascade',
    price: 18999,
    image: earring3,
    images: [earring3, earring3b],
    category: 'earrings',
    isRing: false,
    description: 'Beautiful combination of diamond and pearl. Drop design that adds grace to any occasion.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.28g',
      diamondWeight: '0.08ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 2
    },
    isSpecial: true,
    tags: ['pearl', 'drop', 'elegant', 'vs'],
  },
  {
    id: 'earring-004',
    name: 'Anvitha Lume',
    price: 28999,
    image: earring4,
    images: [earring4, earring4b],
    category: 'earrings',
    isRing: false,
    description: 'Statement chandelier earrings perfect for weddings and festive occasions. Intricate design with multiple diamonds.',
    material: '22K Gold',
    specifications: {
      goldWeight: '3.56g',
      diamondWeight: '0.45ct',
      goldPurity: '22K',
      diamondQuality: 'VS',
      diamondCount: 12
    },
    isSpecial: true,
    tags: ['chandelier', 'statement', 'wedding', '22k'],
  },
  {
    id: 'earring-005',
    name: 'Kamya Flore',
    price: 6999,
    image: earring5,
    images: [earring5, earring5b],
    category: 'earrings',
    isRing: false,
    description: 'Petite solitaire studs for everyday elegance. Minimalist design with maximum sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.62g',
      diamondWeight: '0.10ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 2
    },
    isBestSeller: true,
    tags: ['solitaire', 'minimalist', 'everyday'],
  },
  {
    id: 'earring-006',
    name: 'Vritansa Halo',
    price: 12999,
    image: earring6,
    images: [earring6, earring6b],
    category: 'earrings',
    isRing: false,
    description: 'Floral-inspired earrings with delicate petal design. Perfect for nature lovers.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.15g',
      diamondWeight: '0.14ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 8
    },
    isJewelry: true,
    tags: ['floral', 'nature', 'delicate'],
  },
  {
    id: 'earring-007',
    name: 'Hrishika Petale',
    price: 16789,
    image: earring7,
    images: [earring7, earring7b],
    category: 'earrings',
    isRing: false,
    description: 'Crescent moon shaped earrings with diamond accents. Unique and celestial design.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.38g',
      diamondWeight: '0.11ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 4
    },
    tags: ['celestial', 'unique', 'moon'],
  },
  {
    id: 'earring-008',
    name: 'Aarunya Rise',
    price: 14599,
    image: earring8,
    images: [earring8, earring8b],
    category: 'earrings',
    isRing: false,
    description: 'Trendy threader earrings with diamond chain. Modern design for fashion-forward individuals.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.95g',
      diamondWeight: '0.09ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 3
    },
    isBestSeller: true,
    tags: ['threader', 'modern', 'trendy'],
  },
  {
    id: 'earring-009',
    name: 'Ivarya Gleam',
    price: 22999,
    image: earring9,
    images: [earring9, earring9b],
    category: 'earrings',
    isRing: false,
    description: 'Radiant starburst design that catches light from every angle. Perfect for parties and celebrations.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.67g',
      diamondWeight: '0.28ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 10
    },
    isSpecial: true,
    tags: ['starburst', 'radiant', 'party', 'vs'],
  },
  {
    id: 'earring-010',
    name: 'Vedansa Symme',
    price: 11299,
    image: earring10,
    images: [earring10, earring10b],
    category: 'earrings',
    isRing: false,
    description: 'Classic small hoop earrings with diamond accents. Versatile piece for daily wear.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.08g',
      diamondWeight: '0.06ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 4
    },
    isJewelry: true,
    tags: ['hoops', 'classic', 'daily-wear'],
  },
  {
    id: 'earring-011',
    name: 'Kusmita Drape',
    price: 19999,
    image: earring11,
    images: [earring11, earring11b],
    category: 'earrings',
    isRing: false,
    description: 'Elegant teardrop earrings with a solitaire diamond. Timeless design for special occasions.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.52g',
      diamondWeight: '0.22ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 2
    },
    isBestSeller: true,
    tags: ['teardrop', 'timeless', 'elegant', 'vs'],
  },
  {
    id: 'earring-012',
    name: 'Rivelle Drope',
    price: 34999,
    image: earring12,
    images: [earring12, earring12b],
    category: 'earrings',
    isRing: false,
    description: 'Traditional Kundan-style earrings with diamond embellishments. Perfect for ethnic wear.',
    material: '22K Gold',
    specifications: {
      goldWeight: '4.23g',
      diamondWeight: '0.35ct',
      goldPurity: '22K',
      diamondQuality: 'SI',
      diamondCount: 15
    },
    isSpecial: true,
    tags: ['kundan', 'traditional', 'ethnic', '22k'],
  },
  {
    id: 'earring-013',
    name: 'Vanika Verve',
    price: 8999,
    image: earring13,
    images: [earring13, earring13b],
    category: 'earrings',
    isRing: false,
    description: 'Comfortable sleeper hoops for 24/7 wear. Lightweight design with subtle sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.88g',
      diamondWeight: '0.04ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 2
    },
    isBestSeller: true,
    tags: ['sleeper', 'comfort', '247'],
  },
  {
    id: 'earring-014',
    name: 'Saerika Purete',
    price: 27999,
    image: earring14,
    images: [earring14, earring14b],
    category: 'earrings',
    isRing: false,
    description: 'Sophisticated emerald cut diamond studs. Clean lines and exceptional brilliance.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.45g',
      diamondWeight: '0.42ct',
      goldPurity: '18K',
      diamondQuality: 'VVS',
      diamondCount: 2
    },
    isSpecial: true,
    tags: ['emerald-cut', 'sophisticated', 'vvs'],
  },
  {
    id: 'earring-015',
    name: 'Aahira Lumiere',
    price: 23999,
    image: earring15,
    images: [earring15, earring15b],
    category: 'earrings',
    isRing: false,
    description: 'Three-tier drop earrings with graduated diamonds. Dramatic and eye-catching design.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.89g',
      diamondWeight: '0.31ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 6
    },
    tags: ['drop', 'dramatic', 'graduated'],
  },
  {
    id: 'earring-016',
    name: 'Tvesha Radiante',
    price: 15999,
    image: earring16,
    images: [earring16, earring16b],
    category: 'earrings',
    isRing: false,
    description: 'Classic stud with halo of smaller diamonds. Extra sparkle for special moments.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.22g',
      diamondWeight: '0.25ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 10
    },
    isBestSeller: true,
    tags: ['halo', 'stud', 'sparkle', 'vs'],
  },
  {
    id: 'earring-017',
    name: 'Ishvaya Bloome',
    price: 39999,
    image: earring17,
    images: [earring17, earring17b],
    category: 'earrings',
    isRing: false,
    description: 'Traditional Indian Jhoomar earrings. Elaborate design perfect for bridal wear.',
    material: '22K Gold',
    specifications: {
      goldWeight: '5.67g',
      diamondWeight: '0.58ct',
      goldPurity: '22K',
      diamondQuality: 'VS',
      diamondCount: 18
    },
    isSpecial: true,
    tags: ['jhoomar', 'bridal', 'traditional', '22k'],
  },
  {
    id: 'earring-018',
    name: 'Nyraya Loope',
    price: 7999,
    image: earring18,
    images: [earring18, earring18b],
    category: 'earrings',
    isRing: false,
    description: 'Minimalist ball stud earrings with diamond accents. Simple yet elegant.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.75g',
      diamondWeight: '0.05ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 2
    },
    isJewelry: true,
    tags: ['ball', 'minimalist', 'simple'],
  },
  {
    id: 'earring-019',
    name: 'Reyansa Flowe',
    price: 31999,
    image: earring19,
    images: [earring19, earring19b],
    category: 'earrings',
    isRing: false,
    description: 'Cascading diamond earrings that flow beautifully. Perfect for formal events.',
    material: '18K Gold',
    specifications: {
      goldWeight: '2.34g',
      diamondWeight: '0.48ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 14
    },
    isSpecial: true,
    tags: ['cascade', 'flowing', 'formal', 'vs'],
  },
  {
    id: 'earring-020',
    name: 'Aadhira Origine',
    price: 5999,
    image: earring20,
    images: [earring20, earring20b],
    category: 'earrings',
    isRing: false,
    description: 'Basic diamond studs for daily wear. Affordable luxury that never goes out of style.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.58g',
      diamondWeight: '0.06ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 2
    },
    isBestSeller: true,
    tags: ['studs', 'everyday', 'affordable', 'basic'],
  },
];

// ======================
// Combine all products
// ======================

const assignBrand = (arr: Product[]) => arr.map(p => ({ ...p, brand: p.brand || 'jewelskart' }));

export const products: Product[] = [];

const brandedRings = assignBrand(ringProducts);
const brandedPendants = assignBrand(pendantProducts);
const brandedEarrings = assignBrand(earringProducts);

const maxLength = Math.max(brandedRings.length, brandedPendants.length, brandedEarrings.length);

for (let i = 0; i < maxLength; i++) {
  if (brandedRings[i]) products.push(brandedRings[i]);
  if (brandedPendants[i]) products.push(brandedPendants[i]);
  if (brandedEarrings[i]) products.push(brandedEarrings[i]);
}

// ======================
// Hero Slides
// ======================

export const heroSlides = [
  {
    id: 1,
    heading: 'Timeless Rings',
    subheading: 'Discover our exquisite collection of handcrafted rings, where every piece tells a story of luxury and sophistication.',
    cta: 'Explore Rings',
    image: ring1,
  },
  {
    id: 2,
    heading: 'Elegant Pendants',
    subheading: 'Adorn yourself with pendants that transcend time. Our diamonds are selected for their exceptional brilliance.',
    cta: 'Shop Pendants',
    image: pendant1,
  },
  {
    id: 3,
    heading: 'Beautiful Earrings',
    subheading: 'From classic studs to statement chandeliers, find the perfect earrings for every occasion.',
    cta: 'View Earrings',
    image: earring1,
  },
  {
    id: 4,
    heading: 'Beautiful Pendants',
    subheading: 'Each pendant is meticulously crafted by master artisans, ensuring unparalleled quality and beauty.',
    cta: 'View Pendants',
    image: pendant1,
  },
];

// ======================
// Ring Sizes
// ======================

export const ringSizes = ['5', '6', '7', '8', '9', '10'];