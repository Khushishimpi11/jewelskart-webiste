import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, RefreshCw } from 'lucide-react';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  isExchangeMode?: boolean;
  onExchangeSelect?: (product: Product) => void;
  isCurrentProduct?: boolean;
}

export const ProductCard = ({ 
  product, 
  isExchangeMode = false, 
  onExchangeSelect, 
  isCurrentProduct = false 
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  
  // Get image from product.images array or fallback
  const productImage = product.images?.[0] || product.image || '/placeholder-image.jpg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, undefined);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  // ✅ FIXED: In exchange mode, don't navigate to product detail
  const handleCardClick = () => {
    if (isExchangeMode) return;  // ✅ Exchange mode mein navigation band
    navigate(`/product/${product.id}`);
  };

  const handleExchangeSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExchangeSelect && !isCurrentProduct && !isOutOfStock) {
      onExchangeSelect(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // ============ EXCHANGE MODE RENDER ============
  if (isExchangeMode) {
    return (
      <motion.div
        className="group product-card relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Image Container */}
        <div className="relative aspect-product overflow-hidden bg-card rounded-sm">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.error("Image error:", product.name);
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-body tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-10">
              OUT OF STOCK
            </span>
          )}

          {/* Current Product Badge */}
          {isCurrentProduct && (
            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-500 text-white text-[10px] sm:text-xs font-body tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-10">
              CURRENT
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
          <h3 className="font-[Montserrat,sans-serif] text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="font-body text-sm sm:text-base text-primary font-medium">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-body text-muted-foreground line-through text-xs sm:text-sm">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Exchange Mode Button - Only this button */}
          <button
            onClick={handleExchangeSelect}
            disabled={isCurrentProduct || isOutOfStock}
            className={`w-full mt-1 sm:mt-2 py-2.5 sm:py-2 text-xs min-h-[44px] rounded-sm transition-all flex items-center justify-center gap-2 ${
              isCurrentProduct || isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            {isCurrentProduct 
              ? 'Current Product' 
              : isOutOfStock 
              ? 'Out of Stock' 
              : 'Select for Exchange'}
          </button>
        </div>
      </motion.div>
    );
  }

  // ============ NORMAL MODE RENDER (Original) ============
  return (
    <motion.div
      className="group product-card relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative aspect-product overflow-hidden bg-card rounded-sm">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />

        {/* Sale Badge */}
        {product.originalPrice && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-primary-foreground text-[10px] sm:text-xs font-body tracking-wider px-2 sm:px-3 py-0.5 sm:py-1">
            SALE
          </span>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-body tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            OUT OF STOCK
          </span>
        )}

        {/* Hover Overlay - Only show if in stock */}
        {!isOutOfStock && (
          <motion.div
            className="absolute inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleWishlistToggle}
              className={`icon-btn icon-btn-wishlist ${inWishlist ? 'bg-wishlist text-white' : ''}`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
            <button onClick={handleAddToCart} className="icon-btn icon-btn-cart">
              <ShoppingBag className="w-4 h-4" />
            </button>
            <Link to={`/product/${product.id}`} className="icon-btn icon-btn-view" onClick={(e) => e.stopPropagation()}>
              <Eye className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
        <h3 className="font-[Montserrat,sans-serif] text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="font-body text-sm sm:text-base text-primary font-medium">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="font-body text-muted-foreground line-through text-xs sm:text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full mt-1 sm:mt-2 py-2.5 sm:py-2 text-xs min-h-[44px] rounded-sm transition-all ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'btn-gold-outline'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
        </button>
      </div>
    </motion.div>
  );
};