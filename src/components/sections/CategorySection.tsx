import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import exploreIcon from '../../assets/logoicon.png';

export const CategorySection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center bg-primary text-white px-4 py-1 font-body text-sm tracking-luxury uppercase rounded-full">
            <img src={exploreIcon} alt="Explore" className="w-6 h-6 mr-2" />
            Explore
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-3">
            Our Collections
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto mb-4">
            Discover our curated selection of premium timepieces, each telling its own unique story 
            of craftsmanship and elegance.
          </p>
          <div className="section-divider" />
        </motion.div>

        {/* Infinite Scroll Categories */}
        <div className="relative">
          <div className="flex gap-6 animate-marquee hover:pause">
            {[...categories, ...categories, ...categories].map((category, index) => (
              <Link
                key={`${category.id}-${index}`}
                to={`/shop?category=${category.id}`}
                className="group flex-shrink-0 w-80 lg:w-96"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-sm"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                 <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-3xl text-white mb-1">
              {category.name}
                </h3>
              <p className="text-white/80 text-sm mb-3">
                 {category.productCount} pieces
                </p>
                  <span className="inline-flex items-center bg-primary text-white text-sm font-body tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                  Explore Collection
                    </span>
               </div>

                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};