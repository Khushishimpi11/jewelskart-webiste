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

        {/* Split Layout - Based on Reference Image */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0">
          {/* Left - Large Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] lg:aspect-auto lg:h-[600px] overflow-hidden"
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
          </motion.div>

          {/* Right - Product Info with Small Image */}
          <div className="bg-card lg:bg-muted/30 p-8 lg:p-12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto lg:mx-0"
            >
              {/* Title */}
              <h3 className="font-display text-3xl text-foreground mb-8">
                Every Gem Tells A Story
              </h3>

              {/* Small Product Image with Navigation */}
              <div className="relative mb-8">
                <div className="flex items-center gap-4">
                  {/* Prev Button */}
                  <button
                    onClick={prevProduct}
                    className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Product Image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedProduct.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 aspect-square max-w-[200px] overflow-hidden border border-border/30"
                    >
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Next Button */}
                  <button
                    onClick={nextProduct}
                    className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProduct.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2">
                    {selectedProduct.category}
                  </p>
                  <h4 className="font-display text-2xl text-foreground mb-4">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-primary font-display text-xl mb-6">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button onClick={handleAddToCart} className="btn-gold flex-1 flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Buy Now
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="w-12 h-12 border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(selectedProduct.id) ? 'fill-current text-primary' : ''}`} />
                </button>
                <Link
                  to={`/product/${selectedProduct.id}`}
                  className="w-12 h-12 border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                >
                  <Eye className="w-5 h-5" />
                </Link>
              </div>

              {/* Dots Indicator */}
              <div className="flex items-center justify-center gap-2 mt-8">
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
