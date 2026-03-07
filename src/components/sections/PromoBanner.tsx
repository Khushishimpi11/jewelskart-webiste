import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import promoBanner from '../../assets/promo-banner.png';
import exploreIcon from '../../assets/logoicon.png';

export const PromoBanner = () => {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={promoBanner}
          alt="Winter Collection"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="inline-flex items-center bg-primary text-white px-3 sm:px-4 py-1 font-body text-xs sm:text-sm tracking-luxury uppercase rounded-full">
            <img src={exploreIcon} alt="Explore" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Exclusive Offer
          </span>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white mt-3 sm:mt-4 leading-tight">
            Winter Collection
          </h2>
          
          <p className="text-white/80 text-sm sm:text-lg mb-6 sm:mb-8 max-w-lg mx-auto">
            Up to 30% off on select pieces. Discover timeless elegance.
          </p>
          
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2 min-h-[44px]">
            <Sparkles className="w-4 h-4" />
            Shop the Sale
          </Link>
        </motion.div>
      </div>
    </section>
  );
};