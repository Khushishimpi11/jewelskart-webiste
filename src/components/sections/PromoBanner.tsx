import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Diamond, Crown } from 'lucide-react';

export const PromoBanner = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-r from-background via-card to-background">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        {/* Gold accent lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Decorative Icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Diamond className="w-5 h-5 text-primary" />
            <Crown className="w-6 h-6 text-primary" />
            <Diamond className="w-5 h-5 text-primary" />
          </div>

          <span className="inline-block text-primary font-body text-sm tracking-luxury uppercase mb-4">
            Exclusive Offer
          </span>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            Winter Collection
            <span className="block text-gradient-gold mt-2">Up to 30% Off</span>
          </h2>
          
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Discover timeless elegance with our exclusive winter collection. 
            Each piece crafted with precision and passion.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link to="/shop" className="btn-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Shop the Sale
            </Link>
          </div>

          {/* Decorative Border */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-primary/30" />
            <Diamond className="w-4 h-4 text-primary/50" />
            <div className="w-16 h-px bg-primary/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
