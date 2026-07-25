import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, RefreshCw, ChevronDown, Check, Star } from 'lucide-react';
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
  const [currentImage, setCurrentImage] = useState<string>('');
  const addToCart = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;

  const productImage = product.images?.[0] || product.image || '/placeholder-image.jpg';
  const hoverImage = product.images?.[1] || product.images?.[0] || product.image || '/placeholder-image.jpg';

  useEffect(() => {
    setCurrentImage(productImage);
  }, [productImage]);

  const isRingProduct = useMemo(() => {
    return product.category?.toLowerCase().includes('ring') ||
      product.tags?.some(tag => tag.toLowerCase().includes('ring')) ||
      (product.specifications?.ringSizes && product.specifications.ringSizes.length > 0);
  }, [product]);

  const availableSizes = useMemo(() => {
    if (product.specifications?.ringSizes && product.specifications.ringSizes.length > 0) {
      return product.specifications.ringSizes;
    }
    if (isRingProduct) {
      return ['Free Size'];
    }
    return [];
  }, [product, isRingProduct]);

  const hasOnlyFreeSize = useMemo(() => {
    return isRingProduct && availableSizes.length === 1 && availableSizes[0] === 'Free Size';
  }, [isRingProduct, availableSizes]);

  const hasMultipleSizes = useMemo(() => {
    return isRingProduct && availableSizes.length > 1;
  }, [isRingProduct, availableSizes]);

  useEffect(() => {
    if (hasOnlyFreeSize) {
      setSelectedSize('Free Size');
    }
  }, [hasOnlyFreeSize]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasMultipleSizes && !selectedSize) {
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

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasMultipleSizes && !selectedSize) {
      toast.error('Please select a ring size first');
      setShowSizeDropdown(true);
      return;
    }

    const sizeToPass = isRingProduct ? selectedSize : undefined;
    const productId = product._id || product.id;

    const buyNowProduct = {
      product: {
        id: productId,
        name: product.name,
        price: product.price,
        image: currentImage || productImage,
        category: product.category,
        sku: product.sku,
        stock: product.stock
      },
      quantity: 1,
      size: sizeToPass,
      timestamp: Date.now()
    };

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

    const productId = product._id || product.id;

    const wishlistProduct = {
      id: productId,
      name: product.name,
      price: product.price,
      image: currentImage || productImage,
      category: product.category,
      originalPrice: product.purchasePrice,
      stock: product.stock,
      sku: product.sku,
      isRingProduct: isRingProduct,
      availableSizes: isRingProduct ? availableSizes : undefined,
      selectedSize: isRingProduct ? selectedSize : undefined
    };

    if (inWishlist) {
      removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } else {
      if (hasMultipleSizes && !selectedSize) {
        toast.error('Please select a ring size first');
        setShowSizeDropdown(true);
        return;
      }
      addToWishlist(wishlistProduct, selectedSize);
    }
  };

  const handleCardClick = () => {
    if (isExchangeMode) return;
    navigate(`/product/${product.id}`, {
      state: isRingProduct && selectedSize ? { selectedSize: selectedSize } : {}
    });
  };

  const handleExchangeSelect = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasMultipleSizes && !selectedSize) {
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

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.images?.[1]) {
      setCurrentImage(product.images[1]);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImage(productImage);
  };

  if (isExchangeMode) {
    return (
      <motion.div
        className="group product-card relative cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-t-lg">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
          {isOutOfStock && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10">
              OUT OF STOCK
            </span>
          )}
          {isCurrentProduct && (
            <span className="absolute top-2 right-2 bg-gray-600 text-white text-[10px] font-medium tracking-wider px-3 py-1 rounded-full z-10">
              CURRENT
            </span>
          )}
        </div>
        <div className="p-3 space-y-1.5">
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {Number(product.originalPrice) > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {hasMultipleSizes && !isCurrentProduct && !isOutOfStock && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizeDropdown(!showSizeDropdown);
                }}
                className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-gray-50 hover:border-primary transition-colors flex items-center justify-between"
              >
                <span className={selectedSize ? 'text-gray-800' : 'text-gray-400'}>
                  {selectedSize ? `Size: ${selectedSize}` : 'Select Ring Size'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showSizeDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showSizeDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className={`grid ${availableSizes.length > 4 ? 'grid-cols-4' : 'grid-cols-' + availableSizes.length} gap-1 p-1.5`}>
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSize(size);
                          setShowSizeDropdown(false);
                          toast.success(`Size ${size} selected`);
                        }}
                        className={`px-1.5 py-1 text-xs text-center rounded-md transition-colors ${selectedSize === size
                          ? 'bg-primary text-white'
                          : 'hover:bg-primary/10 text-gray-700'
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

          {hasOnlyFreeSize && !isCurrentProduct && !isOutOfStock && (
            <div className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
              Free Size
            </div>
          )}

          <button
            onClick={handleExchangeSelect}
            disabled={isCurrentProduct || isOutOfStock || (hasMultipleSizes && !selectedSize)}
            className={`w-full mt-1.5 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${isCurrentProduct || isOutOfStock || (hasMultipleSizes && !selectedSize)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
              }`}
          >
            <RefreshCw className="w-4 h-4" />
            {isCurrentProduct
              ? 'Current Product'
              : isOutOfStock
                ? 'Out of Stock'
                : hasMultipleSizes && !selectedSize
                  ? 'Select Size First'
                  : 'Select for Exchange'}
          </button>
        </div>
      </motion.div>
    );
  }

  // ✅ UPDATED: Wishlist appears on hover like Add to Cart
  return (
    <motion.div
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-primary/30"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />

        {/* OUT OF STOCK Badge */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10">
            OUT OF STOCK
          </span>
        )}

        {/* SALE Badge */}
        {Number(product.originalPrice) > 0 && (
          <span className={`absolute bg-primary text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10 ${isOutOfStock ? 'top-8' : 'top-2'} left-2`}>
            SALE
          </span>
        )}

        {/* ✅ WISHLIST BUTTON - Appears on hover like Add to Cart */}
        <motion.button
          onClick={handleWishlistToggle}
          className={`absolute right-3 p-2.5 rounded-full transition-all z-10 shadow-md ${inWishlist
            ? 'bg-red-500 text-white shadow-red-500/30'
            : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : -10,
            scale: inWishlist ? 1.1 : 1
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ top: '12px' }}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </motion.button>

        {/* ✅ ADD TO CART BUTTON - Fixed animation */}
        <motion.button
          className="absolute bottom-0 left-0 right-0 py-2.5 bg-black/80 backdrop-blur-sm text-white text-sm font-medium transition-colors z-10 flex items-center justify-center gap-2 hover:bg-black"
          initial={{ y: '100%', opacity: 0 }}
          animate={{
            y: isHovered && !isOutOfStock ? '0%' : '100%',
            opacity: isHovered && !isOutOfStock ? 1 : 0
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(e);
          }}
          disabled={isOutOfStock || (hasMultipleSizes && !selectedSize)}
        >
          <ShoppingBag className="w-4 h-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
        {/* Product Name */}
        <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {Number(product.originalPrice) > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground -mt-1">
          Incl. {product.gst ?? 3}% GST
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">{product.rating}</span>
          </div>
        )}

        {/* Size Selector (Only for Rings) */}
        {hasMultipleSizes && !isOutOfStock && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSizeDropdown(!showSizeDropdown);
              }}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 hover:border-primary transition-colors flex items-center justify-between"
            >
              <span className={selectedSize ? 'text-gray-800' : 'text-gray-400'}>
                {selectedSize ? `Size: ${selectedSize}` : 'Select Ring Size'}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showSizeDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showSizeDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
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
                      className={`px-2 py-1.5 text-xs text-center rounded-md transition-colors ${selectedSize === size
                        ? 'bg-primary text-white'
                        : 'hover:bg-primary/10 text-gray-700'
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

        {hasOnlyFreeSize && !isOutOfStock && (
          <div className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
            Free Size
          </div>
        )}

        {!isRingProduct && !isOutOfStock && (
          <div className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
            Free Size
          </div>
        )}

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || (hasMultipleSizes && !selectedSize)}
          className={`w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${isOutOfStock || (hasMultipleSizes && !selectedSize)
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary/90'
            }`}
        >
          {isOutOfStock
            ? 'Out of Stock'
            : hasMultipleSizes && !selectedSize
              ? 'Select Size First'
              : 'Buy Now'}
        </button>
      </div>
    </motion.div>
  );
};