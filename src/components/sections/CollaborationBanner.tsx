import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import givaImg from '@/assets/givaimg.jpg';
import palmonasImg from '@/assets/palmonasimg.jpg';
import jewelskartImg from '@/assets/jewelskartimg.webp';
import kushalsImg from '@/assets/kushalsimg.webp';

const collabBrands = [
  {
    name: 'GIVA',
    slug: 'giva',
    tagline: 'Silver Elegance, Redefined',
    image: givaImg,
  },
  {
    name: 'PALMONAS',
    slug: 'palmonas',
    tagline: 'Crafted with Passion in India',
    image: palmonasImg,
  },
  {
    name: 'JEWELSKART',
    slug: 'jewelskart',
    tagline: 'Premium Jewellery for Every Occasion',
    image: jewelskartImg,
  },
  {
    name: "KUSHAL'S",
    slug: 'kushals',
    tagline: 'Heritage Craft, Modern Design',
    image: kushalsImg,
  },
];

const CollaborationBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 420;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-14 sm:py-20 lg:py-24 overflow-hidden">
      {/* Navigation arrows — contained */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 mb-10 sm:mb-14">
        <div className="flex items-end justify-end gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider — left padding only, right bleeds to edge */}
      <div
        ref={scrollRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-hide pl-6 sm:pl-10 lg:pl-[calc((100vw-1280px)/2+64px)] pr-6"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {collabBrands.map((brand, i) => (
          <motion.div
            key={brand.slug}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex-shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <Link
              to={`/shop?brand=${brand.slug}`}
              className="group relative block w-[300px] sm:w-[360px] lg:w-[400px] rounded-2xl overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden rounded-2xl">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Gold hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(to top, hsla(43, 54%, 53%, 0.4), hsla(43, 54%, 53%, 0.05) 60%, transparent)',
                  }}
                />
              </div>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3
                  className="font-display text-xl sm:text-2xl font-bold text-white tracking-wider mb-1 group-hover:translate-y-0 transition-transform duration-300"
                >
                  {brand.name}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm font-body tracking-wide">
                  {brand.tagline}
                </p>
                <div
                  className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-body opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  style={{ color: 'hsl(43, 54%, 63%)' }}
                >
                  Explore Collection
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CollaborationBanner;
