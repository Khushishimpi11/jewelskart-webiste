import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import productImage from '@/assets/product-necklace.jpg';

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
      <span className="block font-display text-4xl text-primary mb-2">
        {count}{suffix}
      </span>
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  );
};

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: 29, suffix: '+', label: 'Years of Craftsmanship' },
    { value: 50, suffix: 'K+', label: 'Happy Customers' },
    { value: 100, suffix: '+', label: 'Collections' },
    { value: 25, suffix: '+', label: 'Countries Served' },
  ];

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden border border-border/30">
              <img
                src={productImage}
                alt="Evimeria Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-primary/30 -z-10" />
          </motion.div>

          {/* Content Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-body text-sm tracking-luxury uppercase">
                Our Story
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-8">
                About Evimeria
              </h2>
              <div className="section-divider mb-8" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-muted-foreground text-lg leading-relaxed"
            >
              <p>
                Founded in 1995, Evimeria Jewellery has been at the forefront of luxury craftsmanship
                for nearly three decades. Our journey began with a simple belief: that every piece of
                jewellery should be a masterpiece, telling its own unique story.
              </p>
              <p>
                Each creation in our collection is meticulously handcrafted by master artisans who
                bring generations of expertise to their craft. We source only the finest ethically
                mined gemstones and precious metals, ensuring that our jewellery is as responsible
                as it is radiant.
              </p>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-border/30"
            >
              {stats.map((stat) => (
                <AnimatedCounter
                  key={stat.label}
                  end={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  inView={isInView}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
