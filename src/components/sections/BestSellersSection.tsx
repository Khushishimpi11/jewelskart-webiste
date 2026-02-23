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

  // Calculate card width based on container width to show exactly 4
  const cardWidth = 'calc((100% - 72px) / 4)'; // 100% minus 3 gaps of 24px, divided by 4

  return (
    <section className="py-16 lg:py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center bg-primary text-white px-4 py-1 font-body text-sm tracking-luxury uppercase rounded-full">
            <img src={exploreIcon} alt="Explore" className="w-6 h-6 mr-2" />
            Most Loved
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-2">
            Best Sellers
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto mb-3">
            Discover our most cherished pieces, beloved by jewellery enthusiasts around the world.
          </p>
          <div className="section-divider" />
        </motion.div>

        {/* Products Slider - Show exactly 4 products */}
        <div className="relative overflow-hidden">
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
                style={{ width: cardWidth }}
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
          className="flex items-center justify-center gap-6 mt-10"
        >
          <button
            onClick={slideLeft}
            disabled={currentIndex === 0}
            className="w-12 h-12 border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <Link
            to="/shop"
            className="text-primary font-body text-sm tracking-wider uppercase hover:text-primary/80 transition-colors"
          >
            View All Products
          </Link>
          
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