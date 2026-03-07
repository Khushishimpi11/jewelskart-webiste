// Product images imports
// ======================

// RING IMAGES (13 rings - 1 thumbnail each)
import ring1 from '@/assets/Ring/Ring/r1.jpg';
import ring2 from '@/assets/Ring/Ring/r2.jpg';
import ring3 from '@/assets/Ring/Ring/r3.jpg';
import ring4 from '@/assets/Ring/Ring/r4.jpg';
import ring5 from '@/assets/Ring/Ring/r5.jpg';
import ring6 from '@/assets/Ring/Ring/r6.jpg';
import ring7 from '@/assets/Ring/Ring/r7.jpg';
import ring8 from '@/assets/Ring/Ring/r8.jpg';
import ring9 from '@/assets/Ring/Ring/r9.jpg';
import ring10 from '@/assets/Ring/Ring/r10.jpg';
import ring11 from '@/assets/Ring/Ring/r11.jpg';
import ring12 from '@/assets/Ring/Ring/r12.jpg';
import ring13 from '@/assets/Ring/Ring/r13.jpg';

// CHAIN IMAGES (24 chains - 2 thumbnails each)
// Chain 01
import chain01a from '@/assets/Chain/Chain/c1.1.jpg';
import chain01b from '@/assets/Chain/Chain/c1.2.jpg';

// Chain 02
import chain02a from '@/assets/Chain/Chain/c2.1.jpg';
import chain02b from '@/assets/Chain/Chain/c2.2.jpg';

// Chain 03
import chain03a from '@/assets/Chain/Chain/c3.1.jpg';
import chain03b from '@/assets/Chain/Chain/c3.2.jpg';

// Chain 04
import chain04a from '@/assets/Chain/Chain/c4.1.jpg';
import chain04b from '@/assets/Chain/Chain/c4.2.jpg';

// Chain 05
import chain05a from '@/assets/Chain/Chain/c5.1.jpg';
import chain05b from '@/assets/Chain/Chain/c5.2.jpg';

// Chain 06
import chain06a from '@/assets/Chain/Chain/c6.1.jpg';
import chain06b from '@/assets/Chain/Chain/c6.2.jpg';

// Chain 07
import chain07a from '@/assets/Chain/Chain/c7.1.jpg';
import chain07b from '@/assets/Chain/Chain/c7.2.jpg';

// Chain 08
import chain08a from '@/assets/Chain/Chain/c8.1.jpg';
import chain08b from '@/assets/Chain/Chain/c8.2.jpg';

// Chain 09
import chain09a from '@/assets/Chain/Chain/c9.1.jpg';
import chain09b from '@/assets/Chain/Chain/c9.2.jpg';

// Chain 10
import chain10a from '@/assets/Chain/Chain/c10.1.jpg';
import chain10b from '@/assets/Chain/Chain/c10.2.jpg';

// Chain 11
import chain11a from '@/assets/Chain/Chain/c11.1.jpg';
import chain11b from '@/assets/Chain/Chain/c11.2.jpg';

// Chain 12
import chain12a from '@/assets/Chain/Chain/c12.1.jpg';
import chain12b from '@/assets/Chain/Chain/c12.2.jpg';

// Chain 13
import chain13a from '@/assets/Chain/Chain/c13.1.jpg';
import chain13b from '@/assets/Chain/Chain/c13.2.jpg';

// Chain 14
import chain14a from '@/assets/Chain/Chain/c14.1.jpg';
import chain14b from '@/assets/Chain/Chain/c14.2.jpg';

// Chain 15
import chain15a from '@/assets/Chain/Chain/c15.1.jpg';
import chain15b from '@/assets/Chain/Chain/c15.2.jpg';

// Chain 16
import chain16a from '@/assets/Chain/Chain/c16.1.jpg';
import chain16b from '@/assets/Chain/Chain/c16.2.jpg';

// Chain 17
import chain17a from '@/assets/Chain/Chain/c17.1.jpg';
import chain17b from '@/assets/Chain/Chain/c17.2.jpg';

// Chain 18
import chain18a from '@/assets/Chain/Chain/c18.1.jpg';
import chain18b from '@/assets/Chain/Chain/c18.2.jpg';

// Chain 19
import chain19a from '@/assets/Chain/Chain/c19.1.jpg';
import chain19b from '@/assets/Chain/Chain/c19.2.jpg';

