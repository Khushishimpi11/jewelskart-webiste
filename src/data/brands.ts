import ring1 from '@/assets/jewelskartimg.webp';
import chain01a from '@/assets/palmonasimg.jpg';
import pendant1 from '@/assets/givaimg.jpg';
import ring3 from '@/assets/kushalsimg.webp';
import chain05a from '@/assets/voyllai.avif';

// Import videos
import jewelskartVideo from '@/assets/jewelskart.mp4';
import palmonasVideo from '@/assets/palmonas.mp4';
import givaVideo from '@/assets/giva.mp4';
import kushalsVideo from '@/assets/kushals.mp4';
import voyllaVideo from '@/assets/Voylla.mp4';

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
    video: jewelskartVideo,
    isFeatured: true,
  },
  {
    id: 'palmonas',
    name: 'Palmonas',
    slug: 'palmonas',
    tagline: 'Crafted in India',
    image: chain01a,
    video: palmonasVideo,
  },
  {
    id: 'giva',
    name: 'Giva',
    slug: 'giva',
    tagline: 'Silver Elegance',
    image: pendant1,
    video: givaVideo,
  },
  {
    id: 'kushals',
    name: "Kushal's",
    slug: 'kushals',
    tagline: 'Heritage Craft',
    image: ring3,
    video: kushalsVideo,
  },
  {
    id: 'voylla',
    name: 'Voylla',
    slug: 'voylla',
    tagline: 'Fashion Forward',
    image: chain05a,
    video: voyllaVideo,
  },
];

// Assign brands to products by distributing them
export const brandNames = brands.map(b => b.name);