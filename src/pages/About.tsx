import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import aboutBanner from '@/assets/about-banner.jpg';

const CounterItem = ({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl text-primary mb-2">
        {count}{suffix}
      </div>
      <div className="text-muted-foreground font-body text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-32">
        {/* Hero Banner */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img
            src={aboutBanner}
            alt="About Evimeria"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <span className="text-primary font-body text-sm tracking-luxury uppercase">
                Our Story
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4">
                About Evimeria
              </h1>
              <div className="section-divider mt-6" />
            </motion.div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <span className="text-primary font-body text-sm tracking-luxury uppercase">
                  Our Heritage
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-foreground">
                  Crafting Timeless Beauty Since 1995
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Evimeria Jewellery was founded with a singular vision: to create pieces that transcend time and trends. Our journey began in a small workshop, where master artisans dedicated themselves to the art of fine jewellery making.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we continue that legacy, blending traditional craftsmanship with contemporary design. Every piece that bears the Evimeria name is a testament to our commitment to excellence, quality, and the belief that true luxury lies in the details.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our artisans source only the finest gemstones and precious metals, ensuring that each creation is not just jewellery, but a work of art meant to be cherished for generations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-[4/5] overflow-hidden"
              >
                <img
                  src={aboutBanner}
                  alt="Evimeria Craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-primary/30 m-6" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Counters */}
        <section className="py-20 bg-card border-y border-border/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <CounterItem end={29} label="Years of Excellence" suffix="+" />
              <CounterItem end={50} label="Happy Customers" suffix="K+" />
              <CounterItem end={200} label="Collections" suffix="+" />
              <CounterItem end={35} label="Countries Served" suffix="+" />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary font-body text-sm tracking-luxury uppercase">
                What We Believe
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mt-4 mb-4">
                Our Values
              </h2>
              <div className="section-divider" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Excellence',
                  description: 'We never compromise on quality. From sourcing to crafting, excellence is our standard.',
                },
                {
                  title: 'Artistry',
                  description: 'Every piece is a canvas for our artisans to express their creativity and skill.',
                },
                {
                  title: 'Legacy',
                  description: 'We create jewellery meant to be passed down through generations, carrying stories and memories.',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-8 border border-border/30 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-display text-2xl text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
