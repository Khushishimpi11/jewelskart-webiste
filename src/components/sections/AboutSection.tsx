import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import aboutModel from '@/assets/pp.jpeg';
import aboutDetail from '@/assets/ring.jpeg';
import exploreIcon from '@/assets/logoicon.png';

interface CounterProps {
  end: number;
  suffix?: string;
  label: string;
  inView: boolean;
}

const AnimatedCounter = ({ end, suffix = '', label, inView }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let animationFrame: number;
    const duration = 2000;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, inView]);

  return (
    // Mobile: px-3, py-4 | Desktop: px-4, py-6 (Sizes from your latest code)
    <div className="bg-white px-3 sm:px-4 py-4 sm:py-6 text-center rounded-sm border-2 border-primary/20 shadow-sm">
      <span className="block font-display text-xl sm:text-2xl md:text-3xl text-primary mb-1">
        {count}{suffix}
      </span>
      <span className="text-muted-foreground text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
};

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-10 sm:py-16 lg:py-24 relative overflow-hidden" style={{ backgroundColor: '#FBF5F6' }}>
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-32 sm:w-64 h-32 sm:h-64 opacity-[0.04] pointer-events-none hidden sm:block" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M20,180 Q100,20 180,180' fill='none' stroke='%23333' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 lg:gap-24 items-center">

          {/* Left: Text Content - Responsive alignment (Center on mobile, Left on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 text-center lg:text-left"
          >
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center bg-primary text-white px-4 py-1.5 font-body text-[10px] sm:text-xs tracking-widest uppercase rounded-full shadow-sm mb-4 sm:mb-6">
                <img
                  src={exploreIcon}
                  alt="Explore"
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 object-contain"
                />
                Jewelskart As Unique As You
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-foreground leading-[1.2] mb-4 sm:mb-6">
              Commitment, Forever, In Every Sparkling Jewel
            </h2>

            <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed mb-6 sm:mb-10 max-w-lg mx-auto lg:mx-0">
              Our brand was born in 1990, but its roots run far deeper. Jewellery has always been more than a business for our family — it is a legacy passed down through generations.
            </p>

            {/* Stats Row - Desktop sizes maintained */}
            <div ref={ref} className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
              <AnimatedCounter end={20} suffix="+" label="Branches" inView={isInView} />
              <AnimatedCounter end={200} suffix="+" label="Designs" inView={isInView} />
              <AnimatedCounter end={3} suffix="M" label="Clients" inView={isInView} />
            </div>

            <div className="flex justify-center lg:justify-start">
              <Link
                to="/about"
                className="inline-flex items-center gap-3 bg-primary text-white px-7 sm:px-8 py-3.5 sm:py-4 font-body text-xs sm:text-sm tracking-wider uppercase hover:bg-primary/90 transition-all duration-300 group"
              >
                Know More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Image Section - Desktop sizing strictly from your second code */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end order-2 mt-8 lg:mt-0"
          >
            {/* Max-width 550px for desktop kept here */}
            <div className="relative w-full max-w-[280px] sm:max-w-[480px] lg:max-w-[550px]">

              {/* Gold Border */}
              <div
                className="absolute -inset-3 lg:-inset-4 border-[1.5px] pointer-events-none"
                style={{
                  borderColor: '#C5A059',
                  borderRadius: '1000px 1000px 0 0',
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px'
                }}
              />

              {/* Main Image */}
              <div
                className="relative overflow-hidden aspect-[4/5] z-10 shadow-sm"
                style={{ borderRadius: '1000px 1000px 0 0' }}
              >
                <img
                  src={aboutModel}
                  alt="Elegant jewellery model"
                  className="w-full h-full object-cover scale-105"
                  loading="lazy"
                />
              </div>

              {/* Circular Overlay - Sizes from your latest code (w-60, h-60 on lg) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute bottom-6 sm:bottom-10 -left-4 sm:-left-16 lg:-left-20 w-28 h-28 sm:w-56 lg:w-60 lg:h-60 rounded-full overflow-hidden border-[4px] sm:border-[6px] border-white shadow-2xl z-20"
                style={{
                  transform: 'translateX(-50%)'
                }}
              >
                <img
                  src={aboutDetail}
                  alt="Jewellery detail"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};