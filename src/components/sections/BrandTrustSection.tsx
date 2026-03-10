import { motion } from 'framer-motion';
import { brands } from '@/data/brands';

const BrandTrustSection = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, hsl(46, 67%, 52%), transparent 70%)' }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.3em] uppercase mb-4">
            Trusted Partners
          </p>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
            Jewelskart – Trusted by
            <br />
            <span className="text-gradient-gold">Premium Jewellery Brands</span>
          </h2>
          <div className="section-divider-gold mt-6" />
        </motion.div>

        {/* Brand logos grid */}
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 lg:gap-20">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
              className="group relative flex flex-col items-center"
            >
              {/* Glow behind on hover */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                style={{ background: 'hsl(46, 67%, 52%, 0.15)' }}
              />
              
              {/* Brand image circle */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-border/30 group-hover:border-accent/50 transition-all duration-500 shadow-md group-hover:shadow-xl">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all duration-500" />
              </div>

              {/* Brand name */}
              <p className="mt-4 font-display text-sm sm:text-base lg:text-lg text-foreground/80 group-hover:text-foreground tracking-wider transition-colors duration-300">
                {brand.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandTrustSection;
