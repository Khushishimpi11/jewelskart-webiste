import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import promoBanner from '@/assets/promo-banner.jpg';

export const PromoBanner = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={promoBanner}
          alt="Winter Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="inline-block text-primary font-body text-sm tracking-luxury uppercase mb-4">
            Exclusive Offer
          </span>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            Winter Collection
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Up to 30% off on select pieces. Discover timeless elegance.
          </p>
          
          <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Shop the Sale
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
