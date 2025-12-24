import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroSlides } from '@/data/products';
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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury Jewellery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-32">
          {/* Text Content */}
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

          {/* Product Images Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <AnimatePresence mode="wait">
              {heroSlides.map(
                (slide, index) =>
                  index === currentSlide && (
                    <motion.div
                      key={`main-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="col-span-2 aspect-square overflow-hidden rounded-sm border border-border/30"
                    >
                      <img
                        src={slide.image}
                        alt="Featured Product"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
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
