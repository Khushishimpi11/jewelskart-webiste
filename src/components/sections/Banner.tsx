import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ringBg from "../../assets/c.png";       // background for neckwear
import braceletBg from "../../assets/mm.png"; // background for rings
import necklaceBg from "../../assets/e.png"; // background for earrings
import chain from "../../assets/bracelet.jpeg";
import exploreIcon from "../../assets/logoicon.png";

const Banner: React.FC = () => {
  const navigate = useNavigate();

  const handleShopNavigation = (category: string) => {
    // Navigate to shop page with category filter
    navigate(`/shop?brand=jewelskart&category=${category.toLowerCase()}`);
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  return (
    <section className="w-full py-10 sm:py-16 lg:py-24 bg-[#FBF5F6]">
      <div className="container mx-auto px-4">
        {/* Section Header - Top Categories */}
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

        {/* Heading row - four categories side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* First column - NECKWEAR */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl shadow-xl aspect-[3/2] group cursor-pointer"
            onClick={() => handleShopNavigation('neckwear')}
          >
            {/* background image - neckwear specific */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${ringBg})` }}
            />
            
            {/* content - positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
              <h3 className="font-serif font-bold text-lg md:text-xl tracking-wide leading-tight mb-2">
                PENDANTS
              </h3>
              
              {/* Shop button */}
              <button 
                className="border-b border-white pb-0.5 text-xs font-medium uppercase tracking-widest hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShopNavigation('pendants');
                }}
              >
                shop pendants
              </button>
            </div>
          </motion.div>

          {/* Second column - RINGS */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl shadow-xl aspect-[3/2] group cursor-pointer"
            onClick={() => handleShopNavigation('rings')}
          >
            {/* background image - rings specific */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${braceletBg})` }}
            />
            
            {/* content - positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
              <h3 className="font-serif font-bold text-lg md:text-xl tracking-wide mb-2">
                RINGS
              </h3>
              
              {/* Shop button */}
              <button 
                className="border-b border-white pb-0.5 text-xs font-medium uppercase tracking-widest hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShopNavigation('rings');
                }}
              >
                shop rings
              </button>
            </div>
          </motion.div>

         

          {/* Fourth column - EARRINGS */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-2xl shadow-xl aspect-[3/2] group cursor-pointer"
            onClick={() => handleShopNavigation('earrings')}
          >
            {/* background image - earrings specific */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${necklaceBg})` }}
            />
            
            {/* content - positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
              <h3 className="font-serif font-bold text-lg md:text-xl tracking-wide mb-2">
                EARRINGS
              </h3>
              
              {/* Shop button */}
              <button 
                className="border-b border-white pb-0.5 text-xs font-medium uppercase tracking-widest hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShopNavigation('earrings');
                }}
              >
                shop earrings
              </button>
            </div>
          </motion.div>
           {/* Third column - BRACELETS */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl shadow-xl aspect-[3/2] group cursor-pointer"
            onClick={() => handleShopNavigation('bracelets')}
          >
            {/* background image - bracelets specific */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${chain})` }}
            />
            
            {/* content - positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
              <h3 className="font-serif font-bold text-lg md:text-xl tracking-wide mb-2">
                BRACELETS
              </h3>
              
              {/* Shop button */}
              <button 
                className="border-b border-white pb-0.5 text-xs font-medium uppercase tracking-widest hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShopNavigation('bracelets');
                }}
              >
                shop bracelets
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;