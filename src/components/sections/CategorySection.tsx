import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '@/data/products';

export const CategorySection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-body text-sm tracking-luxury uppercase">
            Explore
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-4">
            Our Collections
          </h2>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl text-foreground mb-1">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {category.productCount} pieces
                    </p>
                    <span className="inline-block mt-3 text-primary text-sm font-body tracking-wider uppercase link-underline">
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
