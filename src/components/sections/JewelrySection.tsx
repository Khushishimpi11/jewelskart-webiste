import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

import ringHand from "@/assets/mring.png";
import ringBox from "@/assets/mock1.png";
import model from "@/assets/ppp.png";
import exploreIcon from "../../assets/logoicon.png";

interface JewelrySectionProps {
  products?: any[];
  isLoading?: boolean;
}

export const JewelrySection = ({ products: propProducts, isLoading = false }: JewelrySectionProps) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addItem);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const bottomProducts = propProducts || [];

  // Auto-slide effect - For both mobile and desktop
  useEffect(() => {
    if (bottomProducts.length <= 2 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % bottomProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bottomProducts.length, isPaused]);

  // Get current visible products (show 2 at a time)
  const getVisibleProducts = () => {
    if (bottomProducts.length <= 2) return bottomProducts;
    const visible = [];
    for (let i = 0; i < 2; i++) {
      const index = (currentIndex + i) % bottomProducts.length;
      visible.push(bottomProducts[index]);
    }
    return visible;
  };

  const visibleProducts = getVisibleProducts();

  // Animation variants
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

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    toast.success(`${product.name} added to wishlist!`);
  };

  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Quick view: ${product.name}`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <section className="w-full py-16 text-center text-muted-foreground bg-[#FBF5F6]">
        <div className="animate-pulse">Loading jewelry products...</div>
      </section>
    );
  }

  if (bottomProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FBF5F6] py-8 md:py-16 px-4 md:px-6 overflow-hidden">
      {/* --- TOP SECTION --- */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-center mb-8 md:mb-10 lg:mb-12">

        {/* Left Image (Arched) - Tablet aur Desktop same */}
        <div className="md:col-span-5 flex justify-center md:justify-start order-1 md:order-none">
          <div className="relative w-full max-w-[420px] md:max-w-[480px] lg:max-w-[580px] aspect-[10/13] group">
            <div className="w-full h-full rounded-t-full overflow-hidden relative">
              <img src={ringHand} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Ring Hand" />
              <div className="absolute bottom-4 md:bottom-6 lg:bottom-10 left-3 md:left-4 lg:left-10 right-3 md:right-4 lg:right-10 h-[50%] border-l border-r border-b border-white/60 pointer-events-none z-20"></div>
            </div>

            <svg viewBox="0 0 580 300" className="absolute top-[15px] md:top-[20px] left-0 w-full overflow-visible pointer-events-none z-30">
              <defs><path id="archPathTop" d="M 40,280 A 250,250 0 0 1 540,280" /></defs>
              <text fill="white" letterSpacing="1">
                <textPath
                  href="#archPathTop"
                  startOffset="50%"
                  textAnchor="middle"
                  fontSize="18"
                  className="font-serif italic text-[18px] md:text-[24px] lg:text-[36px]"
                >
                  Where Beauty And Love Intertwine Perfectly
                </textPath>
              </text>
            </svg>

            <button
              onClick={() => navigate("/shop")}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] 
                rounded-full bg-[#FBF5F6] backdrop-blur-md 
                flex items-center justify-center 
                transition-all duration-300 group-hover:bg-primary 
                border border-white shadow-2xl cursor-pointer z-40"
            >
              <span className="text-[8px] md:text-[10px] lg:text-[11px] font-bold tracking-[1.5px] md:tracking-[2px] lg:tracking-[3px] text-center leading-tight text-gray-900 group-hover:text-white uppercase">
                SHOP<br />NOW
              </span>
            </button>
          </div>
        </div>

        {/* Center Content - Tablet aur Desktop same */}
        <div className="md:col-span-4 text-center md:text-left z-10 md:pl-4 lg:pl-8 order-2 md:order-none">
          <div className="mb-3 md:mb-4 lg:mb-6 flex justify-center md:justify-start">
            <span className="inline-flex items-center bg-primary text-white px-3 py-1 md:px-4 md:py-1.5 font-body text-[8px] md:text-[10px] lg:text-xs tracking-widest uppercase rounded-full shadow-sm">
              <img
                src={exploreIcon}
                alt="Explore"
                className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 mr-1.5 md:mr-2 object-contain"
              />
              Jewelskart Collection
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-serif leading-[1.1] md:leading-[1.05] mb-3 md:mb-4 lg:mb-8 text-gray-900">
            Unleash Your Style <br className="hidden sm:block" /> With Our Unique <br className="hidden sm:block" />Masterpieces
          </h2>
          <p className="text-gray-500 mb-4 md:mb-6 lg:mb-10 text-xs md:text-sm lg:text-lg leading-relaxed max-w-md mx-auto md:mx-0 px-3 md:px-0">
            Explore our premium jewellery collection featuring elegant rings, pendants, earrings and bracelets crafted to shine with every moment.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-primary text-white px-6 md:px-8 py-2.5 md:py-3 
              flex items-center gap-2 md:gap-2.5 
              mx-auto md:mx-0 justify-center
              hover:bg-black transition-all uppercase 
              text-[14px] md:text-[16px] tracking-[1.5px] md:tracking-[2px] font-semibold w-fit border border-white"
          >
            Shop Now <span>→</span>
          </button>
        </div>

        {/* Right Image (Floating Ring Box) - Tablet aur Desktop same */}
        <div className="md:col-span-3 flex justify-center md:justify-end relative order-3 md:order-none">
          <div className="relative md:-top-6 lg:-top-12 transition-transform duration-700 hover:scale-105">
            <img src={ringBox} className="w-[200px] md:w-[220px] lg:w-[350px] object-contain drop-shadow-2xl" alt="Ring Box" />
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 items-start relative">

        {/* Products Section - Tablet aur Desktop same */}
        <div
          className="md:col-span-7 order-2 md:order-none w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="w-full">
            <div className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-6 xl:gap-8">
              <AnimatePresence mode="wait" custom={currentIndex}>
                {visibleProducts.map((product, idx) => (
                  <motion.div
                    key={`${product.id}-${currentIndex}-${idx}`}
                    custom={idx === 0 ? 1 : -1}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="h-full w-full"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            {bottomProducts.length > 2 && (
              <div className="flex gap-1.5 md:gap-2 lg:gap-3 mt-4 md:mt-6 lg:mt-10 xl:mt-12 justify-center">
                {Array.from({ length: Math.ceil(bottomProducts.length / 2) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx * 2);
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 3000);
                    }}
                    className={`h-[1.5px] transition-all duration-500 ${Math.floor(currentIndex / 2) === idx
                      ? "w-6 md:w-10 lg:w-16 bg-primary"
                      : "w-3 md:w-5 lg:w-8 bg-zinc-300"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Model Image - Tablet aur Desktop same (Desktop jaisa) */}
        <div className="md:col-span-5 flex justify-center md:justify-end  lg:-mt-32 z-20 order-1 md:order-none">
          <div className="relative w-full max-w-[350px] md:max-w-[420px] lg:max-w-[500px] aspect-[10/13] group">
            <div className="w-full h-full rounded-t-full overflow-hidden relative shadow-md">
              <img src={model} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Model" />
              <div className="absolute bottom-4 md:bottom-6 lg:bottom-10 left-3 md:left-4 lg:left-8 right-3 md:right-4 lg:right-8 h-[50%] border-l border-r border-b border-white/60 pointer-events-none z-20"></div>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[130px] lg:h-[130px] 
                rounded-full bg-[#FBF5F6] backdrop-blur-sm 
                flex items-center justify-center 
                transition-all duration-300 group-hover:bg-primary 
                border border-white shadow-lg cursor-pointer z-40 
                mt-12 md:mt-16 lg:mt-20"
            >
              <span className="text-[8px] md:text-[10px] lg:text-[11px] font-bold tracking-[1.5px] md:tracking-[2px] lg:tracking-[3px] text-center leading-tight text-gray-900 group-hover:text-white uppercase">
                SHOP<br />NOW
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};