// Chain 20
import chain20a from '@/assets/Chain/Chain/c20.1.jpg';
import chain20b from '@/assets/Chain/Chain/c20.2.jpg';

// Chain 21
import chain21a from '@/assets/Chain/Chain/c21.1.jpg';
import chain21b from '@/assets/Chain/Chain/c21.2.jpg';

// Chain 22
import chain22a from '@/assets/Chain/Chain/c22.1.jpg';
import chain22b from '@/assets/Chain/Chain/c22.2.jpg';

// Chain 23
import chain23a from '@/assets/Chain/Chain/c23.1.jpg';
import chain23b from '@/assets/Chain/Chain/c23.2.jpg';

// Chain 24
import chain24a from '@/assets/Chain/Chain/c24.1.jpg';
import chain24b from '@/assets/Chain/Chain/c24.2.jpg';

// PENDANT IMAGES (16 pendants - will use placeholder images for now)
// Using ring images as placeholders for pendants since we don't have pendant images yet
import pendant1 from '@/assets/Pendant/Pendant/p1.jpg';
import pendant2 from '@/assets/Pendant/Pendant/p2.jpg';
import pendant3 from '@/assets/Pendant/Pendant/p3.jpg';
import pendant4 from '@/assets/Pendant/Pendant/p4.jpg';
import pendant5 from '@/assets/Pendant/Pendant/p5.jpg';
import pendant6 from '@/assets/Pendant/Pendant/p6.jpg';
import pendant7 from '@/assets/Pendant/Pendant/p7.jpg';
import pendant8 from '@/assets/Pendant/Pendant/p8.jpg';
import pendant9 from '@/assets/Pendant/Pendant/p9.jpg';
import pendant10 from '@/assets/Pendant/Pendant/p10.jpg';
import pendant11 from '@/assets/Pendant/Pendant/p11.jpg';
import pendant12 from '@/assets/Pendant/Pendant/p12.jpg';
import pendant13 from '@/assets/Pendant/Pendant/p13.jpg';
import pendant14 from '@/assets/Pendant/Pendant/p14.jpg';
import pendant15 from '@/assets/Pendant/Pendant/p15.jpg';
import pendant16 from '@/assets/Pendant/Pendant/p16.jpg';

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
  category: 'rings' | 'chains' | 'pendants';
  isRing: boolean;
  sizes?: string[];
  description: string;
  material: string;
  brand?: string;
  discount?: number;
  rating?: number;
  specifications?: {
    goldWeight?: string;
    diamondWeight?: string;
    goldPurity?: string;
    diamondQuality?: string;
    diamondCount?: number;
  };
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

// ======================
// Categories (3 categories only)
// ======================

export const categories: Category[] = [
  { id: 'rings', name: 'Rings', image: ring1, productCount: 13 },
  { id: 'chains', name: 'Chains', image: chain01a, productCount: 24 },
  { id: 'pendants', name: 'Pendants', image: pendant1, productCount: 16 },
];

// ======================
// RINGS PRODUCTS (13)
// ======================

