import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import exploreIcon from '../../assets/logoicon.png';

export const SpecialProducts = () => {
  const specialProducts = products.filter((p) => p.isSpecial);
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, specialProducts.length - 4);

  const slideLeft = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const slideRight = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-16"
        >
          <span className="inline-flex items-center bg-primary text-white px-4 py-1.5 font-body text-[10px] sm:text-xs tracking-widest uppercase rounded-full shadow-sm">
  <img
    src={exploreIcon}
    alt="Premium Picks"
    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 object-contain"
  />
  Premium Picks
</span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-foreground mt-3 sm:mt-4 mb-2">
            Special Pieces
          </h2>
          <p className="text-foreground/60 text-sm sm:text-lg max-w-2xl mx-auto mb-3">
            Exclusive designs crafted in limited quantities. Each piece is a unique work of art.
          </p>
        </motion.div>

        {/* Mobile Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:hidden">
          {specialProducts.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-wider px-2 py-0.5">
                  EXCLUSIVE
                </span>
              </div>
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
            {specialProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex-shrink-0 relative"
                style={{ width: 'calc((100% - 72px) / 4)' }}
              >
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-primary text-primary-foreground text-xs font-body tracking-wider px-3 py-1">
                    EXCLUSIVE
                  </span>
                </div>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden sm:flex items-center justify-center gap-4 mt-12"
        >
          <button
            onClick={slideLeft}
            disabled={currentIndex === 0}
            className="w-12 h-12 min-h-[44px] min-w-[44px] border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={slideRight}
            disabled={currentIndex === maxIndex}
            className="w-12 h-12 min-h-[44px] min-w-[44px] border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};