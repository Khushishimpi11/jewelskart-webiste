import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import testimonialImage from '@/assets/testimonial-image.jpg';
import avatar1 from '@/assets/testimonial-avatar1.jpg';
import avatar2 from '@/assets/testimonial-avatar2.jpg';
import avatar4 from '@/assets/testimonial-avatar4.jpg';
import exploreIcon from '../../assets/logoicon.png';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'The craftsmanship of Jewelskart is truly exceptional. Every piece I have purchased feels like a work of art. The attention to detail and the quality of materials used is unmatched. I have been a loyal customer for over 3 years now.',
    avatar: avatar1,
    title: 'Timeless Elegance',
  },
  {
    id: 2,
    name: 'Ananya Patel',
    location: 'Delhi',
    rating: 5,
    text: 'I ordered a custom pendant for my anniversary and it exceeded all expectations. The design team understood exactly what I wanted and delivered perfection. The packaging was luxurious and the delivery was prompt. Highly recommended!',
    avatar: avatar2,
    title: 'Shine With Elegance',
  },
  {
    id: 3,
    name: 'Meera Krishnan',
    location: 'Bangalore',
    rating: 4,
    text: 'Jewelskart has become my go-to destination for all jewellery needs. From daily wear rings to special occasion necklaces, every piece is beautifully crafted. Their customer service is warm and helpful. A truly premium experience.',
    avatar: avatar4,
    title: 'Pure Brilliance',
  },
  {
    id: 4,
    name: 'Ritu Verma',
    location: 'Jaipur',
    rating: 5,
    text: 'The gold chain I purchased is absolutely stunning. It has a beautiful shine and the clasp is very secure. I wear it every day and it still looks as good as new. Jewelskart truly delivers on their promise of quality.',
    avatar: avatar1,
    title: 'Radiant Beauty',
  },
];

export const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: '#FBF5F6' }}>
      {/* Decorative sparkle */}
      <div className="absolute top-10 right-20 text-accent/20 text-6xl font-display">✦</div>
      <div className="absolute bottom-20 right-40 text-accent/15 text-4xl font-display">✦</div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center text-primary font-body text-xs tracking-[0.3em] uppercase mb-3">
            <img src={exploreIcon} alt="Icon" className="w-5 h-5 mr-2" />
            Customer Voices
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground">
            Our Customers Speak For Us
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Testimonial content */}
          <div className="relative min-h-[350px]">
            {/* Large quote mark */}
            <div className="text-primary text-6xl sm:text-7xl font-display leading-none mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              ❝
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-foreground/80 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                  {t.text}
                </p>

                {/* Closing quote */}
                <div className="text-primary/30 text-5xl font-display leading-none mb-8 text-right max-w-xl" style={{ fontFamily: 'Georgia, serif' }}>
                  ❞
                </div>

                {/* Avatar and name */}
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-display text-lg text-foreground">{t.title}</p>
                    <p className="text-muted-foreground text-sm">
                      – {t.name}, <span className="text-primary">{t.location}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="flex items-center gap-4 mt-10">
              <span className="text-sm text-foreground font-display">0{current + 1}</span>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-[2px] transition-all duration-500 ${
                      idx === current ? 'w-12 bg-primary' : 'w-6 bg-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-display">0{testimonials.length}</span>
            </div>
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-[450px]">
              <div className="rounded-full overflow-hidden aspect-square w-full">
                <img
                  src={testimonialImage}
                  alt="Customer wearing jewelry"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Decorative sparkles */}
              <div className="absolute -top-4 -right-4 text-accent/40 text-3xl">✦</div>
              <div className="absolute -bottom-2 -left-2 text-accent/30 text-2xl">✦</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
