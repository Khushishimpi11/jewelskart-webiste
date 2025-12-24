import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroSlides, products } from '@/data/products';
import heroImage from '@/assets/hero-1.jpg';

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Get floating product images
  const floatingImages = products.slice(0, 4);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image - More Visible */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImage}
            alt="Luxury Jewellery"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-32">
          {/* Text Content - Left Side Dominant */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <motion.span
                  className="inline-block text-primary font-body text-sm tracking-luxury uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Evimeria Collection
                </motion.span>

                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
                  {heroSlides[currentSlide].heading}
                </h1>

                <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
                  {heroSlides[currentSlide].subheading}
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <Link to="/shop" className="btn-gold">
                    {heroSlides[currentSlide].cta}
                  </Link>
                  <Link
                    to="/shop"
                    className="btn-gold-outline"
                  >
                    View All
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="flex items-center gap-3 pt-8">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 transition-all duration-500 ${
                    index === currentSlide
                      ? 'w-12 bg-primary'
                      : 'w-6 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Floating Product Images - Right Side (Smaller, Elegant) */}
          <div className="hidden lg:block relative h-[500px]">
            {/* Main floating image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 z-20"
              >
                <div className="relative w-full h-full rounded-sm overflow-hidden border-2 border-primary/40 shadow-[0_10px_40px_rgba(201,162,77,0.3)]">
                  <img
                    src={heroSlides[currentSlide].image}
                    alt="Featured Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating smaller images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-8 left-0 w-28 h-28 z-10"
            >
              <div className="relative w-full h-full rounded-sm overflow-hidden border border-primary/30 shadow-lg">
                <img
                  src={floatingImages[0]?.image}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute top-4 right-8 w-32 h-32 z-10"
            >
              <div className="relative w-full h-full rounded-sm overflow-hidden border border-primary/30 shadow-lg">
                <img
                  src={floatingImages[1]?.image}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-16 left-8 w-24 h-24 z-10"
            >
              <div className="relative w-full h-full rounded-sm overflow-hidden border border-primary/30 shadow-lg">
                <img
                  src={floatingImages[2]?.image}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-8 right-4 w-28 h-28 z-10"
            >
              <div className="relative w-full h-full rounded-sm overflow-hidden border border-primary/30 shadow-lg">
                <img
                  src={floatingImages[3]?.image}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
