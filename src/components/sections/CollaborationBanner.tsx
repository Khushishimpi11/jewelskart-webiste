import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import givaImg from '@/assets/givaimg.jpg';
import palmonasImg from '@/assets/palmonasimg.jpg';
import jewelskartImg from '@/assets/jewelskartimg.webp';
import kushalsImg from '@/assets/kushalsimg.webp';

const collabBrands = [
  {
    name: 'Giva',
    slug: 'giva',
    tagline: 'Silver Elegance, Redefined',
    image: givaImg,
  },
  {
    name: 'Palmonas',
    slug: 'palmonas',
    tagline: 'Crafted with Passion in India',
    image: palmonasImg,
  },
  {
    name: 'Jewelskart',
    slug: 'jewelskart',
    tagline: 'Premium Jewellery for Every Occasion',
    image: jewelskartImg,
  },
  {
    name: "Kushal's",
    slug: 'kushals',
    tagline: 'Heritage Craft, Modern Design',
    image: kushalsImg,
  },
];

const CollaborationBanner = () => {
  return (
    <section className="py-10 sm:py-14 lg:py-16 px-4">
      <div
        className="max-w-[1280px] mx-auto rounded-2xl px-6 sm:px-10 lg:px-14 py-10 sm:py-14"
        style={{ backgroundColor: 'hsl(24, 33%, 95%)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground">
            Our Brand Partners
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Discover exclusive collections from India's finest jewellery houses
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {collabBrands.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/shop?brand=${brand.slug}`}
                className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-5 text-center">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">
                    {brand.name}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1 line-clamp-1">
                    {brand.tagline}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollaborationBanner;