export const ringProducts: Product[] = [
  {
    id: 'ring-001',
    name: 'Elegant Diamond Ring',
    price: 43445,
    image: ring1,
    images: [ring1],
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
    images: [ring2],
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
    images: [ring3],
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
    name: 'Classic Diamond Ring',
    price: 58240,
    image: ring4,
    images: [ring4],
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
    name: 'Modern Diamond Ring',
    price: 56885,
    image: ring5,
    images: [ring5],
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
    tags: ['modern', 'fashion', 'contemporary'],
  },
  {
    id: 'ring-006',
    name: 'Delicate Diamond Ring',
    price: 38495,
    image: ring6,
    images: [ring6],
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
    name: 'Sparkle Diamond Ring',
    price: 79425,
    image: ring7,
    images: [ring7],
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
    tags: ['sparkle', 'brilliant', 'vs'],
  },
  {
    id: 'ring-008',
    name: 'Elegant Diamond Ring',
    price: 84110,
    image: ring8,
    images: [ring8],
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
    name: 'Classic Solitaire Ring',
    price: 65820,
    image: ring9,
    images: [ring9],
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
    name: 'Minimalist Diamond Ring',
    price: 53490,
    image: ring10,
    images: [ring10],
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
    name: 'Lightweight Diamond Ring',
    price: 35435,
    image: ring11,
    images: [ring11],
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
    name: 'Petite Diamond Ring',
    price: 31220,
    image: ring12,
    images: [ring12],
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
    name: 'Value Diamond Ring',
    price: 1,
    image: ring13,
    images: [ring13],
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
];

// ======================
// CHAINS PRODUCTS (24)
// ======================

export const chainProducts: Product[] = [
  {
    id: 'chain-001',
    name: 'Delicate Diamond Chain',
    price: 12649,
    image: chain01a,
    images: [chain01a, chain01b],
    category: 'chains',
    isRing: false,
    description: 'Delicate chain with a subtle diamond accent. Perfect for everyday wear and layering with other pieces.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.73g',
      diamondWeight: '0.07ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['delicate', 'everyday', 'layering'],
  },
  {
    id: 'chain-002',
    name: 'Mini Diamond Chain',
    price: 8726,
    image: chain02a,
    images: [chain02a, chain02b],
    category: 'chains',
    isRing: false,
    description: 'Miniature diamond chain, lightweight and comfortable. Adds a touch of sparkle to any outfit.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.52g',
      diamondWeight: '0.03ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['mini', 'lightweight', 'sparkle'],
  },
  {
    id: 'chain-003',
    name: 'Classic Diamond Chain',
    price: 11369,
    image: chain03a,
    images: [chain03a, chain03b],
    category: 'chains',
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
    tags: ['classic', 'versatile', 'balanced'],
  },
  {
    id: 'chain-004',
    name: 'Elegant Diamond Chain',
    price: 9293,
    image: chain04a,
    images: [chain04a, chain04b],
    category: 'chains',
    isRing: false,
    description: 'Elegant chain with a subtle diamond. Perfect for both casual and formal wear.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.61g',
      diamondWeight: '0.03ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['elegant', 'casual', 'formal'],
  },
  {
    id: 'chain-005',
    name: 'Sparkle Diamond Chain',
    price: 19235,
    image: chain05a,
    images: [chain05a, chain05b],
    category: 'chains',
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
    tags: ['sparkle', 'eye-catching', 'vs'],
  },
  {
    id: 'chain-006',
    name: 'Gold Rich Chain',
    price: 11262,
    image: chain06a,
    images: [chain06a, chain06b],
    category: 'chains',
    isRing: false,
    description: 'Higher gold weight chain with a subtle diamond. Substantial feel with elegant sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.24g',
      diamondWeight: '0.03ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['gold-rich', 'substantial', 'elegant'],
  },
  {
    id: 'chain-007',
    name: 'Ultra Light Chain',
    price: 8620,
    image: chain07a,
    images: [chain07a, chain07b],
    category: 'chains',
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
    tags: ['ultra-light', 'comfort', 'barely-there'],
  },
  {
    id: 'chain-008',
    name: 'Premium Diamond Chain',
    price: 18379,
    image: chain08a,
    images: [chain08a, chain08b],
    category: 'chains',
    isRing: false,
    description: 'Premium quality chain with good gold and diamond weight. Substantial piece with excellent sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.33g',
      diamondWeight: '0.10ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['premium', 'substantial', 'vs'],
  },
  {
    id: 'chain-009',
    name: 'Balanced Diamond Chain',
    price: 13614,
    image: chain09a,
    images: [chain09a, chain09b],
    category: 'chains',
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
    tags: ['balanced', 'harmonious', 'all-rounder'],
  },
  {
    id: 'chain-010',
    name: 'Gold Focus Chain',
    price: 13408,
    image: chain10a,
    images: [chain10a, chain10b],
    category: 'chains',
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
    tags: ['gold-focused', 'classic', 'timeless'],
  },
  {
    id: 'chain-011',
    name: 'Elegant Everyday Chain',
    price: 12964,
    image: chain11a,
    images: [chain11a, chain11b],
    category: 'chains',
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
    tags: ['everyday', 'comfortable', 'stylish'],
  },
  {
    id: 'chain-012',
    name: 'Diamond Focus Chain',
    price: 14193,
    image: chain12a,
    images: [chain12a, chain12b],
    category: 'chains',
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
    tags: ['diamond-focused', 'sparkle', 'vs'],
  },
  {
    id: 'chain-013',
    name: 'Special Edition Chain',
    price: 15836,
    image: chain13a,
    images: [chain13a, chain13b],
    category: 'chains',
    isRing: false,
    description: 'Special edition chain with premium diamond weight. Exclusive design for discerning customers.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.72g',
      diamondWeight: '0.12ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['special-edition', 'premium', 'exclusive'],
  },
  {
    id: 'chain-014',
    name: 'Versatile Diamond Chain',
    price: 12420,
    image: chain14a,
    images: [chain14a, chain14b],
    category: 'chains',
    isRing: false,
    description: 'Versatile design that pairs well with pendants or wears beautifully alone. Great value piece.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.90g',
      diamondWeight: '0.05ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['versatile', 'pendant-ready', 'value'],
  },
  {
    id: 'chain-015',
    name: 'Substantial Gold Chain',
    price: 19175,
    image: chain15a,
    images: [chain15a, chain15b],
    category: 'chains',
    isRing: false,
    description: 'Substantial gold weight chain with good diamond accent. Feels luxurious and looks elegant.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.25g',
      diamondWeight: '0.12ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    tags: ['substantial', 'luxurious', 'vs'],
  },
  {
    id: 'chain-016',
    name: 'Premium Light Chain',
    price: 16363,
    image: chain16a,
    images: [chain16a, chain16b],
    category: 'chains',
    isRing: false,
    description: 'Premium quality lightweight chain with good diamond weight. Best of both worlds.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.01g',
      diamondWeight: '0.10ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['premium', 'lightweight', 'vs'],
  },
  {
    id: 'chain-017',
    name: 'Balanced Beauty Chain',
    price: 15567,
    image: chain17a,
    images: [chain17a, chain17b],
    category: 'chains',
    isRing: false,
    description: 'Beautifully balanced chain with harmonious proportions. Perfect for any occasion.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.09g',
      diamondWeight: '0.08ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['balanced', 'beautiful', 'versatile'],
  },
  {
    id: 'chain-018',
    name: 'Everyday Essential Chain',
    price: 11286,
    image: chain18a,
    images: [chain18a, chain18b],
    category: 'chains',
    isRing: false,
    description: 'Essential everyday chain with just the right sparkle. Comfortable enough for 24/7 wear.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.72g',
      diamondWeight: '0.05ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['essential', 'everyday', '247'],
  },
  {
    id: 'chain-019',
    name: 'Elegant Sparkle Chain',
    price: 14181,
    image: chain19a,
    images: [chain19a, chain19b],
    category: 'chains',
    isRing: false,
    description: 'Elegant design with balanced sparkle. Perfect for both day and evening wear.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.87g',
      diamondWeight: '0.08ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['elegant', 'day-to-night', 'balanced'],
  },
  {
    id: 'chain-020',
    name: 'Diamond Rich Chain',
    price: 19066,
    image: chain20a,
    images: [chain20a, chain20b],
    category: 'chains',
    isRing: false,
    description: 'Diamond-rich design with impressive diamond weight relative to gold. Maximum sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.82g',
      diamondWeight: '0.16ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['diamond-rich', 'maximum-sparkle', 'vs'],
  },
  {
    id: 'chain-021',
    name: 'Classic Everyday Chain',
    price: 12271,
    image: chain21a,
    images: [chain21a, chain21b],
    category: 'chains',
    isRing: false,
    description: 'Classic design perfect for everyday wear. Reliable quality and consistent sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.67g',
      diamondWeight: '0.07ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['classic', 'everyday', 'reliable'],
  },
  {
    id: 'chain-022',
    name: 'Light & Bright Chain',
    price: 11704,
    image: chain22a,
    images: [chain22a, chain22b],
    category: 'chains',
    isRing: false,
    description: 'Lightweight yet bright with good diamond weight. Comfortable and eye-catching.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.58g',
      diamondWeight: '0.07ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['lightweight', 'bright', 'comfortable'],
  },
  {
    id: 'chain-023',
    name: 'Perfect Proportion Chain',
    price: 12858,
    image: chain23a,
    images: [chain23a, chain23b],
    category: 'chains',
    isRing: false,
    description: 'Perfectly proportioned chain with ideal gold to diamond ratio. A well-balanced piece.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.66g',
      diamondWeight: '0.08ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['proportioned', 'balanced', 'ideal'],
  },
  {
    id: 'chain-024',
    name: 'Value Diamond Chain',
    price: 12188,
    image: chain24a,
    images: [chain24a, chain24b],
    category: 'chains',
    isRing: false,
    description: 'Great value chain with good diamond weight. Affordable luxury for everyday elegance.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.76g',
      diamondWeight: '0.06ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['value', 'affordable', 'everyday-elegance'],
  },
];

// ======================
// PENDANTS PRODUCTS (16)
// Based on the provided data
// ======================

export const pendantProducts: Product[] = [
  {
    id: 'pendant-001',
    name: 'Elegant Pendant 1',
    price: 15335,
    image: pendant1,
    images: [pendant1],
    category: 'pendants',
    isRing: false,
    description: 'Beautiful pendant with delicate design. Perfect for everyday wear and special occasions.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.95g',
      diamondWeight: '0.09ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['elegant', 'everyday', 'delicate'],
  },
  {
    id: 'pendant-002',
    name: 'Classic Pendant 2',
    price: 23682,
    image: pendant2,
    images: [pendant2],
    category: 'pendants',
    isRing: false,
    description: 'Classic design pendant with substantial gold weight. Timeless piece for any collection.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.14g',
      diamondWeight: '0.20ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    tags: ['classic', 'timeless', 'substantial'],
  },
  {
    id: 'pendant-003',
    name: 'Lightweight Pendant 3',
    price: 17248,
    image: pendant3,
    images: [pendant3],
    category: 'pendants',
    isRing: false,
    description: 'Lightweight pendant comfortable for daily wear. Features a subtle diamond accent.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.46g',
      diamondWeight: '0.07ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['lightweight', 'daily-wear', 'subtle'],
  },
  {
    id: 'pendant-004',
    name: 'Diamond Pendant 4',
    price: 22852,
    image: pendant4,
    images: [pendant4],
    category: 'pendants',
    isRing: false,
    description: 'Beautiful diamond pendant with good gold weight. Perfect for gifting.',
    material: '18K Gold',
    specifications: {
      goldWeight: '2.04g',
      diamondWeight: '0.10ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    tags: ['diamond', 'gift', 'beautiful'],
  },
  {
    id: 'pendant-005',
    name: 'Minimalist Pendant 5',
    price: 15590,
    image: pendant5,
    images: [pendant5],
    category: 'pendants',
    isRing: false,
    description: 'Minimalist design for those who prefer understated elegance. Simple yet sophisticated.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.30g',
      diamondWeight: '0.06ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['minimalist', 'understated', 'sophisticated'],
  },
  {
    id: 'pendant-006',
    name: 'Petite Pendant 6',
    price: 12798,
    image: pendant6,
    images: [pendant6],
    category: 'pendants',
    isRing: false,
    description: 'Petite and charming pendant with a small diamond. Ideal for layering.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.96g',
      diamondWeight: '0.05ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['petite', 'layering', 'charming'],
  },
  {
    id: 'pendant-007',
    name: 'Sparkle Pendant 7',
    price: 21523,
    image: pendant7,
    images: [pendant7],
    category: 'pendants',
    isRing: false,
    description: 'High diamond weight for maximum sparkle. Eye-catching piece that draws attention.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.21g',
      diamondWeight: '0.16ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['sparkle', 'eye-catching', 'vs'],
  },
  {
    id: 'pendant-008',
    name: 'Premium Pendant 8',
    price: 31233,
    image: pendant8,
    images: [pendant8],
    category: 'pendants',
    isRing: false,
    description: 'Premium quality pendant with substantial diamond weight. Luxurious piece for special occasions.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.41g',
      diamondWeight: '0.29ct',
      goldPurity: '18K',
      diamondQuality: 'VVS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['premium', 'luxurious', 'vvs'],
  },
  {
    id: 'pendant-009',
    name: 'Elegant Diamond Pendant 9',
    price: 25045,
    image: pendant9,
    images: [pendant9],
    category: 'pendants',
    isRing: false,
    description: 'Elegant pendant with good diamond weight. Perfect for both casual and formal wear.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.15g',
      diamondWeight: '0.22ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    tags: ['elegant', 'versatile', 'vs'],
  },
  {
    id: 'pendant-010',
    name: 'Gold Rich Pendant 10',
    price: 30211,
    image: pendant10,
    images: [pendant10],
    category: 'pendants',
    isRing: false,
    description: 'Higher gold weight pendant with good diamond accent. Substantial feel and elegant look.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.97g',
      diamondWeight: '0.22ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    tags: ['gold-rich', 'substantial', 'elegant'],
  },
  {
    id: 'pendant-011',
    name: 'Statement Pendant 11',
    price: 21578,
    image: pendant11,
    images: [pendant11],
    category: 'pendants',
    isRing: false,
    description: 'Statement piece with substantial gold weight. Makes a bold impression.',
    material: '18K Gold',
    specifications: {
      goldWeight: '2.56g',
      diamondWeight: '0.03ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['statement', 'bold', 'gold-rich'],
  },
  {
    id: 'pendant-012',
    name: 'Delicate Pendant 12',
    price: 20080,
    image: pendant12,
    images: [pendant12],
    category: 'pendants',
    isRing: false,
    description: 'Delicate design with minimal diamond. Perfect for those who prefer subtle sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.60g',
      diamondWeight: '0.01ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['delicate', 'subtle', 'minimal'],
  },
  {
    id: 'pendant-013',
    name: 'Diamond Accent Pendant 13',
    price: 20011,
    image: pendant13,
    images: [pendant13],
    category: 'pendants',
    isRing: false,
    description: 'Beautiful pendant with good diamond weight. Versatile piece for any occasion.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.97g',
      diamondWeight: '0.16ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['versatile', 'beautiful', 'vs'],
  },
  {
    id: 'pendant-014',
    name: 'Everyday Pendant 14',
    price: 12088,
    image: pendant14,
    images: [pendant14],
    category: 'pendants',
    isRing: false,
    description: 'Perfect for everyday wear. Lightweight and comfortable with subtle sparkle.',
    material: '18K Gold',
    specifications: {
      goldWeight: '1.26g',
      diamondWeight: '0.01ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    isBestSeller: true,
    tags: ['everyday', 'lightweight', 'comfortable'],
  },
  {
    id: 'pendant-015',
    name: 'Value Pendant 15',
    price: 10301,
    image: pendant15,
    images: [pendant15],
    category: 'pendants',
    isRing: false,
    description: 'Great value pendant with good design. Affordable luxury for daily elegance.',
    material: '18K Gold',
    specifications: {
      goldWeight: '0.77g',
      diamondWeight: '0.03ct',
      goldPurity: '18K',
      diamondQuality: 'SI',
      diamondCount: 1
    },
    tags: ['value', 'affordable', 'everyday'],
  },
  {
    id: 'pendant-016',
    name: 'Luxury Pendant 16',
    price: 28702,
    image: pendant16,
    images: [pendant16],
    category: 'pendants',
    isRing: false,
    description: 'Luxury pendant with substantial gold and diamond weight. Perfect for special occasions.',
    material: '18K Gold',
    specifications: {
      goldWeight: '2.04g',
      diamondWeight: '0.19ct',
      goldPurity: '18K',
      diamondQuality: 'VS',
      diamondCount: 1
    },
    isSpecial: true,
    tags: ['luxury', 'special-occasion', 'vs'],
  },
];

// ======================
// Combine all products
// ======================

// Assign all products to Jewelskart brand
const assignBrand = (arr: Product[]) => arr.map(p => ({ ...p, brand: p.brand || 'jewelskart' }));

export const products: Product[] = [];

const brandedRings = assignBrand(ringProducts);
const brandedPendants = assignBrand(pendantProducts);
const brandedChains = assignBrand(chainProducts);

const maxLength = Math.max(
  brandedRings.length,
  brandedPendants.length,
  brandedChains.length
);

for (let i = 0; i < maxLength; i++) {
  if (brandedRings[i]) products.push(brandedRings[i]);
  if (brandedPendants[i]) products.push(brandedPendants[i]);
  if (brandedChains[i]) products.push(brandedChains[i]);
}

// ======================
// Hero Slides (mix of all categories)
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
    heading: 'Elegant Chains',
    subheading: 'Adorn yourself with chains that transcend time. Our diamonds are selected for their exceptional brilliance.',
    cta: 'Shop Chains',
    image: chain01a,
  },
  {
    id: 3,
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