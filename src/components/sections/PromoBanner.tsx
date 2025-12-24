import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import promoBanner from '@/assets/promo-banner.jpg';

export const PromoBanner = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={promoBanner}
          alt="Special Offer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="inline-block text-primary font-body text-sm tracking-luxury uppercase mb-4">
            Limited Time Offer
          </span>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Exclusive Winter
            <span className="block text-gradient-gold">Collection</span>
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Enjoy up to 30% off on selected pieces from our exquisite winter collection. Elegance meets affordability.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link to="/shop" className="btn-gold">
              Shop the Sale
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-6 mt-12">
            {[
              { value: '12', label: 'Days' },
              { value: '08', label: 'Hours' },
              { value: '45', label: 'Mins' },
              { value: '30', label: 'Secs' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 border border-primary/30 flex items-center justify-center mb-2">
                  <span className="font-display text-2xl lg:text-3xl text-primary">
                    {item.value}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
