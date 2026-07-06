import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import exploreIcon from '../../assets/logoicon.png';

interface FeaturedSectionProps {
  products?: any[];
  isLoading?: boolean;
}

export const FeaturedSection = ({ products: propProducts, isLoading = false }: FeaturedSectionProps) => {
  const featuredProducts = propProducts && propProducts.length > 0 ? propProducts.slice(0, 6) : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (featuredProducts.length <= 1) {
      setCurrentIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  if (isLoading) {
    return (
      <section className="w-full py-16 text-center text-muted-foreground bg-background">
        <div className="animate-pulse">Loading signature products...</div>
      </section>
    );
  }

  if (featuredProducts.length === 0) return null;

  const selectedProduct = featuredProducts[currentIndex];

  if (!selectedProduct) return null;

  const nextProduct = () => setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  const prevProduct = () => setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${selectedProduct.id}`);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const getLeftImage = () => {
    if (selectedProduct.images && selectedProduct.images.length > 1) {
      return selectedProduct.images[1];
    }
    return selectedProduct.image;
  };

  const getCardImage = () => selectedProduct.image;

  return (
    <section className="w-full py-10 sm:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-16"
        >
          <span className="inline-flex items-center bg-primary text-white px-4 py-1.5 font-body text-[10px] sm:text-xs tracking-widest uppercase rounded-full shadow-sm">
            <img
              src={exploreIcon}
              alt="Handcrafted"
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2 object-contain"
            />
            Signature Products
          </span>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-foreground mt-3 sm:mt-4 mb-2">
            Every Gem Tells a Story
          </h2>

          <p className="text-foreground/60 text-sm sm:text-lg max-w-2xl mx-auto mb-3">
            Discover our signature jewellery collection, featuring handcrafted rings, pendants, earrings and bracelets designed with timeless elegance.
          </p>

          <div className="section-divider" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border/30 overflow-hidden lg:max-h-[580px] lg:h-[580px]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-square lg:aspect-auto lg:h-[580px] overflow-hidden bg-muted/20 lg:order-2"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={`${selectedProduct.id}-left`}
                src={getLeftImage()}
                alt={selectedProduct.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </AnimatePresence>

            <div className="absolute inset-0" />
          </motion.div>

          <div className="bg-[#FBF5F6] p-6 sm:p-8 lg:p-16 flex flex-col justify-center lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-lg"
            >
              <h3 className="font-display text-2xl sm:text-3xl lg:text-5xl text-foreground mb-3 sm:mb-4">
                Signature Jewellery Collection
              </h3>

              <p className="text-muted-foreground mb-6 sm:mb-10 leading-relaxed text-sm sm:text-base">
                Explore our most loved jewellery designs, crafted to add elegance, sparkle, and meaning to every special moment.
              </p>

              <div
                onClick={() => navigate(`/product/${selectedProduct.id}`)}
                className="relative bg-background border border-border/30 p-4 sm:p-6 mb-6 sm:mb-8 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedProduct.id}-card`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden border border-border/30"
                    >
                      <img
                        src={getCardImage()}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedProduct.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider mb-1">
                        {selectedProduct.category}
                      </p>

                      <h4 className="font-semibold text-base sm:text-xl text-foreground mb-1 sm:mb-2 truncate">
                        {selectedProduct.name}
                      </h4>

                      <div className="flex items-center justify-between gap-3 mb-3 sm:block">
                        <p className="text-primary font-semibold text-base sm:text-lg sm:mb-3">
                          {formatPrice(selectedProduct.price)}
                        </p>

                        <button
                          onClick={handleViewProduct}
                          className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-body tracking-wider hover:bg-primary/90 transition-colors h-7 sm:h-auto sm:px-5 sm:py-2 sm:text-xs sm:gap-2 whitespace-nowrap"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={prevProduct}
                    className="w-10 h-10 min-h-[44px] min-w-[44px] border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextProduct}
                    className="w-10 h-10 min-h-[44px] min-w-[44px] border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-5 sm:w-6 bg-primary' : 'bg-muted-foreground/30'
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