import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { brands } from '@/data/brands';

const PremiumBrandsGrid = () => {
  const navigate = useNavigate();
  const featured = brands[0]; // Jewelskart
  const gridBrands = brands.slice(1, 5); // 4 smaller cards

  const BrandCard = ({ brand, className = '', large = false }: { brand: typeof brands[0]; className?: string; large?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate(`/brand/${brand.slug}`)}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group ${className}`}
    >
      <img
        src={brand.image}
        alt={brand.name}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <h3 className={`text-white font-serif font-bold ${large ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
          {brand.name}
        </h3>
        <p className="text-white/70 text-xs md:text-sm mt-1">{brand.tagline}</p>
      </div>

      {/* Arrow button */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
        <ArrowRight className="w-5 h-5 text-foreground" />
      </div>
    </motion.div>
  );

  return (
    <section className="py-10 md:py-16 px-4 md:px-8 lg:px-16 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8">
          Premium Brands
        </h2>

        {/* Mobile: stack vertically, Desktop: 2-col with featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Left: Featured large card */}
          <BrandCard
            brand={featured}
            large
            className="aspect-[3/4] md:row-span-2 md:aspect-auto md:min-h-[480px]"
          />

          {/* Right: 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {gridBrands.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                className="aspect-square md:aspect-auto md:min-h-[230px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumBrandsGrid;
