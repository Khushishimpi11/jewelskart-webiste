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
    }, 5000); // Increased from 4000 to 5000 for slower transition

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
    <section className="w-full bg-[#ffff] py-16 px-6 md:px-12 overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-8 items-center max-w-[1350px] mx-auto">

        {/* LEFT SECTION - Image with Shop Now Button */}
        <div className="relative w-full flex justify-center lg:justify-start">
          <div
            className="relative w-full max-w-[550px] aspect-[4/5] group cursor-pointer overflow-hidden rounded-t-full shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="w-full h-full relative">
              <img
                src={banner}
                alt="Jewelry Banner"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute bottom-10 left-10 right-10 h-[50%] border-l border-r border-b border-white/60 pointer-events-none z-20"></div>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             w-24 h-24 rounded-full 
             flex flex-col items-center justify-center text-center
             font-serif text-xs tracking-[2.5px] leading-tight
             transition-all duration-500 shadow-xl z-40
             bg-[#FBF5F6]/95 backdrop-blur-md text-black
             hover:bg-primary hover:text-white"
            >
              <span className="mb-1">SHOP</span>
              <span>NOW</span>
            </button>
          </div>
        </div>

        {/* RIGHT SECTION - Content & Product Cards */}
        <div className="flex flex-col lg:pl-4">
          <div className="mb-10 text-center lg:text-left">
            <div className="mb-4 flex justify-center lg:justify-start">
              <span className="inline-flex items-center bg-primary text-white px-4 py-1.5 font-body text-[10px] sm:text-xs tracking-widest uppercase rounded-full shadow-sm">
                <img
                  src={exploreIcon}
                  alt="Explore"
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 object-contain"
                />
                Limited Collection
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 leading-tight">
              Own Something Truly Rare
            </h2>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 gap-6 md:gap-8">
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
            <div className="flex gap-3 mt-12 justify-center lg:justify-start">
              {Array.from({ length: Math.ceil(jewelryProducts.length / 2) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx * 2);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 3000);
                  }}
                  className={`h-[1.5px] transition-all duration-500 ${Math.floor(currentIndex / 2) === idx ? "w-16 bg-primary" : "w-8 bg-zinc-300"
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