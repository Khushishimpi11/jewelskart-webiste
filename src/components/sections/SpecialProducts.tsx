import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

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

  // Calculate card width based on container width to show exactly 4
  const cardWidth = 'calc((100% - 72px) / 4)'; // 100% minus 3 gaps of 24px, divided by 4

  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-body text-sm tracking-luxury uppercase">
            Limited Edition
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-4">
            Special Pieces
          </h2>
          <div className="section-divider" />
          <p className="text-muted-foreground mt-6 max-w-xl mx-auto">
            Exclusive designs crafted in limited quantities. Each piece is a unique work of art.
          </p>
        </motion.div>

        {/* Products Slider - Show exactly 4 products */}
        <div className="relative overflow-hidden">
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
                style={{ width: cardWidth }}
              >
                {/* Special Badge */}
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

        {/* Navigation Arrows at Bottom Center */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          <button
            onClick={slideLeft}
            disabled={currentIndex === 0}
            className="w-12 h-12 border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={slideRight}
            disabled={currentIndex === maxIndex}
            className="w-12 h-12 border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
