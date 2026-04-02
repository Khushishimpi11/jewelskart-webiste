import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import partnerBg from '@/assets/mchain.jpg';

const benefits = [
  'Reach a wider audience',
  'Increase brand visibility',
  'Easy onboarding process',
  'Trusted platform',
];

export const PartnerSection = () => {
  return (
    <section
      className="relative w-full py-20 sm:py-28 lg:py-36 overflow-hidden"
      style={{
        backgroundImage: `url(${partnerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
            Partner With{' '}
            <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="font-bold">Jewels</span>
              <span className="font-thin tracking-wider">kart</span>
            </span>
          </h2>

          <p className="text-white/80 text-sm sm:text-lg mb-8 leading-relaxed">
            Showcase your jewelry brand to thousands of customers and grow your business with us
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
            {benefits.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full"
              >
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-white text-xs sm:text-sm">{b}</span>
              </motion.div>
            ))}
          </div>

          <Link
            to="/contact?partner=true"
            className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 font-body text-sm tracking-wider uppercase hover:bg-white/90 transition-all duration-300 group shadow-lg"
          >
            Apply Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
