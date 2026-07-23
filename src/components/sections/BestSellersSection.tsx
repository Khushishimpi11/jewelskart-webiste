import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import exploreIcon from '../../assets/logoicon.png';

interface BestSellersSectionProps {
  products?: any[];
  isLoading?: boolean;
}

const VISIBLE_DESKTOP = 4;
const VISIBLE_MOBILE = 2;

export const BestSellersSection = ({ products: propProducts, isLoading = false }: BestSellersSectionProps) => {
  const bestSellers = propProducts || [];

  // Desktop: slider when > 4. Mobile: slider when > 2.
  const needsSliderDesktop = bestSellers.length > VISIBLE_DESKTOP;
  const needsSliderMobile = bestSellers.length > VISIBLE_MOBILE;
  const needsSlider = needsSliderDesktop || needsSliderMobile;

  // Clone enough items for both mobile (2-visible) and desktop (4-visible) loops
  const displayItems = needsSlider
    ? [...bestSellers, ...bestSellers.slice(0, Math.max(VISIBLE_DESKTOP, VISIBLE_MOBILE))]
    : bestSellers;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);
  const isSnapping = useRef(false);

  // Auto-slide
  useEffect(() => {
    if (!needsSlider || isPaused) return;
    const interval = setInterval(() => {
      if (isSnapping.current) return;
      setEnableTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [needsSlider, isPaused]);

  // Infinite-loop snap-back
  useEffect(() => {
    if (!needsSlider) return;
    if (currentIndex >= bestSellers.length) {
      isSnapping.current = true;
      const snapTimer = setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(0);
        setTimeout(() => {
          setEnableTransition(true);
          isSnapping.current = false;
        }, 50);
      }, 650);
      return () => clearTimeout(snapTimer);
    }
  }, [currentIndex, bestSellers.length, needsSlider]);

  const maxIndexDesktop = Math.max(0, bestSellers.length - VISIBLE_DESKTOP);
  const maxIndexMobile = Math.max(0, bestSellers.length - VISIBLE_MOBILE);

  const slideLeft = () => {
    if (isSnapping.current) return;
    setEnableTransition(true);
    // Use desktop maxIndex for simplicity; works on both
    setCurrentIndex((prev) => (prev === 0 ? maxIndexDesktop : prev - 1));
  };

  const slideRight = () => {
    if (isSnapping.current) return;
    setEnableTransition(true);
    setCurrentIndex((prev) => (prev >= maxIndexDesktop ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <section className="py-10 sm:py-16 bg-[#FBF5F6] text-center text-muted-foreground">
        <div className="animate-pulse">Loading best sellers...</div>
      </section>
    );
  }

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-[#FBF5F6]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="inline-flex items-center bg-primary text-white px-4 py-1.5 font-body text-[10px] sm:text-xs tracking-widest uppercase rounded-full shadow-sm">
            <img
              src={exploreIcon}
              alt="Explore"
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2 object-contain"
            />
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

        {/* Mobile Slider – 2 cards visible, same infinite-loop as desktop */}
        <div
          className="block sm:hidden relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-3"
            animate={{ x: `calc(-${currentIndex} * (50% + 6px))` }}
            transition={
              enableTransition
                ? { type: 'tween', duration: 0.6, ease: 'easeInOut' }
                : { duration: 0 }
            }
          >
            {displayItems.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0"
                style={{ width: 'calc((100% - 12px) / 2)' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Slider – 4 cards visible */}
        <div
          className="hidden sm:block relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-6"
            animate={{ x: `calc(-${currentIndex} * (25% + 6px))` }}
            transition={
              enableTransition
                ? { type: 'tween', duration: 0.6, ease: 'easeInOut' }
                : { duration: 0 }
            }
          >
            {displayItems.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0"
                style={{ width: 'calc((100% - 72px) / 4)' }}
              >
                <ProductCard product={product} />
              </div>
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
            className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] border border-primary/50 items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
            className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] border border-primary/50 items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};