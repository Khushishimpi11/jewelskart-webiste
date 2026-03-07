import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { brands } from '@/data/brands';

const PremiumBrandsGrid = () => {
  const navigate = useNavigate();
  const featured = brands[0]; // Jewelskart
  const gridBrands = brands.slice(1, 5); // 4 smaller cards

  return (
    <section className="py-8 md:py-12 px-4 md:px-8 lg:px-16 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8">
          Premium Brands
        </h2>

        {/* Mobile: stack, Desktop: 2-col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 auto-rows-fr">
          {/* Left: Featured large card - spans full height of right grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(`/shop?brand=${featured.slug}`)}
            className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[4/5] md:aspect-auto md:row-span-1"
          >
            <img
              src={featured.image}
              alt={featured.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
              <h3 className="text-white font-serif text-2xl md:text-3xl font-bold">{featured.name}</h3>
              <p className="text-white/70 text-sm mt-1">{featured.tagline}</p>
            </div>
            <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 w-12 h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
              <ArrowRight className="w-5 h-5 text-foreground" />
            </div>
          </motion.div>

          {/* Right: 2x2 grid with equal-sized cards */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-5">
            {gridBrands.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => navigate(`/shop?brand=${brand.slug}`)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                  <h3 className="text-white font-serif text-base md:text-lg font-bold">{brand.name}</h3>
                  <p className="text-white/60 text-xs mt-0.5">{brand.tagline}</p>
                </div>
                <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <ArrowRight className="w-4 h-4 text-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumBrandsGrid;
