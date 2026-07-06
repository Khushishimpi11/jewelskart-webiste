import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import exploreIcon from '../../assets/logoicon.png';

interface SpecialProductsProps {
  products?: any[];
  isLoading?: boolean;
}

const VISIBLE_DESKTOP = 4;
const VISIBLE_MOBILE = 2;

export const SpecialProducts = ({ products: propProducts, isLoading = false }: SpecialProductsProps) => {
  const specialProducts = propProducts || [];

  const needsSliderDesktop = specialProducts.length > VISIBLE_DESKTOP;
  const needsSliderMobile  = specialProducts.length > VISIBLE_MOBILE;
  const needsSlider = needsSliderDesktop || needsSliderMobile;

  const displayItems = needsSlider
    ? [...specialProducts, ...specialProducts.slice(0, Math.max(VISIBLE_DESKTOP, VISIBLE_MOBILE))]
    : specialProducts;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);
  const isSnapping = useRef(false);

  useEffect(() => {
    if (!needsSlider || isPaused) return;
    const interval = setInterval(() => {
      if (isSnapping.current) return;
      setEnableTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [needsSlider, isPaused]);

  useEffect(() => {
    if (!needsSlider) return;
    if (currentIndex >= specialProducts.length) {
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
  }, [currentIndex, specialProducts.length, needsSlider]);

  const maxIndexDesktop = Math.max(0, specialProducts.length - VISIBLE_DESKTOP);

  const slideLeft = () => {
    if (isSnapping.current) return;
    setEnableTransition(true);
    setCurrentIndex((prev) => (prev === 0 ? maxIndexDesktop : prev - 1));
  };

  const slideRight = () => {
    if (isSnapping.current) return;
    setEnableTransition(true);
    setCurrentIndex((prev) => (prev >= maxIndexDesktop ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <section className="py-10 sm:py-16 bg-white text-center text-muted-foreground">
        <div className="animate-pulse">Loading special pieces...</div>
      </section>
    );
  }

  if (specialProducts.length === 0) {
    return null;
  }

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

        {/* Mobile Slider – 2 cards visible */}
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
                className="flex-shrink-0 relative"
                style={{ width: 'calc((100% - 12px) / 2)' }}
              >
                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-wider px-2 py-0.5">
                    EXCLUSIVE
                  </span>
                </div>
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Slider */}
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
                className="flex-shrink-0 relative"
                style={{ width: 'calc((100% - 72px) / 4)' }}
              >
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-primary text-primary-foreground text-xs font-body tracking-wider px-3 py-1">
                    EXCLUSIVE
                  </span>
                </div>
                <ProductCard product={product} />
              </div>
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
            className="w-12 h-12 min-h-[44px] min-w-[44px] border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={slideRight}
            className="w-12 h-12 min-h-[44px] min-w-[44px] border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};