import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, RefreshCw, ChevronDown, Check, Star, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useNavigate } from 'react-router-dom';

import { isCoupleRingProduct, getCoupleRingPrices } from '@/utils/coupleRing';

// ============================================================
// NOTIFICATION COMPONENT
// ============================================================
const Notification = ({
  message,
  type = 'error',
  onClose
}: {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-[white] border-[#7a2a3e] text-[#612030]';
      case 'success':
        return 'bg-[white] border-[#7a2a3e] text-[#612030]';
      default:
        return 'bg-[white] border-[#7a2a3e] text-[#612030]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-6 right-6 z-[9999] px-5 py-2 rounded-lg shadow-xl max-w-sm border ${getStyles()} min-w-[280px]`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-medium leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================
// PRODUCT INTERFACE
// ============================================================
interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  purchasePrice: number;
  category: string;
  brand?: string;
  stock: number;
  description: string;
  images: string[];
  image?: string;
  mainImage?: { url: string; publicId: string };
  galleryImages?: { url: string; publicId: string; alt?: string }[];
  sku: string;
  tags: string[];
  status?: "Published" | "Draft" | "Archived";
  goldDetails?: {
    weight: number;
    purity: string;
    makingCharge: number;
  };
  coupleRing?: {
    womenPrice?: number;
    womenWeight?: number;
    menPrice?: number;
    menWeight?: number;
  };
  specifications?: {
    material?: string;
    finish?: string;
    hallmark?: string;
    certification?: string;
    ringSizes?: string[];
    gender?: string;
    occasion?: string;
    stoneType?: string;
    stoneWeight?: number;
    warranty?: string;
  };
  reviews?: {
    rating: number;
    count: number;
  };
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  gst?: number;
  // ⭐ ADD THESE - For passing ring sizes from parent
  ringSizes?: string[];
  isRingProduct?: boolean;
  ringOption?: string;
}

// ============================================================
// PRODUCT CARD INTERFACE
// ============================================================
interface ProductCardProps {
  product: Product;
  isExchangeMode?: boolean;
  onExchangeSelect?: (product: Product, selectedSize?: string) => void;
  isCurrentProduct?: boolean;
}

// ============================================================
// MATERIAL PARSER HELPER (Gold / Rose Gold)
// ============================================================
const getAvailableMaterials = (prod?: Product | null): string[] => {
  if (!prod) return ['Gold'];
  const raw = prod.specifications?.material || (prod as any).material || (prod as any).materials || '';
  if (Array.isArray(raw)) {
    const arr = raw.map(s => String(s).trim()).filter(Boolean);
    return arr.length > 0 ? arr : ['Gold'];
  }
  const str = String(raw).trim();
  if (!str) return ['Gold'];

  const hasRose = /rose\s*gold/i.test(str);
  const hasGold = /(^|[^a-zA-Z])gold([^a-zA-Z]|$)/i.test(str.replace(/rose\s*gold/gi, ''));

  if (hasRose && hasGold) {
    return ['Gold', 'Rose Gold'];
  } else if (hasRose) {
    return ['Rose Gold'];
  } else if (hasGold) {
    return ['Gold'];
  }
  return ['Gold'];
};

// ============================================================
// PRODUCT CARD COMPONENT
// ============================================================
export const ProductCard = ({
  product,
  isExchangeMode = false,
  onExchangeSelect,
  isCurrentProduct = false
}: ProductCardProps) => {
  // ============================================================
  // STATE DECLARATIONS
  // ============================================================
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [showMetalModal, setShowMetalModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cart' | 'wishlist' | 'buynow' | null>(null);

  // Couple Ring Modal specific states
  const [selectedCoupleOption, setSelectedCoupleOption] = useState<'Women’s Ring' | 'Men’s Ring' | 'Both Rings (Couple Set)'>('Both Rings (Couple Set)');
  const [selectedWomenSize, setSelectedWomenSize] = useState<string>('');
  const [selectedMenSize, setSelectedMenSize] = useState<string>('');
  const [coupleSizeError, setCoupleSizeError] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type?: 'error' | 'success' | 'info'
  } | null>(null);

  // ============================================================
  // STORE HOOKS
  // ============================================================
  const addToCart = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  // ============================================================
  // DERIVED STATE & COUPLE RING SUPPORT
  // ============================================================
  const inWishlist = isInWishlist(product.id || '');
  const isUnavailable = (product as any).isAvailableForOrder === false;
  const isOutOfStock = isUnavailable;

  const isCoupleRing = useMemo(() => isCoupleRingProduct(product), [product]);
  const couplePrices = useMemo(() => getCoupleRingPrices(product), [product]);
  const [selectedMetal, setSelectedMetal] = useState<string>('Gold');

  const productImage = product.images?.[0] || product.image || '/placeholder-image.jpg';
  const hoverImage = product.images?.[1] || product.images?.[0] || product.image || '/placeholder-image.jpg';

  // ============================================================
  // EFFECTS
  // ============================================================
  useEffect(() => {
    setCurrentImage(productImage);
  }, [productImage]);

  // ============================================================
  // PRODUCT TYPE CHECKERS - FIXED
  // ============================================================
  const isRingProduct = useMemo(() => {
    // Ring detection must come from category/explicit flag, NOT from size array.
    // This prevents Earrings/Necklaces with "Free Size" from being treated as rings.
    if (product.isRingProduct === true) return true;
    if (!product?.category) return false;

    const cat = product.category.toLowerCase().trim();
    if (cat.includes('earring')) return false;
    return cat === 'rings' || cat === 'ring' || cat.includes('ring') || isCoupleRing;
  }, [product, isCoupleRing]);

  const availableSizes = useMemo(() => {
    // 1) Exact sizes passed from CMS at top level
    if (Array.isArray(product.ringSizes) && product.ringSizes.length > 0) {
      return product.ringSizes;
    }

    // 2) Exact sizes inside specifications from CMS
    if (
      Array.isArray(product.specifications?.ringSizes) &&
      product.specifications.ringSizes.length > 0
    ) {
      return product.specifications.ringSizes;
    }

    // 3) No size configured in CMS -> show Free Size
    return ['Free Size'];
  }, [product]);

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

  const availableMaterials = useMemo(() => getAvailableMaterials(product), [product]);
  const hasMultipleMaterials = useMemo(() => availableMaterials.length > 1, [availableMaterials]);

  useEffect(() => {
    if (availableMaterials.length > 0) {
      setSelectedMetal(availableMaterials[0]);
    }
  }, [availableMaterials]);

  // ============================================================
  // HANDLER FUNCTIONS
  // ============================================================
  const executeAddToCart = (metal: string, ringOption?: string, customPrice?: number, customSize?: string) => {
    const sizeToPass = customSize !== undefined ? customSize : (isRingProduct ? selectedSize : undefined);
    const effectivePrice = customPrice !== undefined ? customPrice : product.price;
    const prodWithMat = { ...product, price: effectivePrice, material: metal, ringOption };
    addToCart(prodWithMat, sizeToPass, metal, ringOption);

    const details = [
      ringOption,
      metal,
      sizeToPass && sizeToPass !== 'Free Size' ? `Size ${sizeToPass}` : null
    ].filter(Boolean).join(' • ');

    if (details) {
      setNotification({ message: `${product.name} (${details}) added to cart`, type: 'success' });
    } else {
      setNotification({ message: `${product.name} added to cart`, type: 'success' });
    }
  };

  const executeAddToWishlist = (metal: string, ringOption?: string, customPrice?: number, customSize?: string) => {
    const productId = product._id || product.id;
    const sizeToPass = customSize !== undefined ? customSize : (isRingProduct ? selectedSize : undefined);
    const effectivePrice = customPrice !== undefined ? customPrice : product.price;
    const wishlistProduct = {
      id: productId || '',
      name: product.name,
      price: effectivePrice,
      image: currentImage || productImage,
      category: product.category,
      material: metal,
      ringOption: ringOption,
      availableMaterials: availableMaterials,
      originalPrice: product.purchasePrice,
      stock: product.stock,
      sku: product.sku,
      isRingProduct: isRingProduct,
      isCoupleRing: isCoupleRing,
      availableSizes: isRingProduct ? availableSizes : undefined,
      selectedSize: sizeToPass
    };

    addToWishlist(wishlistProduct, sizeToPass, metal, ringOption);

    const details = [
      ringOption,
      metal,
      sizeToPass && sizeToPass !== 'Free Size' ? `Size ${sizeToPass}` : null
    ].filter(Boolean).join(' • ');

    if (details) {
      setNotification({ message: `${product.name} (${details}) added to wishlist`, type: 'success' });
    } else {
      setNotification({ message: `${product.name} added to wishlist`, type: 'success' });
    }
  };

  const executeBuyNow = (metal: string, ringOption?: string, customPrice?: number, customSize?: string) => {
    const sizeToPass = customSize !== undefined ? customSize : (isRingProduct ? selectedSize : undefined);
    const productId = product._id || product.id;
    const effectivePrice = customPrice !== undefined ? customPrice : product.price;

    const buyNowProduct = {
      product: {
        id: productId,
        name: product.name,
        price: effectivePrice,
        image: currentImage || productImage,
        category: product.category,
        material: metal,
        ringOption: ringOption,
        sku: product.sku,
        stock: product.stock,
        gst: product.gst ?? 3
      },
      quantity: 1,
      size: sizeToPass,
      material: metal,
      ringOption: ringOption,
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

  const handleMetalSelect = (metal: string) => {
    setShowMetalModal(false);
    if (pendingAction === 'cart') {
      executeAddToCart(metal);
    } else if (pendingAction === 'wishlist') {
      executeAddToWishlist(metal);
    } else if (pendingAction === 'buynow') {
      executeBuyNow(metal);
    }
    setPendingAction(null);
  };

  const handleCoupleModalConfirm = () => {
    const chosenMetal = selectedMetal || availableMaterials[0] || 'Gold';
    let chosenPrice = couplePrices.bothPrice;
    let finalSize = 'Free Size';

    if (selectedCoupleOption === 'Women’s Ring') {
      chosenPrice = couplePrices.womenPrice;
      if (hasMultipleSizes && !selectedWomenSize) {
        setCoupleSizeError(true);
        setNotification({ message: 'Please select Women’s ring size', type: 'error' });
        return;
      }
      finalSize = selectedWomenSize ? `Size ${selectedWomenSize}` : 'Free Size';
    } else if (selectedCoupleOption === 'Men’s Ring') {
      chosenPrice = couplePrices.menPrice;
      if (hasMultipleSizes && !selectedMenSize) {
        setCoupleSizeError(true);
        setNotification({ message: 'Please select Men’s ring size', type: 'error' });
        return;
      }
      finalSize = selectedMenSize ? `Size ${selectedMenSize}` : 'Free Size';
    } else {
      // Both Rings (Couple Set)
      chosenPrice = couplePrices.bothPrice;
      if (hasMultipleSizes && (!selectedWomenSize || !selectedMenSize)) {
        setCoupleSizeError(true);
        setNotification({ message: 'Please select both Women and Men ring sizes', type: 'error' });
        return;
      }
      if (selectedWomenSize && selectedMenSize) {
        finalSize = `Women: Size ${selectedWomenSize}, Men: Size ${selectedMenSize}`;
      } else if (selectedWomenSize) {
        finalSize = `Women: Size ${selectedWomenSize}`;
      } else if (selectedMenSize) {
        finalSize = `Men: Size ${selectedMenSize}`;
      } else {
        finalSize = 'Free Size';
      }
    }

    setCoupleSizeError(false);
    setShowMetalModal(false);

    if (pendingAction === 'cart') {
      executeAddToCart(chosenMetal, selectedCoupleOption, chosenPrice, finalSize);
    } else if (pendingAction === 'wishlist') {
      executeAddToWishlist(chosenMetal, selectedCoupleOption, chosenPrice, finalSize);
    } else if (pendingAction === 'buynow') {
      executeBuyNow(chosenMetal, selectedCoupleOption, chosenPrice, finalSize);
    }
    setPendingAction(null);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If couple ring -> always show selection popup to choose ring and sizes
    if (isCoupleRing) {
      setPendingAction('cart');
      setShowMetalModal(true);
      return;
    }

    if (isRingProduct && !selectedSize) {
      setNotification({ message: 'Please select a ring size first', type: 'error' });
      setShowSizeDropdown(true);
      return;
    }

    // If both Gold & Rose Gold are available -> show small popup
    if (hasMultipleMaterials) {
      setPendingAction('cart');
      setShowMetalModal(true);
      return;
    }

    // Single metal -> add directly
    executeAddToCart(availableMaterials[0] || 'Gold');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If couple ring -> always show selection popup to choose ring and sizes
    if (isCoupleRing) {
      setPendingAction('buynow');
      setShowMetalModal(true);
      return;
    }

    if (isRingProduct && !selectedSize) {
      setNotification({ message: 'Please select a ring size first', type: 'error' });
      setShowSizeDropdown(true);
      return;
    }

    // If both Gold & Rose Gold are available -> show small popup
    if (hasMultipleMaterials) {
      setPendingAction('buynow');
      setShowMetalModal(true);
      return;
    }

    // Single metal -> proceed directly
    executeBuyNow(availableMaterials[0] || 'Gold');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    const productId = product._id || product.id;

    if (inWishlist) {
      removeFromWishlist(productId || '');
      setNotification({ message: 'Removed from wishlist', type: 'success' });
      return;
    }

    // If couple ring -> always show selection popup
    if (isCoupleRing) {
      setPendingAction('wishlist');
      setShowMetalModal(true);
      return;
    }

    if (isRingProduct && !selectedSize) {
      setNotification({ message: 'Please select a ring size first', type: 'error' });
      setShowSizeDropdown(true);
      return;
    }

    // If both Gold & Rose Gold are available -> show small popup
    if (hasMultipleMaterials) {
      setPendingAction('wishlist');
      setShowMetalModal(true);
      return;
    }

    // Single metal -> add directly
    executeAddToWishlist(availableMaterials[0] || 'Gold');
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
      setNotification({ message: 'Please select a ring size first', type: 'error' });
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

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizeDropdown(false);
    setNotification({ message: `Size ${size} selected`, type: 'success' });
  };

  // ============================================================
  // EXCHANGE MODE RENDER
  // ============================================================
  if (isExchangeMode) {
    return (
      <>
        <motion.div
          className="group product-card relative cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-visible"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* ========== IMAGE SECTION ========== */}
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

          {/* ========== CONTENT SECTION ========== */}
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

            {/* ==========================================================
                EXCHANGE MODE - SIZE SELECTOR
                ========================================================== */}
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
                {/* ===== EXCHANGE MODE - DROPDOWN ===== */}
                {showSizeDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="grid grid-cols-4 gap-1 p-1.5">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSizeSelect(size);
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

        <AnimatePresence>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // ============================================================
  // REGULAR MODE RENDER
  // ============================================================
  return (
    <>
      <motion.div
        className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary/30"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* ========== IMAGE SECTION ========== */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-lg">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />

          {/* Currently Unavailable Badge */}
          {isUnavailable && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10 uppercase">
              Currently Unavailable
            </span>
          )}

          {/* SALE Badge */}
          {Number(product.originalPrice) > 0 && (
            <span className={`absolute bg-primary text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10 ${isUnavailable ? 'top-8' : 'top-2'
              } left-2`}>
              SALE
            </span>
          )}

          {/* Wishlist Button */}
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

          {/* Add to Cart Button */}
          <motion.button
            className="absolute bottom-0 left-0 right-0 py-2.5 bg-black/80 backdrop-blur-sm text-white text-sm font-medium transition-colors z-10 flex items-center justify-center gap-2 hover:bg-black"
            initial={{ y: '100%', opacity: 0 }}
            animate={{
              y: isHovered && !isUnavailable ? '0%' : '100%',
              opacity: isHovered && !isUnavailable ? 1 : 0
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e);
            }}
            disabled={isUnavailable}
          >
            <ShoppingBag className="w-4 h-4" />
            {isUnavailable ? 'Currently Unavailable' : 'Add to Cart'}
          </motion.button>
        </div>

        {/* ========== CONTENT SECTION ========== */}
        <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
          {/* Product Name */}
          <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          {isCoupleRing ? (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-bold text-primary">
                  {formatPrice(couplePrices.bothPrice)}
                </span>
                <span className="text-[10px] sm:text-xs text-primary font-semibold px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                  Couple Set
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium">
                <span>Women: <strong className="text-gray-900">{formatPrice(couplePrices.womenPrice)}</strong></span>
                <span>•</span>
                <span>Men: <strong className="text-gray-900">{formatPrice(couplePrices.menPrice)}</strong></span>
              </div>
            </div>
          ) : (
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
          )}
          <p className="text-xs text-black/70 -mt-1">
            + {product.gst ?? 3}% GST extra
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{product.rating}</span>
            </div>
          )}

          {/* ==========================================================
              REGULAR MODE - SIZE SELECTOR (Hidden for Couple Rings)
              ========================================================== */}
          {!isCoupleRing && hasMultipleSizes && !isOutOfStock && (
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
              {/* ===== REGULAR MODE - DROPDOWN ===== */}
              {showSizeDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSizeSelect(size);
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

          {!isCoupleRing && hasOnlyFreeSize && !isOutOfStock && (
            <div className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
              Free Size
            </div>
          )}

          {!isCoupleRing && !isRingProduct && !isOutOfStock && (
            <div className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
              Free Size
            </div>
          )}

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={isUnavailable}
            className={`w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${isUnavailable
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : !isCoupleRing && isRingProduct && !selectedSize
                ? 'bg-[#612030] text-white hover:bg-[#4a1824]'
                : 'bg-primary text-white hover:bg-primary/90'
              }`}
          >
            {isUnavailable
              ? 'Currently Unavailable'
              : !isCoupleRing && isRingProduct && !selectedSize
                ? 'SELECT SIZE FIRST'
                : 'Buy Now'}
          </button>
        </div>
      </motion.div>

      {/* ========== SELECTION MODAL (COUPLE RING OR METAL) ========== */}
      <AnimatePresence>
        {showMetalModal && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowMetalModal(false);
              setPendingAction(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-gray-100 text-left max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900">
                    {isCoupleRing ? 'Choose Your Ring & Sizes' : 'Select Metal'}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.name}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMetalModal(false);
                    setPendingAction(null);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isCoupleRing ? (
                <div className="space-y-4 mt-3">
                  {/* 1. Metal choice for Couple Ring if multiple metals available */}
                  {hasMultipleMaterials && (
                    <div className="pb-3 border-b border-gray-100">
                      <p className="text-xs text-gray-700 font-bold mb-2">1. Select Metal:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {availableMaterials.map((mat) => {
                          const isSelected = selectedMetal === mat;
                          const isGold = !mat.toLowerCase().includes('rose');
                          return (
                            <button
                              key={mat}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMetal(mat);
                              }}
                              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${isSelected
                                  ? isGold
                                    ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/30'
                                    : 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/30'
                                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                              <span
                                className={`w-3 h-3 rounded-full ${isGold ? 'bg-amber-400 border border-amber-600' : 'bg-rose-400 border border-rose-500'
                                  }`}
                              />
                              <span>{mat}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Choose Ring Option */}
                  <div>
                    <p className="text-xs text-gray-700 font-bold mb-2">
                      {hasMultipleMaterials ? '2. ' : '1. '}Choose Your Ring Option:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {/* Women's Ring Option */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCoupleOption('Women’s Ring');
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${selectedCoupleOption === 'Women’s Ring'
                            ? 'border-amber-500 bg-amber-50/90 shadow-sm ring-1 ring-amber-500/30'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-bold text-xs">
                            ♀
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-900 block">
                              Women’s Ring
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">Single Ring</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-primary block">
                            {formatPrice(couplePrices.womenPrice)}
                          </span>
                          {selectedCoupleOption === 'Women’s Ring' && (
                            <span className="text-[10px] text-amber-800 font-bold bg-amber-200/70 px-1.5 py-0.2 rounded-full">Selected</span>
                          )}
                        </div>
                      </button>

                      {/* Men's Ring Option */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCoupleOption('Men’s Ring');
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${selectedCoupleOption === 'Men’s Ring'
                            ? 'border-blue-500 bg-blue-50/90 shadow-sm ring-1 ring-blue-500/30'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-900 font-bold text-xs">
                            ♂
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-900 block">
                              Men’s Ring
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">Single Ring</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-primary block">
                            {formatPrice(couplePrices.menPrice)}
                          </span>
                          {selectedCoupleOption === 'Men’s Ring' && (
                            <span className="text-[10px] text-blue-800 font-bold bg-blue-200/70 px-1.5 py-0.2 rounded-full">Selected</span>
                          )}
                        </div>
                      </button>

                      {/* Both Rings (Couple Set) Option */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCoupleOption('Both Rings (Couple Set)');
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${selectedCoupleOption === 'Both Rings (Couple Set)'
                            ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            ✨
                          </div>
                          <div>
                            <span className="text-sm font-extrabold text-gray-900 block">
                              Both Rings (Couple Set)
                            </span>
                            <span className="text-[11px] text-primary font-bold">Complete Pair</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm sm:text-base font-extrabold text-primary block">
                            {formatPrice(couplePrices.bothPrice)}
                          </span>
                          {selectedCoupleOption === 'Both Rings (Couple Set)' && (
                            <span className="text-[10px] text-primary font-bold bg-primary/20 px-1.5 py-0.2 rounded-full">Selected</span>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 3. Size Selection inside Popup */}
                  {hasMultipleSizes && (
                    <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-3">
                      {selectedCoupleOption === 'Women’s Ring' && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                              <span>Women’s Ring Size (♀)</span>
                              <span className="text-red-600">*</span>
                            </label>
                            {selectedWomenSize ? (
                              <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                Size {selectedWomenSize}
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 font-bold">Select Size</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {availableSizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedWomenSize(size);
                                }}
                                className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-all ${selectedWomenSize === size
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs scale-105'
                                    : 'bg-white text-gray-800 border-gray-300 hover:border-amber-500'
                                  }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedCoupleOption === 'Men’s Ring' && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                              <span>Men’s Ring Size (♂)</span>
                              <span className="text-red-600">*</span>
                            </label>
                            {selectedMenSize ? (
                              <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                Size {selectedMenSize}
                              </span>
                            ) : (
                              <span className="text-[10px] text-blue-700 font-bold">Select Size</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {availableSizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMenSize(size);
                                }}
                                className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-all ${selectedMenSize === size
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105'
                                    : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500'
                                  }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedCoupleOption === 'Both Rings (Couple Set)' && (
                        <div className="space-y-3">
                          {/* Women Size Row */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-amber-900 flex items-center gap-1">
                                <span>1. Women’s Ring Size (♀)</span>
                                <span className="text-red-600">*</span>
                              </label>
                              {selectedWomenSize ? (
                                <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                  Size {selectedWomenSize}
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-700 font-bold">Select Size</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {availableSizes.map((size) => (
                                <button
                                  key={`women-${size}`}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedWomenSize(size);
                                  }}
                                  className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-all ${selectedWomenSize === size
                                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs scale-105'
                                      : 'bg-white text-gray-800 border-gray-300 hover:border-amber-500'
                                    }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Men Size Row */}
                          <div className="pt-2 border-t border-gray-200/80">
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-blue-900 flex items-center gap-1">
                                <span>2. Men’s Ring Size (♂)</span>
                                <span className="text-red-600">*</span>
                              </label>
                              {selectedMenSize ? (
                                <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                  Size {selectedMenSize}
                                </span>
                              ) : (
                                <span className="text-[10px] text-blue-700 font-bold">Select Size</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {availableSizes.map((size) => (
                                <button
                                  key={`men-${size}`}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMenSize(size);
                                  }}
                                  className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-all ${selectedMenSize === size
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105'
                                      : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500'
                                    }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. Action Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCoupleModalConfirm();
                    }}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>
                      {pendingAction === 'buynow'
                        ? 'Proceed to Checkout'
                        : pendingAction === 'wishlist'
                          ? 'Save to Wishlist'
                          : 'Add to Cart'}
                    </span>
                    <span>•</span>
                    <span>
                      {formatPrice(
                        selectedCoupleOption === 'Women’s Ring'
                          ? couplePrices.womenPrice
                          : selectedCoupleOption === 'Men’s Ring'
                            ? couplePrices.menPrice
                            : couplePrices.bothPrice
                      )}
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-600 mt-3 mb-3 font-medium">
                    Choose your preferred metal to immediately {pendingAction === 'wishlist' ? 'save to wishlist' : pendingAction === 'buynow' ? 'proceed to checkout' : 'add to cart'}:
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Gold Option */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMetalSelect('Gold');
                      }}
                      className="group/btn relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/80 to-amber-100/40 hover:border-amber-500 hover:bg-amber-100/70 hover:shadow-md transition-all text-center active:scale-95 cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-500 shadow-sm flex items-center justify-center mb-2 group-hover/btn:scale-110 transition-transform">
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-100/60" />
                      </div>
                      <span className="text-sm font-bold text-amber-950">Gold</span>
                      <span className="text-[10px] text-amber-700 font-medium mt-0.5">Classic Gold</span>
                    </button>

                    {/* Rose Gold Option */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMetalSelect('Rose Gold');
                      }}
                      className="group/btn relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-rose-300 bg-gradient-to-b from-rose-50/80 to-rose-100/40 hover:border-rose-500 hover:bg-rose-100/70 hover:shadow-md transition-all text-center active:scale-95 cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-300 via-rose-400 to-pink-500 border border-rose-400 shadow-sm flex items-center justify-center mb-2 group-hover/btn:scale-110 transition-transform">
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-100/60" />
                      </div>
                      <span className="text-sm font-bold text-rose-950">Rose Gold</span>
                      <span className="text-[10px] text-rose-700 font-medium mt-0.5">Pink Gold</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};