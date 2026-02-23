import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import exploreIcon from '../../assets/logoicon.png';

export const BestSellersSection = () => {
  const bestSellers = products.filter((p) => p.isBestSeller);
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, bestSellers.length - 4);

  const slideLeft = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const slideRight = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-card">
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
            Most Loved
          </span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-foreground mt-3 sm:mt-4 mb-2">
            Best Sellers
          </h2>
          <p className="text-foreground/60 text-sm sm:text-lg max-w-2xl mx-auto mb-3">
            Discover our most cherished pieces, beloved by jewellery enthusiasts around the world.
          </p>
          <div className="section-divider" />
        </motion.div>

        {/* Products - Mobile: grid, Desktop: slider */}
        {/* Mobile Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:hidden">
          {bestSellers.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Desktop Slider */}
        <div className="hidden sm:block relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `calc(-${currentIndex} * (25% + 6px))` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {bestSellers.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0"
                style={{ width: 'calc((100% - 72px) / 4)' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* View All with Arrows */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
        >
          <button
            onClick={slideLeft}
            disabled={currentIndex === 0}
            className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] border border-primary/50 items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <Link
            to="/shop"
            className="text-primary font-body text-xs sm:text-sm tracking-wider uppercase hover:text-primary/80 transition-colors min-h-[44px] inline-flex items-center"
          >
            View All Products
          </Link>
          
          <button
            onClick={slideRight}
            disabled={currentIndex === maxIndex}
            className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] border border-primary/50 items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};