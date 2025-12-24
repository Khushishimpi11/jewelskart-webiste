import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export const SpecialProducts = () => {
  const specialProducts = products.filter((p) => p.isSpecial);

  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-body text-sm tracking-luxury uppercase">
            Limited Edition
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-4">
            Special Pieces
          </h2>
          <div className="section-divider" />
          <p className="text-muted-foreground mt-6 max-w-xl mx-auto">
            Exclusive designs crafted in limited quantities. Each piece is a unique work of art.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {specialProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {/* Special Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-primary text-primary-foreground text-xs font-body tracking-wider px-3 py-1">
                  EXCLUSIVE
                </span>
              </div>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
