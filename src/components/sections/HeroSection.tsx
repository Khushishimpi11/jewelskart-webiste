import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import modelLeft1 from "@/assets/hero-model-left.jpg";
import modelRight1 from "@/assets/hero-model-right.jpg";
import modelLeft2 from "@/assets/hero-model-left2.jpg";
import modelRight2 from "@/assets/hero-model-right2.jpg";
import heroImage1 from "@/assets/hero1.jpg";
import heroImage2 from "@/assets/hero2.jpg";

const slides = [
  {
    brand: "JEWELSKART",
    title: "POSTCARDS FROM JAPAN",
    subtitle: "Timeless elegance meets modern craftsmanship",
    modelLeft: modelLeft1,
    modelRight: modelRight1,
    bg: heroImage1,
  },
  {
    brand: "EXCLUSIVE COLLECTION",
    title: "DIAMONDS OF DESIRE",
    subtitle: "Where brilliance meets bold sophistication",
    modelLeft: modelLeft2,
    modelRight: modelRight2,
    bg: heroImage2,
  },
  {
    brand: "HERITAGE SERIES",
    title: "GOLDEN HOUR LUXURY",
    subtitle: "Crafted for those who shine differently",
    modelLeft: modelRight2,
    modelRight: modelLeft1,
    bg: heroImage1,
  },
];

export const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden" style={{ paddingTop: "calc(38px + 64px)" }}>
      <div>
        <div
          className="relative overflow-hidden"
          style={{ height: "clamp(640px, 80vh, 860px)" }}
        >
          {/* Background image layer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${current}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img
                src={slide.bg}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Dark cinematic overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, hsla(332, 87%, 12%, 0.85) 0%, hsla(332, 87%, 12%, 0.6) 30%, hsla(332, 87%, 12%, 0.75) 50%, hsla(332, 87%, 12%, 0.6) 70%, hsla(332, 87%, 12%, 0.85) 100%)",
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Content grid: model-left | text-center | model-right */}
          <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] items-end">
            {/* Left model */}
            <div className="hidden lg:block h-full relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`ml-${current}`}
                  src={slide.modelLeft}
                  alt="Fashion Model"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 0.75, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.7 }}
                  className="absolute bottom-0 left-0 h-[95%] w-auto max-w-none object-cover object-top"
                  style={{ filter: "brightness(0.85)" }}
                />
              </AnimatePresence>
            </div>

            {/* Center text */}
            <div className="flex flex-col items-center justify-center h-full text-center px-6 sm:px-10 py-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${current}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-5 sm:space-y-7"
                >
                  {/* Brand label */}
                  <span
                    className="inline-block font-body text-xs sm:text-sm tracking-[0.35em] uppercase"
                    style={{ color: "hsl(var(--accent))" }}
                  >
                    {slide.brand}
                  </span>

                  {/* Main title */}
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-primary-foreground tracking-wide">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-primary-foreground/70 font-body text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center px-10 py-3.5 rounded-full bg-background text-foreground font-body text-sm tracking-widest uppercase shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Shop Now
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="flex items-center gap-2.5 mt-8">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-7 h-2.5 bg-accent"
                        : "w-2.5 h-2.5 bg-primary-foreground/40 hover:bg-primary-foreground/60"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right model */}
            <div className="hidden lg:block h-full relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`mr-${current}`}
                  src={slide.modelRight}
                  alt="Fashion Model"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 0.75, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.7 }}
                  className="absolute bottom-0 right-0 h-[95%] w-auto max-w-none object-cover object-top"
                  style={{ filter: "brightness(0.85)" }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-background/25 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-background/25 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
