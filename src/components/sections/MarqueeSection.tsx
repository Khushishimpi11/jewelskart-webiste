import { motion } from 'framer-motion';

const marqueeItems = [
  'Handcrafted Luxury Jewellery',
  '✦',
  'Every Gem Tells A Story',
  '✦',
  'Timeless Elegance',
  '✦',
  'Ethically Sourced',
  '✦',
  'Master Craftsmanship',
  '✦',
];

export const MarqueeSection = () => {
  return (
    <section className="py-6 bg-primary overflow-hidden">
      <div className="flex">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex items-center gap-8 whitespace-nowrap"
        >
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={index}
              className="font-display text-xl md:text-2xl text-primary-foreground"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
