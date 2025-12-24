import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'sonner';

export const FeaturedSection = () => {
  const featuredProducts = products.slice(0, 6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedProduct = featuredProducts[currentIndex];

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  // Auto-change product every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, undefined);
    toast.success(`${selectedProduct.name} added to cart`);
  };

  const handleAddToWishlist = () => {
    addToWishlist(selectedProduct);
    toast.success('Added to wishlist');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

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

        {/* Full Width Split Layout */}
        <div className="grid lg:grid-cols-2 gap-0 border border-border/30 overflow-hidden">
          {/* Left - Large Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square lg:aspect-auto lg:h-[650px] overflow-hidden bg-muted/20"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedProduct.id}
                src={selectedProduct.image}
                alt={selectedProduct.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
          </motion.div>

          {/* Right - Product Details */}
          <div className="bg-card p-8 lg:p-16 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-lg"
            >
              {/* Title */}
              <h3 className="font-display text-3xl lg:text-4xl text-foreground mb-4">
                Every Gem Tells A Story
              </h3>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                Discover the artistry behind each piece. Our master craftsmen pour their passion into creating jewellery that captures life's precious moments.
              </p>

              {/* Product Card with Navigation */}
              <div className="relative bg-background border border-border/30 p-6 mb-8">
                <div className="flex items-start gap-6">
                  {/* Product Image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedProduct.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-32 h-32 flex-shrink-0 overflow-hidden border border-border/30"
                    >
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Product Info */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedProduct.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1"
                    >
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                        {selectedProduct.category}
                      </p>
                      <h4 className="font-display text-xl text-foreground mb-2">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-primary font-display text-lg mb-4">
                        {formatPrice(selectedProduct.price)}
                      </p>
                      
                      {/* Quick Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleAddToCart}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-body tracking-wider hover:bg-primary/90 transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          Buy Now
                        </button>
                        <button
                          onClick={handleAddToWishlist}
                          className="w-8 h-8 border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(selectedProduct.id) ? 'fill-current text-primary' : ''}`} />
                        </button>
                        <Link
                          to={`/product/${selectedProduct.id}`}
                          className="w-8 h-8 border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevProduct}
                    className="w-10 h-10 border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextProduct}
                    className="w-10 h-10 border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex items-center gap-2">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex ? 'w-6 bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
