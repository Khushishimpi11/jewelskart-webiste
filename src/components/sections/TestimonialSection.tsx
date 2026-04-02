import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import testimonialImage from '@/assets/cc.jpg';
import avatar1 from '@/assets/testimonial-avatar1.jpg';
import avatar2 from '@/assets/testimonial-avatar2.jpg';
import avatar4 from '@/assets/testimonial-avatar4.jpg';
import exploreIcon from '../../assets/logoicon.png';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'The craftsmanship of Jewelskart is truly exceptional. Every piece I have purchased feels like a work of art. The attention to detail and the quality of materials used is unmatched.',
    avatar: avatar1,
  },
  {
    id: 2,
    name: 'Ananya Patel',
    location: 'Delhi',
    text: 'I ordered a custom pendant for my anniversary and it exceeded all expectations. The design team understood exactly what I wanted and delivered perfection.',
    avatar: avatar2,
  },
  {
    id: 3,
    name: 'Meera Krishnan',
    location: 'Bangalore',
    text: 'Jewelskart has become my go-to destination for all jewellery needs. From daily wear rings to special occasion necklaces, every piece is beautifully crafted.',
    avatar: avatar4,
  },
];

export const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-[#FFF] overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Content - First on mobile (order-1), Left on desktop (lg:order-1) */}
          <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-1">
            {/* Header with Rounded Primary Color Background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary">
                  <img 
                    src={exploreIcon} 
                    alt="Explore" 
                    className="w-3 h-3 sm:w-4 sm:h-4 object-contain" 
                    onError={(e) => console.log("Icon load error", e)}
                  />
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.3em] sm:tracking-[0.5em] uppercase font-semibold text-white">
                    CUSTOMER VOICES
                  </span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#1a1a1a] leading-[1.2] text-center lg:text-left px-2 sm:px-0">
                Our Customers Speak For Us
              </h2>
            </motion.div>

            {/* Testimonial Box */}
            <div className="relative">
              {/* Opening Quote with Primary Color */}
              <div className="text-5xl sm:text-6xl md:text-7xl font-serif -mb-3 sm:-mb-4 text-primary text-center lg:text-left">
                “
              </div>

              <div className="min-h-[220px] sm:min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="px-2 sm:px-4 md:pl-6"
                  >
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg font-light leading-relaxed text-center lg:text-left">
                      {t.text}
                    </p>

                    {/* Closing Quote */}
                    <div className="text-4xl sm:text-5xl font-serif mt-2 sm:mt-1 flex justify-center lg:justify-end max-w-2xl mx-auto lg:mx-0 opacity-30 text-primary">
                      ”
                    </div>

                    {/* User Info */}
                    <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary/30"
                      />
                      <div className="text-center lg:text-left">
                        <span className="font-semibold tracking-tight text-primary text-sm sm:text-base">
                          — {t.name},
                        </span>
                        <span className="text-gray-400 ml-1 sm:ml-2 text-xs sm:text-sm font-light">{t.location}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Controls with Primary Color */}
              <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-6 sm:mt-8 px-2 sm:px-4 md:pl-6">
                <span className="text-xs font-bold tracking-tighter text-primary">0{current + 1}</span>
                <div className="flex gap-2 sm:gap-3">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className="group relative py-2"
                    >
                      <div className={`h-[2px] transition-all duration-700 ${
                        idx === current ? 'w-8 sm:w-10 bg-primary' : 'w-5 sm:w-6 bg-gray-300 group-hover:bg-gray-400'
                      }`} />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold tracking-tighter text-gray-400">0{testimonials.length}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Arched Image - Second on mobile (order-2), Right on desktop (lg:order-2) */}
          <motion.div
            className="lg:col-span-5 relative order-2 lg:order-2 mb-8 sm:mb-10 lg:mb-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="relative group mx-auto max-w-[320px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[480px]">
              {/* Arched shape container with Primary Color border */}
              <div className="overflow-hidden rounded-t-[180px] sm:rounded-t-[220px] md:rounded-t-[260px] lg:rounded-t-[280px] h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] relative z-10 border-[8px] sm:border-[10px] md:border-[12px] border-primary/20">
                <img
                  src={testimonialImage}
                  alt="Customer wearing jewelry"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
              </div>

              {/* Decorative Primary Color Elements - Responsive sizing */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 sm:-top-6 md:-top-8 -right-4 sm:-right-6 md:-right-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl select-none z-0 opacity-80 text-primary"
              >
                ✦
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-5 sm:bottom-6 md:bottom-8 lg:bottom-10 -left-6 sm:-left-8 md:-left-10 lg:-left-12 text-3xl sm:text-4xl md:text-5xl select-none z-20 opacity-60 text-primary"
              >
                ✦
              </motion.div>
              
              {/* Additional Primary Color Decorative Elements */}
              <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 w-16 sm:w-20 h-16 sm:h-20 rounded-full opacity-10 blur-xl -z-10 bg-primary" />
              <div className="absolute -bottom-6 sm:-bottom-8 right-4 sm:right-6 md:right-8 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full opacity-5 blur-2xl -z-10 bg-primary" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;