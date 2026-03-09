import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brands } from '@/data/brands';
import exploreIcon from '../../assets/logoicon.png';

const PremiumBrandsGrid = () => {
  const navigate = useNavigate();
  const featured = brands[0]; // Jewelskart
  const gridBrands = brands.slice(1, 5); // 4 smaller cards

  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="inline-flex items-center bg-primary text-white px-3 sm:px-4 py-1 font-body text-xs sm:text-sm tracking-luxury uppercase rounded-full">
            <img src={exploreIcon} alt="Explore" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Luxury Collection
          </span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-foreground mt-3 sm:mt-4 mb-2">
            Premium Brands
          </h2>
          <p className="text-foreground/60 text-sm sm:text-lg max-w-2xl mx-auto mb-3">
            Explore our curated selection of the world's most prestigious jewellery brands, 
            each offering exceptional craftsmanship and timeless elegance.
          </p>
          <div className="section-divider" />
        </motion.div>

        {/* Brands Grid - Mobile: stack, Desktop: 2-col */}
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
              <h3 className="text-white font-display text-2xl md:text-4xl font-bold">{featured.name}</h3>
              <p className="text-white/70 text-m mt-1">{featured.tagline}</p>
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
                  <h3 className="text-white font-display text-base md:text-2xl font-bold">{brand.name}</h3>
                  <p className="text-white/60 text-m mt-0.5">{brand.tagline}</p>
                </div>
                <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <ArrowRight className="w-4 h-4 text-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Brands */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mt-8 sm:mt-10"
        >
          <Link
            to="/shop?brand=all"
            className="text-primary font-body text-xs sm:text-sm tracking-wider uppercase hover:text-primary/80 transition-colors min-h-[44px] inline-flex items-center"
          >
            View All Brands
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
};

export default PremiumBrandsGrid;