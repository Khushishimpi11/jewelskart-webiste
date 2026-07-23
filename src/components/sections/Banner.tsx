import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ringBg from "../../assets/ring.png";
import braceletBg from "../../assets/bracelet.png";
import earringBg from "../../assets/earring.png";
import pendantBg from "../../assets/pendant.png";
import necklaceBg from "../../assets/necklace.png";
import exploreIcon from "../../assets/logoicon.png";

// Category data
const categories = [
  {
    id: "pendants",
    title: "PENDANTS",
    image: pendantBg,
    category: "pendants",
    description: "Elegant pendant necklaces"
  },
  {
    id: "rings",
    title: "RINGS",
    image: ringBg,
    category: "rings",
    description: "Beautiful diamond rings"
  },
  {
    id: "earrings",
    title: "EARRINGS",
    image: earringBg,
    category: "earrings",
    description: "Stunning earrings"
  },
  {
    id: "bracelets",
    title: "BRACELETS",
    image: braceletBg,
    category: "bracelets",
    description: "Charming bracelets"
  },
  {
    id: "necklaces",
    title: "NECKLACES",
    image: necklaceBg,
    category: "necklaces",
    description: "Luxurious necklaces"
  },
];

const VISIBLE_DESKTOP = 4;
const VISIBLE_MOBILE = 2;

const Banner: React.FC = () => {
  const navigate = useNavigate();

  const needsSliderDesktop = categories.length > VISIBLE_DESKTOP;
  const needsSliderMobile = categories.length > VISIBLE_MOBILE;
  const needsSlider = needsSliderDesktop || needsSliderMobile;

  // Clone enough items for both mobile and desktop loops
  const displayItems = needsSlider
    ? [...categories, ...categories.slice(0, Math.max(VISIBLE_DESKTOP, VISIBLE_MOBILE))]
    : categories;

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
    }, 4000);
    return () => clearInterval(interval);
  }, [needsSlider, isPaused]);

  // Infinite-loop snap-back
  useEffect(() => {
    if (!needsSlider) return;
    if (currentIndex >= categories.length) {
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
  }, [currentIndex, categories.length, needsSlider]);

  const maxIndexDesktop = Math.max(0, categories.length - VISIBLE_DESKTOP);
  const maxIndexMobile = Math.max(0, categories.length - VISIBLE_MOBILE);

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

  const handleShopNavigation = (category: string) => {
    navigate(`/shop?brand=jewelskart&category=${category.toLowerCase()}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="w-full py-10 sm:py-16 lg:py-24 bg-[#FBF5F6]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="mb-4 flex justify-center lg:justify-center">
            <span className="inline-flex items-center bg-primary text-white px-4 py-1.5 font-body text-[10px] sm:text-xs tracking-widest uppercase rounded-full shadow-sm">
              <img
                src={exploreIcon}
                alt="Explore"
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 object-contain"
              />
              Top Categories
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-foreground mt-3 sm:mt-4 mb-2">
            Shop by Category
          </h2>
          <p className="text-foreground/60 text-sm sm:text-lg max-w-2xl mx-auto mb-3">
            Explore our exquisite collections of diamond jewelry, crafted for every special moment.
          </p>
          <div className="section-divider" />
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
            {displayItems.map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="flex-shrink-0 cursor-pointer relative overflow-hidden rounded-2xl shadow-xl aspect-[3/2] group"
                style={{ width: 'calc((100% - 12px) / 2)' }}
                onClick={() => handleShopNavigation(category.category)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                {/* Text content - no overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                  <h3 className="font-serif font-bold text-lg md:text-xl tracking-wide leading-tight mb-2 drop-shadow-lg">
                    {category.title}
                  </h3>
                  <button
                    className="border-b border-white pb-0.5 text-xs font-medium uppercase tracking-widest hover:opacity-80 transition-opacity drop-shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShopNavigation(category.category);
                    }}
                  >
                    shop {category.category}
                  </button>
                </div>
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
            {displayItems.map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="flex-shrink-0 cursor-pointer relative overflow-hidden rounded-2xl shadow-xl aspect-[3/2] group"
                style={{ width: 'calc((100% - 72px) / 4)' }}
                onClick={() => handleShopNavigation(category.category)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                {/* Text content - no overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                  <h3 className="font-serif font-bold text-lg md:text-xl tracking-wide leading-tight mb-2 drop-shadow-lg">
                    {category.title}
                  </h3>
                  <button
                    className="border-b border-white pb-0.5 text-xs font-medium uppercase tracking-widest hover:opacity-80 transition-opacity drop-shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShopNavigation(category.category);
                    }}
                  >
                    shop {category.category}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
        >
          <button
            onClick={slideLeft}
            className="flex w-10 h-10 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] border border-primary/50 items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-full"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="text-primary font-body text-xs sm:text-sm tracking-wider uppercase hover:text-primary/80 transition-colors min-h-[44px] inline-flex items-center"
          >
            View All Categories
          </button>

          <button
            onClick={slideRight}
            className="flex w-10 h-10 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] border border-primary/50 items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-full"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;