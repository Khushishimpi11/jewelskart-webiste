import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import aboutModel from '@/assets/about-model.jpg';
import aboutDetail from '@/assets/about-earring-detail.jpg';
import exploreIcon from '../../assets/logoicon.png';

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
    <div className="bg-[#f5ebe0] px-6 py-6 text-center">
      <span className="block font-display text-3xl sm:text-4xl text-foreground mb-1">
        {count}{suffix}
      </span>
      <span className="text-muted-foreground text-xs sm:text-sm">{label}</span>
    </div>
  );
};

import { useState, useEffect } from 'react';

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: '#FBF5F6' }}>
      {/* Subtle leaf decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M20,180 Q100,20 180,180' fill='none' stroke='%23333' stroke-width='1'/%3E%3Cpath d='M40,180 Q100,40 160,180' fill='none' stroke='%23333' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }} />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center text-primary font-body text-xs sm:text-sm tracking-[0.3em] uppercase mb-4">
              <img src={exploreIcon} alt="Icon" className="w-5 h-5 mr-2" />
              Jewels As Unique As You
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-[1.1] mb-6">
              Commitment, Forever, In Every Sparkling Jewel
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
              Our brand was born in 1990, but its roots run far deeper. Jewellery has always been more than a business for our family — it is a legacy passed down through generations, carrying stories of love, celebration, and timeless elegance.
            </p>

            {/* Stats Row */}
            <div ref={ref} className="grid grid-cols-3 gap-4 mb-10">
              <AnimatedCounter end={20} suffix="+" label="Worldwide Branch" inView={isInView} />
              <AnimatedCounter end={200} suffix="+" label="Unique Designs" inView={isInView} />
              <AnimatedCounter end={3} suffix="M" label="Happy Clients" inView={isInView} />
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-all duration-300 group"
            >
              Know More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: Images - arch frame with circular overlay */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main arch image with gold border */}
            <div className="relative w-full max-w-[420px]">
              {/* Gold arch border */}
              <div className="absolute inset-0 rounded-t-[50%] border-2 border-accent/60 translate-x-3 translate-y-3 z-0" 
                style={{ borderColor: 'hsl(36, 60%, 55%)' }}
              />
              
              {/* Main image in arch shape */}
              <div className="relative rounded-t-[50%] overflow-hidden aspect-[3/4] z-10">
                <img
                  src={aboutModel}
                  alt="Elegant jewellery model"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Circular detail image overlapping bottom-right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-8 right-[-20px] sm:right-[-30px] w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl z-20"
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
