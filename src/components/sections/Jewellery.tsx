"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import banner from "../../assets/kk.png";
import exploreIcon from '../../assets/logoicon.png';

interface JewelleryProps {
  products?: any[];
  isLoading?: boolean;
}

export default function Jewellery({ products: propProducts, isLoading = false }: JewelleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const jewelryProducts = propProducts || [];

  useEffect(() => {
    if (jewelryProducts.length <= 2 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % jewelryProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [jewelryProducts.length, isPaused]);

  if (isLoading) {
    return (
      <section className="w-full py-16 text-center text-muted-foreground bg-white">
        <div className="animate-pulse">Loading limited collection products...</div>
      </section>
    );
  }

  if (jewelryProducts.length === 0) {
    return null;
  }

  const visibleProducts = jewelryProducts.length === 1
    ? [jewelryProducts[0]]
    : [
      jewelryProducts[currentIndex % jewelryProducts.length],
      jewelryProducts[(currentIndex + 1) % jewelryProducts.length]
    ];

  // Animation variants for smoother transitions
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    })
  };

  return (
    <section className="w-full bg-[#ffff] py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-8 items-center max-w-[1350px] mx-auto">

        {/* LEFT SECTION - Image with Shop Now Button */}
        <div className="relative w-full flex justify-center lg:justify-start order-1 lg:order-none">
          <div
            className="relative w-full max-w-[380px] sm:max-w-[450px] lg:max-w-[550px] aspect-[4/5] group cursor-pointer overflow-hidden rounded-t-full shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="w-full h-full relative">
              <img
                src={banner}
                alt="Jewelry Banner"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute bottom-4 sm:bottom-6 lg:bottom-10 left-4 sm:left-6 lg:left-10 right-4 sm:right-6 lg:right-10 h-[50%] border-l border-r border-b border-white/60 pointer-events-none z-20"></div>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full 
                flex flex-col items-center justify-center text-center
                font-serif text-[8px] sm:text-[10px] lg:text-xs tracking-[1.5px] sm:tracking-[2px] lg:tracking-[2.5px] leading-tight
                transition-all duration-500 shadow-xl z-40
                bg-[#FBF5F6]/95 backdrop-blur-md text-black
                hover:bg-primary hover:text-white"
            >
              <span className="mb-0.5 sm:mb-1">SHOP</span>
              <span>NOW</span>
            </button>
          </div>
        </div>

        {/* RIGHT SECTION - Content & Product Cards */}
        <div className="flex flex-col lg:pl-4 order-2 lg:order-none">
          <div className="mb-4 sm:mb-6 lg:mb-10 text-center lg:text-left">
            <div className="mb-2 sm:mb-3 lg:mb-4 flex justify-center lg:justify-start">
              <span className="inline-flex items-center bg-primary text-white px-3 py-1 sm:px-4 sm:py-1.5 font-body text-[8px] sm:text-[10px] lg:text-xs tracking-widest uppercase rounded-full shadow-sm">
                <img
                  src={exploreIcon}
                  alt="Explore"
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1.5 sm:mr-2 object-contain"
                />
                Limited Collection
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-zinc-900 leading-tight">
              Own Something Truly Rare
            </h2>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <AnimatePresence mode="wait" custom={currentIndex}>
              {visibleProducts.map((product, idx) => (
                <motion.div
                  key={`${product.id}-${currentIndex}-${idx}`}
                  custom={idx === 0 ? 1 : -1}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* PROGRESS BAR */}
          {jewelryProducts.length > 2 && (
            <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8 lg:mt-12 justify-center lg:justify-start">
              {Array.from({ length: Math.ceil(jewelryProducts.length / 2) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx * 2);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 3000);
                  }}
                  className={`h-[1.5px] transition-all duration-500 ${Math.floor(currentIndex / 2) === idx
                      ? "w-8 sm:w-10 lg:w-16 bg-primary"
                      : "w-4 sm:w-5 lg:w-8 bg-zinc-300"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}