import { motion } from 'framer-motion';
import { brands } from '@/data/brands';
import exploreIcon from '../../assets/logoicon.png';

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-flex items-center bg-primary text-white px-3 sm:px-4 py-1 font-body text-xs sm:text-sm tracking-luxury uppercase rounded-full">
            <img src={exploreIcon} alt="Trust" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Trusted Partners
          </span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mt-3 sm:mt-4 leading-tight">
            Jewelskart – Trusted by
            <br />
           <span className="bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">
  Premium Jewellery Brands
</span>
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
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-border/30 group-hover:border-accent/50 transition-all duration-500 shadow-md group-hover:shadow-xl group-hover:shadow-accent/20">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all duration-500" />
              </div>

              {/* Logo - OPACITY HATAYI, AB CLEAR DIKHEGA */}
              {brand.logo && (
                <div className="mt-2">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandTrustSection;