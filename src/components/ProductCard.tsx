import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, RefreshCw, ChevronDown } from 'lucide-react';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  isExchangeMode?: boolean;
  onExchangeSelect?: (product: Product, selectedSize?: string) => void;
  isCurrentProduct?: boolean;
}

export const ProductCard = ({ 
  product, 
  isExchangeMode = false, 
  onExchangeSelect, 
  isCurrentProduct = false 
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  
  const productImage = product.images?.[0] || product.image || '/placeholder-image.jpg';

  // Check if product is a ring
  const isRingProduct = useMemo(() => {
    return product.category?.toLowerCase().includes('ring') || 
           product.tags?.some(tag => tag.toLowerCase().includes('ring')) ||
           (product.specifications?.ringSizes && product.specifications.ringSizes.length > 0);
  }, [product]);

  // Available ring sizes from backend, or default to Free Size
  const availableSizes = useMemo(() => {
    if (product.specifications?.ringSizes && product.specifications.ringSizes.length > 0) {
      return product.specifications.ringSizes;
    }
    if (isRingProduct) {
      return ['Free Size'];
    }
    return [];
  }, [product, isRingProduct]);

  // Auto-select Free Size if only one option
  useMemo(() => {
    if (isRingProduct && availableSizes.length === 1 && availableSizes[0] === 'Free Size') {
      setSelectedSize('Free Size');
    }
  }, [isRingProduct, availableSizes]);

  // ✅ Handle add to cart - adds to cart store
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isRingProduct && !selectedSize) {
      toast.error('Please select a ring size first');
      setShowSizeDropdown(true);
      return;
    }
    
    const sizeToPass = isRingProduct ? selectedSize : undefined;
    
    addToCart(product, sizeToPass);
    
    if (isRingProduct && selectedSize && selectedSize !== 'Free Size') {
      toast.success(`${product.name} (Size ${selectedSize}) added to cart`);
    } else {
      toast.success(`${product.name} added to cart`);
    }
  };

  // ✅ Handle Buy Now - goes to checkout with only this product
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isRingProduct && !selectedSize) {
      toast.error('Please select a ring size first');
      setShowSizeDropdown(true);
      return;
    }
    
    const sizeToPass = isRingProduct ? selectedSize : undefined;
    const productId = product._id || product.id;
    
    // Create buy now product object
    const buyNowProduct = {
      product: {
        id: productId,
        name: product.name,
        price: product.price,
        image: productImage,
        category: product.category,
        sku: product.sku,
        stock: product.stock
      },
      quantity: 1,
      size: sizeToPass,
      timestamp: Date.now()
    };
    
    // Navigate to checkout with buy now data
    navigate('/checkout', {
      state: {
        buyNowProduct: buyNowProduct,
        isBuyNow: true,
        fromBuyNow: true
      }
    });
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

  const handleCardClick = () => {
    if (isExchangeMode) return;
    navigate(`/product/${product.id}`);
  };

  const handleExchangeSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isRingProduct && !selectedSize) {
      toast.error('Please select a ring size first');
      setShowSizeDropdown(true);
      return;
    }
    
    if (onExchangeSelect && !isCurrentProduct && !isOutOfStock) {
      onExchangeSelect(product, isRingProduct ? selectedSize : undefined);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Exchange Mode Render
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

          {isOutOfStock && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-body tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-10">
              OUT OF STOCK
            </span>
          )}

          {isCurrentProduct && (
            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-500 text-white text-[10px] sm:text-xs font-body tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-10">
              CURRENT
            </span>
          )}
        </div>

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

          {/* Size Selector for Exchange Mode */}
          {isRingProduct && !isCurrentProduct && !isOutOfStock && (
            <div className="relative mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizeDropdown(!showSizeDropdown);
                }}
                className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background hover:border-primary transition-colors flex items-center justify-between"
              >
                <span className={selectedSize ? 'text-foreground' : 'text-muted-foreground'}>
                  {selectedSize ? `Size: ${selectedSize}` : 'Select Ring Size'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSizeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showSizeDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-sm shadow-lg">
                  <div className={`grid ${availableSizes.length > 4 ? 'grid-cols-4' : 'grid-cols-' + availableSizes.length} gap-1 p-2`}>
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSize(size);
                          setShowSizeDropdown(false);
                          toast.success(`Size ${size} selected`);
                        }}
                        className={`px-2 py-2 text-sm text-center rounded transition-colors ${
                          selectedSize === size
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10 text-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleExchangeSelect}
            disabled={isCurrentProduct || isOutOfStock || (isRingProduct && !selectedSize)}
            className={`w-full mt-1 sm:mt-2 py-2.5 sm:py-2 text-xs min-h-[44px] rounded-sm transition-all flex items-center justify-center gap-2 ${
              isCurrentProduct || isOutOfStock || (isRingProduct && !selectedSize)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            {isCurrentProduct 
              ? 'Current Product' 
              : isOutOfStock 
              ? 'Out of Stock' 
              : isRingProduct && !selectedSize
              ? 'Select Size First'
              : 'Select for Exchange'}
          </button>
        </div>
      </motion.div>
    );
  }

  // ✅ Normal Mode Render - Updated with Buy Now
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

        {product.originalPrice && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-primary-foreground text-[10px] sm:text-xs font-body tracking-wider px-2 sm:px-3 py-0.5 sm:py-1">
            SALE
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-body tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            OUT OF STOCK
          </span>
        )}

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

        {/* Size Selector for Normal Mode */}
        {isRingProduct && !isOutOfStock && (
          <div className="relative mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSizeDropdown(!showSizeDropdown);
              }}
              className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background hover:border-primary transition-colors flex items-center justify-between"
            >
              <span className={selectedSize ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedSize ? `Size: ${selectedSize}` : 'Select Ring Size'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showSizeDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSizeDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-sm shadow-lg">
                <div className={`grid ${availableSizes.length > 4 ? 'grid-cols-4' : 'grid-cols-' + availableSizes.length} gap-1 p-2`}>
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                        setShowSizeDropdown(false);
                        toast.success(`Size ${size} selected`);
                      }}
                      className={`px-2 py-2 text-sm text-center rounded transition-colors ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-primary/10 text-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ TWO BUTTONS: Add to Cart and Buy Now */}
        <div className="flex gap-2 mt-1 sm:mt-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || (isRingProduct && !selectedSize)}
            className={`flex-1 py-2.5 sm:py-2 text-xs min-h-[44px] rounded-sm transition-all ${
              isOutOfStock || (isRingProduct && !selectedSize)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            🛒 Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock || (isRingProduct && !selectedSize)}
            className={`flex-1 py-2.5 sm:py-2 text-xs min-h-[44px] rounded-sm transition-all ${
              isOutOfStock || (isRingProduct && !selectedSize)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            🔥 Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};