import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export const FeaturedSection = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-body text-sm tracking-luxury uppercase">
            Handcrafted Excellence
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-4">
            Every Gem Tells a Story
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square overflow-hidden rounded-sm border border-border/30"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedProduct.id}
                src={selectedProduct.image}
                alt={selectedProduct.name}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/80 to-transparent">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="font-display text-2xl text-foreground mb-2">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {selectedProduct.description}
                  </p>
                  <span className="text-primary font-display text-xl">
                    ${selectedProduct.price.toLocaleString()}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right - Product List */}
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProduct(product)}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedProduct.id === product.id
                    ? 'ring-2 ring-primary'
                    : 'ring-1 ring-border/30 hover:ring-primary/50'
                }`}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
