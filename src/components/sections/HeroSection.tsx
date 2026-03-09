import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage1 from "@/assets/hero1.jpg";
import heroImage2 from "@/assets/hero2.jpg";
import heroImage3 from "@/assets/hero3.jpg";

import square1 from "@/assets/ring.jpeg";
import square2 from "@/assets/ring.jpeg";
import square3 from "@/assets/ring.jpeg";

import exploreIcon from '../../assets/logoicon.png';

// Combine image and text data
const slides = [
  {
    image: heroImage1,
    tag: "Timeless Beauty",
    title: "Elegance In Every <br /> Chain, Beauty <br /> Unchained",
    description: "Habitasse maximus massa primis posuere nec quam imperdiet. Ac ad maximus scelerisque egestas blandit iaculis.",
    floatingImages: [square1, square2, square3]
  },
  {
    image: heroImage2,
    tag: "Diamond Excellence",
    title: "Celebrate Every Moment With <br/>Sparkle",
    description: "Experience the finest craftsmanship in every piece, designed to make you shine at life's most precious moments.",
    floatingImages: [square2, square3, square1]
  },
  {
    image: heroImage3,
    tag: "Modern Luxury",
    title: "Contemporary <br /> Designs, Eternal <br /> Elegance",
    description: "Discover our latest collection that blends modern aesthetics with timeless sophistication.",
    floatingImages: [square3, square1, square2]
  }
];

const floatingImages = [square1, square2, square3];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  const currentData = slides[currentSlide];

  return (
    <section className="relative min-h-[105vh] sm:min-h-[115vh] bg-primary overflow-hidden flex items-center pt-20 sm:pt-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16">

          {/* LEFT BIG IMAGE */}
          <div className="relative flex justify-center lg:justify-start lg:-ml-6 order-1 lg:order-1 ">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-[260px] h-[340px] xs:w-[300px] xs:h-[400px] sm:w-[380px] sm:h-[490px] md:w-[420px] md:h-[540px] lg:w-[520px] lg:h-[650px] rounded-[200px] sm:rounded-[250px] overflow-hidden shadow-2xl "
              >
                <img
                  src={currentData.image}
                  alt="Luxury Jewellery"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT CONTENT */}
          <div className="relative space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left lg:-ml-20 lg:mt-10 order-2 lg:order-2">

            {/* Small Tag with animation */}
            <AnimatePresence mode="wait">
              <motion.span
                key={`tag-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center bg-primary text-white/80 px-3 sm:px-4 py-1 font-body text-xs sm:text-sm tracking-luxury uppercase rounded-full"
              >
                <img src={exploreIcon} alt="Luxury" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {currentData.tag}
              </motion.span>
            </AnimatePresence>

            {/* Heading with animation */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-white"
                dangerouslySetInnerHTML={{ __html: currentData.title }}
              />
            </AnimatePresence>

            {/* Description with animation */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-white/80 max-w-md leading-relaxed text-sm sm:text-base mx-auto lg:mx-0"
              >
                {currentData.description}
              </motion.p>
            </AnimatePresence>

            {/* Button (static) */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] bg-white text-primary uppercase tracking-wider text-xs sm:text-sm transition duration-300"
            >
              Know More →
            </Link>

            {/* Navigation */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 sm:pt-8">
              <button 
                onClick={prevSlide} 
                className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <span className="text-base sm:text-lg tracking-widest text-white">
                {currentSlide + 1}/{slides.length}
              </span>

              <button 
                onClick={nextSlide} 
                className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* FLOATING IMAGES - Desktop only with slide-specific images */}
            <div className="hidden lg:block">
              <motion.div
                key={`float1-${currentSlide}`}
                className="absolute -top-10 right-0"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="p-2 bg-transparent border border-white rounded-md shadow-xl">
                  <img 
                    src={currentData.floatingImages[0]} 
                    className="w-24 h-24 object-cover rounded-sm" 
                    alt="Floating Product" 
                  />
                </div>
              </motion.div>

              <motion.div
                key={`float2-${currentSlide}`}
                className="absolute top-40 -right-12"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <div className="p-2 border border-white rounded-md shadow-xl bg-transparent">
                  <img 
                    src={currentData.floatingImages[1]} 
                    className="w-28 h-28 object-cover rounded-sm" 
                    alt="Floating Product" 
                  />
                </div>
              </motion.div>

              <motion.div
                key={`float3-${currentSlide}`}
                className="absolute bottom-0 right-10"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <div className="p-2 border border-white rounded-md shadow-xl">
                  <img 
                    src={currentData.floatingImages[2]} 
                    className="w-24 h-24 object-cover rounded-sm" 
                    alt="Floating Product" 
                  />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};