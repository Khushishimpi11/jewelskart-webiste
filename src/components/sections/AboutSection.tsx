import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import productImage from '@/assets/Chain/Chain/c1.1.jpg';
import exploreIcon from '../../assets/logoicon.png';
import { Link } from 'react-router-dom';

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
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, inView]);

  return (
    <div className="text-center">
      <span className="block font-display text-2xl sm:text-4xl text-primary mb-1 sm:mb-2">
        {count}{suffix}
      </span>
      <span className="text-muted-foreground text-xs sm:text-sm">{label}</span>
    </div>
  );
};

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-12 sm:py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden border border-border/30">
              <img
                src={productImage}
                alt="Evimeria Craftsmanship"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-full h-full border border-primary -z-10" />
          </motion.div>

          {/* Content Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center bg-primary text-white px-3 sm:px-4 py-1 font-body text-xs sm:text-sm tracking-luxury uppercase rounded-full">
                <img src={exploreIcon} alt="Our Story" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Our Legacy
              </span>
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-foreground mt-3 sm:mt-4 mb-4 sm:mb-8">
                A Heritage of Craftsmanship
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4 sm:space-y-6 text-muted-foreground text-sm sm:text-lg leading-relaxed"
            >
              <p className="font-medium text-foreground/90 italic">
                Our brand was born in 1990, but its roots run far deeper.
              </p>
              
              <p>
                Jewellery has always been more than a business for our family — it is a legacy passed down through generations. Our founder's grandfather laid the foundation with a deep passion for jewellery and fine craftsmanship.
              </p>
              
              <p className="hidden sm:block">
                Growing up surrounded by gemstones, gold, silver, and diamonds, the founder naturally developed an eye for quality and a respect for tradition. In 1990, he officially established the brand with a vision to preserve the family's values of trust, purity, and excellence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 sm:mt-8"
            >
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 min-h-[44px] bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors duration-300 group text-sm"
              >
                Know More
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};