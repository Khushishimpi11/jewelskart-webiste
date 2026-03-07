import ring1 from '@/assets/Ring/Ring/r1.jpg';
import chain01a from '@/assets/Chain/Chain/c1.1.jpg';
import pendant1 from '@/assets/Pendant/Pendant/p1.jpg';
import ring3 from '@/assets/Ring/Ring/r3.jpg';
import chain05a from '@/assets/Chain/Chain/c5.1.jpg';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  video?: string;
  isFeatured?: boolean;
}

export const brands: Brand[] = [
  {
    id: 'jewelskart',
    name: 'Jewelskart',
    slug: 'jewelskart',
    tagline: 'Premium Jewellery',
    image: ring1,
    isFeatured: true,
  },
  {
    id: 'palmonas',
    name: 'Palmonas',
    slug: 'palmonas',
    tagline: 'Crafted in India',
    image: chain01a,
  },
  {
    id: 'giva',
    name: 'Giva',
    slug: 'giva',
    tagline: 'Silver Elegance',
    image: pendant1,
  },
  {
    id: 'kushals',
    name: "Kushal's",
    slug: 'kushals',
    tagline: 'Heritage Craft',
    image: ring3,
  },
  {
    id: 'voylla',
    name: 'Voylla',
    slug: 'voylla',
    tagline: 'Fashion Forward',
    image: chain05a,
  },
];

// Assign brands to products by distributing them
export const brandNames = brands.map(b => b.name);
