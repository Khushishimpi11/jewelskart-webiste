import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, RefreshCw, ChevronDown, Check, Star, X, CheckCircle } from 'lucide-react';
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
    purity?: string;
  };
  reviews?: {
    rating: number;
    count: number;
  };
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  gst?: number;
  ringSizes?: string[];
  isRingProduct?: boolean;
  ringOption?: string;
  isCoupleRing?: boolean; // Add this field
}

// ============================================================
// PRODUCT CARD INTERFACE
// ============================================================
interface ProductCardProps {
  product: Product;
  isExchangeMode?: boolean;
  onExchangeSelect?: (product: Product, selectedSize?: string, selectedMetal?: string, selectedRingOption?: string) => void;
  isCurrentProduct?: boolean;
}

// ============================================================
// MATERIAL PARSER HELPER
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
// HELPER: Get Gold Purity & Stone Info from CMS
// ============================================================

// Maps raw CMS stoneType values → display labels
const getStoneLabel = (raw?: string | null): string => {
  if (!raw) return '';
  const s = String(raw).toLowerCase().trim();
  if (s === 'diamond') return 'Diamond';
  if (s === 'semi_precious' || s === 'semiprecious' || s === 'semi precious' || s === 'semi-precious') return 'Semi Precious Stone';
  if (s === 'both') return 'Diamond & Semi Precious';
  return '';
};

// Returns true if the value explicitly means "no stone" or is empty
const isExplicitNoStone = (v?: string | null): boolean => {
  if (v === undefined || v === null) return true;
  const s = String(v).toLowerCase().trim();
  return s === '' || s === 'none' || s === 'no stone' || s === 'no' || s === 'false' || s === 'null' || s === 'undefined';
};

const getProductMeta = (product: Product) => {
  // ── 1. Purity ──────────────────────────────────────────────
  let rawPurity = '';
  if (product.goldDetails?.purity) {
    rawPurity = String(product.goldDetails.purity).trim();
  } else if (product.specifications?.purity) {
    rawPurity = String(product.specifications.purity).trim();
  } else if ((product as any).purity) {
    rawPurity = String((product as any).purity).trim();
  }

  // Format: "18K" → "18K Gold", "9K" → "9K Gold", "18K Gold" → unchanged
  let formattedPurity = '';
  if (rawPurity) {
    formattedPurity = rawPurity.toLowerCase().includes('gold')
      ? rawPurity
      : `${rawPurity} Gold`;
  }

  // ── 2. Stone label — ONLY from explicit CMS fields ────────
  let stoneLabel = '';
  const isCouple = (product as any).isCoupleRing === true || Boolean(product.coupleRing) || (product.category && product.category.toLowerCase().includes('couple'));

  if (isCouple && product.coupleRing) {
    const cr = product.coupleRing as any;
    const spec = (product.specifications || {}) as any;
    const specStoneType = String(spec.stoneType || '').toLowerCase().trim();

    if (specStoneType === 'none') {
      stoneLabel = '';
    } else {
      const hasWD = (!isExplicitNoStone(cr.womenDiamond) && String(cr.womenDiamond || '').trim().toLowerCase() === 'diamond') ||
                    (!isExplicitNoStone(spec.womenDiamond) && String(spec.womenDiamond || '').trim().toLowerCase() === 'diamond');
      const hasMD = (!isExplicitNoStone(cr.menDiamond) && String(cr.menDiamond || '').trim().toLowerCase() === 'diamond') ||
                    (!isExplicitNoStone(spec.menDiamond) && String(spec.menDiamond || '').trim().toLowerCase() === 'diamond');
      const hasWDWeight = Number(cr.womenDiamondWeight) > 0 || Number(spec.womenDiamondWeight) > 0;
      const hasMDWeight = Number(cr.menDiamondWeight) > 0 || Number(spec.menDiamondWeight) > 0;
      const hasSpecDia = specStoneType === 'diamond' || specStoneType === 'both';
      const hasDia = hasWD || hasMD || hasWDWeight || hasMDWeight || hasSpecDia;

      const hasWSP = (!isExplicitNoStone(cr.womenSemiPreciousStone) && String(cr.womenSemiPreciousStone || '').trim() !== '') ||
                     (!isExplicitNoStone(spec.womenSemiPreciousStone) && String(spec.womenSemiPreciousStone || '').trim() !== '');
      const hasMSP = (!isExplicitNoStone(cr.menSemiPreciousStone) && String(cr.menSemiPreciousStone || '').trim() !== '') ||
                     (!isExplicitNoStone(spec.menSemiPreciousStone) && String(spec.menSemiPreciousStone || '').trim() !== '');
      const hasWSPWeight = Number(cr.womenSemiPreciousWeight) > 0 || Number(spec.womenSemiPreciousWeight) > 0;
      const hasMSPWeight = Number(cr.menSemiPreciousWeight) > 0 || Number(spec.menSemiPreciousWeight) > 0;
      const hasSpecSP = specStoneType === 'semi_precious' || specStoneType === 'both';
      const hasSP = hasWSP || hasMSP || hasWSPWeight || hasMSPWeight || hasSpecSP;

      if (hasDia && hasSP) {
        stoneLabel = 'Diamond & Semi Precious';
      } else if (hasDia) {
        stoneLabel = 'Diamond';
      } else if (hasSP) {
        stoneLabel = 'Semi Precious Stone';
      } else {
        stoneLabel = '';
      }
    }
  } else {
    // Standard (Single) Products
    // Logic:
    // 1. If stoneType is set and NOT "none" → use stoneType as the authority
    // 2. Always ALSO check individual diamond/semiPreciousStone fields
    //    This handles cases where stoneType="none" but diamond field was later filled in CMS
    const rawStoneType = product.specifications?.stoneType;
    const spec = (product.specifications || {}) as any;

    // Check explicit individual stone fields (always, regardless of stoneType)
    const hasDiaField = !isExplicitNoStone(spec.diamond) && String(spec.diamond || '').trim().toLowerCase() === 'diamond';
    const hasDiaWeight = Number(spec.diamondWeight) > 0;
    const hasSPField = !isExplicitNoStone(spec.semiPreciousStone) && String(spec.semiPreciousStone || '').trim() !== '';
    const hasSPWeight = Number(spec.semiPreciousWeight) > 0;

    if (rawStoneType !== undefined && rawStoneType !== null && String(rawStoneType).trim() !== '' && !isExplicitNoStone(rawStoneType)) {
      // stoneType dropdown has an explicit non-none value — use it as authority
      const fromDropdown = getStoneLabel(rawStoneType);
      if (fromDropdown) {
        stoneLabel = fromDropdown;
      } else {
        // dropdown value is unknown string — fall back to individual fields
        const hasDia = hasDiaField || hasDiaWeight;
        const hasSP = hasSPField || hasSPWeight;
        if (hasDia && hasSP) stoneLabel = 'Diamond & Semi Precious';
        else if (hasDia) stoneLabel = 'Diamond';
        else if (hasSP) stoneLabel = 'Semi Precious Stone';
      }
    } else {
      // stoneType is "none", missing, or empty → check individual fields
      // This is the generic fix: CMS individual fields override stoneType="none"
      const hasDia = hasDiaField || hasDiaWeight;
      const hasSP = hasSPField || hasSPWeight;
      if (hasDia && hasSP) stoneLabel = 'Diamond & Semi Precious';
      else if (hasDia) stoneLabel = 'Diamond';
      else if (hasSP) stoneLabel = 'Semi Precious Stone';
    }
  }

  // ── 3. Build meta string ───────────────────────────────────
  const metaParts: string[] = [];
  if (formattedPurity) metaParts.push(formattedPurity);
  if (stoneLabel) metaParts.push(stoneLabel);

  return {
    purity: formattedPurity,
    stoneLabel,
    hasDiamond: stoneLabel.toLowerCase().includes('diamond'),
    metaString: metaParts.join(' • ')
  };
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
  const [pendingAction, setPendingAction] = useState<'cart' | 'wishlist' | 'buynow' | 'exchange' | null>(null);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);

  const [ringSelectedSize, setRingSelectedSize] = useState<string>('');
  const [ringSelectedMetal, setRingSelectedMetal] = useState<string>('Gold');

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
  // DERIVED STATE
  // ============================================================
  const inWishlist = isInWishlist(product.id || '');
  const isUnavailable = (product as any).isAvailableForOrder === false;
  const isOutOfStock = isUnavailable;

  // Check for couple ring - check BOTH the utility function AND the product.isCoupleRing flag
  const isCoupleRing = useMemo(() => {
    // First check if product has isCoupleRing flag set to true
    if (product.isCoupleRing === true) return true;
    // Then check using the utility function
    return isCoupleRingProduct(product);
  }, [product]);

  const couplePrices = useMemo(() => getCoupleRingPrices(product), [product]);
  const [selectedMetal, setSelectedMetal] = useState<string>('Gold');

  const productImage = product.images?.[0] || product.image || '/placeholder-image.jpg';

  const productMeta = useMemo(() => getProductMeta(product), [product]);

  // ============================================================
  // EFFECTS
  // ============================================================
  useEffect(() => {
    setCurrentImage(productImage);
  }, [productImage]);

  // Debug log to check if couple ring is detected
  useEffect(() => {
    if (isCoupleRing) {
      console.log('✅ Couple Ring Detected:', product.name, product.isCoupleRing);
    }
  }, [isCoupleRing, product]);

  // ============================================================
  // PRODUCT TYPE CHECKERS
  // ============================================================
  const isRingProduct = useMemo(() => {
    if (product.isRingProduct === true) return true;
    if (!product?.category) return false;

    const cat = product.category.toLowerCase().trim();
    if (cat.includes('earring')) return false;
    return cat === 'rings' || cat === 'ring' || cat.includes('ring') || isCoupleRing;
  }, [product, isCoupleRing]);

  const availableSizes = useMemo(() => {
    if (Array.isArray(product.ringSizes) && product.ringSizes.length > 0) {
      return product.ringSizes;
    }
    if (
      Array.isArray(product.specifications?.ringSizes) &&
      product.specifications.ringSizes.length > 0
    ) {
      return product.specifications.ringSizes;
    }
    return ['Free Size'];
  }, [product]);

  const hasMultipleSizes = useMemo(() => {
    return isRingProduct && availableSizes.length > 1;
  }, [isRingProduct, availableSizes]);

  const availableMaterials = useMemo(() => getAvailableMaterials(product), [product]);
  const hasMultipleMaterials = useMemo(() => availableMaterials.length > 1, [availableMaterials]);

  useEffect(() => {
    if (availableMaterials.length > 0) {
      setSelectedMetal(availableMaterials[0]);
      setRingSelectedMetal(availableMaterials[0]);
    }
  }, [availableMaterials]);

  // ============================================================
  // ADD TO CART & WISHLIST ANIMATION
  // ============================================================
  const triggerAddAnimation = () => {
    setShowAddedAnimation(true);
    setTimeout(() => {
      setShowAddedAnimation(false);
    }, 1500);
  };

  // ============================================================
  // HANDLER FUNCTIONS
  // ============================================================
  const executeAddToCart = (metal: string, ringOption?: string, customPrice?: number, customSize?: string) => {
    const sizeToPass = customSize !== undefined ? customSize : (isRingProduct ? selectedSize : undefined);
    const effectivePrice = customPrice !== undefined ? customPrice : product.price;
    const prodWithMat = { ...product, price: effectivePrice, material: metal, ringOption };
    addToCart(prodWithMat, sizeToPass, metal, ringOption);

    triggerAddAnimation();

    const details = [
      ringOption,
      metal,
      sizeToPass && sizeToPass !== 'Free Size'
        ? (sizeToPass.includes('Women:') || sizeToPass.includes('Men:') || sizeToPass.startsWith('Size ') ? sizeToPass : `Size ${sizeToPass}`)
        : null
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

    triggerAddAnimation();

    const details = [
      ringOption,
      metal,
      sizeToPass && sizeToPass !== 'Free Size'
        ? (sizeToPass.includes('Women:') || sizeToPass.includes('Men:') || sizeToPass.startsWith('Size ') ? sizeToPass : `Size ${sizeToPass}`)
        : null
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

  // ============================================================
  // EXCHANGE HANDLER
  // ============================================================
  const executeExchange = (metal: string, ringOption?: string, customSize?: string) => {
    const sizeToPass = customSize !== undefined ? customSize : (isRingProduct ? selectedSize : undefined);
    if (onExchangeSelect && !isCurrentProduct && !isOutOfStock) {
      onExchangeSelect(product, sizeToPass, metal, ringOption);
      setNotification({ message: `${product.name} selected for exchange`, type: 'success' });
    }
  };

  // ============================================================
  // RING MODAL HANDLERS
  // ============================================================
  const handleRingModalConfirm = () => {
    const metal = ringSelectedMetal || availableMaterials[0] || 'Gold';
    const size = ringSelectedSize || 'Free Size';

    setShowMetalModal(false);

    if (pendingAction === 'cart') {
      executeAddToCart(metal, undefined, product.price, size);
    } else if (pendingAction === 'wishlist') {
      executeAddToWishlist(metal, undefined, product.price, size);
    } else if (pendingAction === 'buynow') {
      executeBuyNow(metal, undefined, product.price, size);
    } else if (pendingAction === 'exchange') {
      executeExchange(metal, undefined, size);
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
      finalSize = selectedWomenSize ? `Women: Size ${selectedWomenSize.replace(/^Size\s*/i, '').trim()}` : 'Free Size';
    } else if (selectedCoupleOption === 'Men’s Ring') {
      chosenPrice = couplePrices.menPrice;
      if (hasMultipleSizes && !selectedMenSize) {
        setCoupleSizeError(true);
        setNotification({ message: 'Please select Men’s ring size', type: 'error' });
        return;
      }
      finalSize = selectedMenSize ? `Men: Size ${selectedMenSize.replace(/^Size\s*/i, '').trim()}` : 'Free Size';
    } else {
      chosenPrice = couplePrices.bothPrice;
      if (hasMultipleSizes && (!selectedWomenSize || !selectedMenSize)) {
        setCoupleSizeError(true);
        setNotification({ message: 'Please select both Women and Men ring sizes', type: 'error' });
        return;
      }
      if (selectedWomenSize && selectedMenSize) {
        finalSize = `Women: Size ${selectedWomenSize.replace(/^Size\s*/i, '').trim()}, Men: Size ${selectedMenSize.replace(/^Size\s*/i, '').trim()}`;
      } else if (selectedWomenSize) {
        finalSize = `Women: Size ${selectedWomenSize.replace(/^Size\s*/i, '').trim()}`;
      } else if (selectedMenSize) {
        finalSize = `Men: Size ${selectedMenSize.replace(/^Size\s*/i, '').trim()}`;
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
    } else if (pendingAction === 'exchange') {
      executeExchange(chosenMetal, selectedCoupleOption, finalSize);
    }
    setPendingAction(null);
  };

  // ============================================================
  // MAIN HANDLERS
  // ============================================================
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isCoupleRing) {
      setPendingAction('cart');
      setShowMetalModal(true);
      return;
    }

    if (isRingProduct) {
      setPendingAction('cart');
      setShowMetalModal(true);
      return;
    }

    executeAddToCart(availableMaterials[0] || 'Gold');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isCoupleRing) {
      setPendingAction('buynow');
      setShowMetalModal(true);
      return;
    }

    if (isRingProduct) {
      setPendingAction('buynow');
      setShowMetalModal(true);
      return;
    }

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

    if (isCoupleRing) {
      setPendingAction('wishlist');
      setShowMetalModal(true);
      return;
    }

    if (isRingProduct) {
      setPendingAction('wishlist');
      setShowMetalModal(true);
      return;
    }

    triggerAddAnimation();
    executeAddToWishlist(availableMaterials[0] || 'Gold');
  };

  const handleCardClick = () => {
    if (isExchangeMode) return;
    navigate(`/product/${product.id}`);
  };

  const handleExchangeSelect = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If product is a couple ring, show popup
    if (isCoupleRing) {
      setPendingAction('exchange');
      setShowMetalModal(true);
      return;
    }

    // If product has multiple sizes/materials, show popup
    if (isRingProduct || hasMultipleMaterials) {
      setPendingAction('exchange');
      setShowMetalModal(true);
      return;
    }

    // For simple products without size/metal options
    if (onExchangeSelect && !isCurrentProduct && !isOutOfStock) {
      onExchangeSelect(product, undefined, availableMaterials[0] || 'Gold', undefined);
      setNotification({ message: `${product.name} selected for exchange`, type: 'success' });
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

  // ============================================================
  // EXCHANGE MODE RENDER - UPDATED TO MATCH REGULAR CARDS
  // ============================================================
  if (isExchangeMode) {
    return (
      <>
        <motion.div
          className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary/30 h-full flex flex-col overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* ========== IMAGE SECTION ========== */}
          <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
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
              <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10 uppercase">
                Out of Stock
              </span>
            )}

            {isCurrentProduct && (
              <span className="absolute top-2 right-2 bg-gray-600 text-white text-[10px] font-medium tracking-wider px-3 py-1 rounded-full z-10">
                CURRENT
              </span>
            )}

            {Number(product.originalPrice) > 0 && (
              <span className="absolute bg-primary text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10 top-2 left-2">
                SALE
              </span>
            )}

            {/* Couple Ring Badge */}
            {isCoupleRing && (
              <span className="absolute bottom-2 left-2 bg-primary/90 text-white text-[8px] sm:text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full z-10">
                COUPLE RING
              </span>
            )}
          </div>

          {/* ========== CONTENT SECTION ========== */}
          <div className="p-2 sm:p-3 lg:p-4 space-y-0.5 sm:space-y-1 flex flex-col flex-grow">
            {/* Category Badge */}
            <span className="text-[8px] sm:text-[10px] font-medium text-primary uppercase tracking-wider">
              {product.category || 'Product'}
            </span>

            {/* Product Name */}
            <h3 className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Product Meta */}
            {productMeta.metaString && (
              <span className="text-[10px] sm:text-xs font-medium text-gray-500 tracking-wide">
                {productMeta.metaString}
              </span>
            )}

            {/* Price - Handle Couple Ring separately */}
            {isCoupleRing ? (
              <>
                <div className="flex flex-wrap items-center gap-1 text-[9px] sm:text-[10px] lg:text-[11px] text-gray-600 font-medium">
                  <span>Women: <strong className="text-gray-900">{formatPrice(couplePrices.womenPrice)}</strong></span>
                  <span className="text-gray-300">•</span>
                  <span>Men: <strong className="text-gray-900">{formatPrice(couplePrices.menPrice)}</strong></span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-primary">
                    {formatPrice(couplePrices.bothPrice)}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-black/60">
                    + {product.gst ?? 3}% GST extra
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-0 mt-0.5 sm:mt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {Number(product.originalPrice) > 0 && (
                    <span className="text-[9px] sm:text-xs text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-[11px] text-black/60 mt-1">
                  + {product.gst ?? 3}% GST extra
                </p>
              </div>
            )}

            {/* Exchange Button */}
            <button
              onClick={handleExchangeSelect}
              disabled={isCurrentProduct || isOutOfStock}
              className={`w-full mt-1.5 sm:mt-2 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${isCurrentProduct || isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
                }`}
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {isCurrentProduct
                ? 'Current Product'
                : isOutOfStock
                  ? 'Out of Stock'
                  : 'Select for Exchange'}
            </button>
          </div>
        </motion.div>

        {/* ========== SELECTION MODAL FOR EXCHANGE ========== */}
        <AnimatePresence>
          {showMetalModal && pendingAction === 'exchange' && (
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
                      {isCoupleRing ? 'Select Couple Ring for Exchange' : 'Select Size & Metal for Exchange'}
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
                  // ========== COUPLE RING EXCHANGE MODAL ==========
                  <div className="space-y-4 mt-3">
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

                    <div>
                      <p className="text-xs text-gray-700 font-bold mb-2">
                        {hasMultipleMaterials ? '2. ' : '1. '}Choose Your Ring Option:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
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
                              <span className="text-sm font-bold text-gray-900 block">Women’s Ring</span>
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
                              <span className="text-sm font-bold text-gray-900 block">Men’s Ring</span>
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
                              <span className="text-sm font-extrabold text-gray-900 block">Both Rings (Couple Set)</span>
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

                    {hasMultipleSizes && (
                      <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-3">
                        {selectedCoupleOption === 'Women’s Ring' && (
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                                <span>Women’s Size (♀)</span>
                                <span className="text-red-600">*</span>
                              </label>
                              {selectedWomenSize ? (
                                <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                  {selectedWomenSize}
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-700 font-bold">Select</span>
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
                                <span>Men’s Size (♂)</span>
                                <span className="text-red-600">*</span>
                              </label>
                              {selectedMenSize ? (
                                <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                  {selectedMenSize}
                                </span>
                              ) : (
                                <span className="text-[10px] text-blue-700 font-bold">Select</span>
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
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-amber-900 flex items-center gap-1">
                                  <span>1. Women’s Size (♀)</span>
                                  <span className="text-red-600">*</span>
                                </label>
                                {selectedWomenSize ? (
                                  <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                    {selectedWomenSize}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-amber-700 font-bold">Select</span>
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

                            <div className="pt-2 border-t border-gray-200/80">
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-blue-900 flex items-center gap-1">
                                  <span>2. Men’s Size (♂)</span>
                                  <span className="text-red-600">*</span>
                                </label>
                                {selectedMenSize ? (
                                  <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                    {selectedMenSize}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-blue-700 font-bold">Select</span>
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

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCoupleModalConfirm();
                      }}
                      className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Confirm Exchange</span>
                    </button>
                  </div>
                ) : (
                  // ========== REGULAR RING MODAL FOR EXCHANGE ==========
                  <div className="space-y-4 mt-3">
                    {hasMultipleSizes && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                            <span>Select Ring Size</span>
                            <span className="text-red-600">*</span>
                          </label>
                          {ringSelectedSize ? (
                            <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                              {ringSelectedSize}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 font-bold">Select</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {availableSizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRingSelectedSize(size);
                              }}
                              className={`w-10 h-10 text-xs font-semibold rounded-lg border transition-all ${ringSelectedSize === size
                                ? 'bg-primary text-white border-primary shadow-xs scale-105'
                                : 'bg-white text-gray-800 border-gray-300 hover:border-primary'
                                }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {hasMultipleMaterials && (
                      <div className={hasMultipleSizes ? 'pt-3 border-t border-gray-100' : ''}>
                        <p className="text-xs text-gray-700 font-bold mb-2">Select Metal:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {availableMaterials.map((mat) => {
                            const isSelected = ringSelectedMetal === mat;
                            const isGold = !mat.toLowerCase().includes('rose');
                            return (
                              <button
                                key={mat}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRingSelectedMetal(mat);
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

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasMultipleSizes && !ringSelectedSize) {
                          setNotification({ message: 'Please select a ring size', type: 'error' });
                          return;
                        }
                        handleRingModalConfirm();
                      }}
                      className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Confirm Exchange</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
  // REGULAR MODE RENDER - MOBILE OPTIMIZED
  // ============================================================
  return (
    <>
      <motion.div
        className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary/30 h-full flex flex-col overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* ========== IMAGE SECTION ========== */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />

          {isUnavailable && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10 uppercase">
              Unavailable
            </span>
          )}

          {Number(product.originalPrice) > 0 && (
            <span className="absolute bg-primary text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10 top-2 left-2">
              SALE
            </span>
          )}

          {/* Couple Ring Badge */}
          {isCoupleRing && (
            <span className="absolute bottom-2 left-2 bg-primary/90 text-white text-[8px] sm:text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full z-10">
              COUPLE RING
            </span>
          )}

          {/* ADDED TO CART / WISHLIST OVERLAY - SAME ANIMATION FOR BOTH */}
          <AnimatePresence>
            {showAddedAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="bg-primary rounded-full p-4 shadow-2xl"
                >
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlistToggle}
            className={`absolute right-2 sm:right-3 p-2 rounded-full transition-all z-10 shadow-md ${inWishlist
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
            style={{ top: '8px' }}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Add to Cart Button */}
          <motion.button
            className="absolute bottom-0 left-0 right-0 py-2 sm:py-2.5 bg-black/80 backdrop-blur-sm text-white text-[11px] sm:text-sm font-medium transition-colors z-10 flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-black"
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
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {isUnavailable ? 'Unavailable' : 'Add to Cart'}
          </motion.button>
        </div>

        {/* ========== CONTENT SECTION ========== */}
        <div className="p-2 sm:p-3 lg:p-4 space-y-0.5 sm:space-y-1 flex flex-col flex-grow">
          {/* Category Badge */}
          <span className="text-[8px] sm:text-[10px] font-medium text-primary uppercase tracking-wider">
            {product.category || 'Product'}
          </span>

          {/* Product Name */}
          <h3 className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* ============================================================
              COUPLE RING - Women/Men prices UPAR, GST on RIGHT SIDE
              ============================================================ */}
          {isCoupleRing ? (
            <>
              {productMeta.metaString && (
                <span className="text-[10px] sm:text-xs font-medium text-gray-500 tracking-wide">
                  {productMeta.metaString}
                </span>
              )}

              <div className="flex flex-wrap items-center gap-1 text-[9px] sm:text-[10px] lg:text-[11px] text-gray-600 font-medium">
                <span>Women: <strong className="text-gray-900">{formatPrice(couplePrices.womenPrice)}</strong></span>
                <span className="text-gray-300">•</span>
                <span>Men: <strong className="text-gray-900">{formatPrice(couplePrices.menPrice)}</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-primary">
                  {formatPrice(couplePrices.bothPrice)}
                </span>
                <span className="text-[10px] sm:text-[11px] text-black/60">
                  + {product.gst ?? 3}% GST extra
                </span>
              </div>
            </>
          ) : (
            // ============================================================
            // REGULAR PRODUCTS - GST on NEXT LINE
            // ============================================================
            <>
              {productMeta.metaString && (
                <span className="text-[10px] sm:text-xs font-medium text-gray-500 tracking-wide">
                  {productMeta.metaString}
                </span>
              )}

              <div className="flex flex-col gap-0 mt-0.5 sm:mt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {Number(product.originalPrice) > 0 && (
                    <span className="text-[9px] sm:text-xs text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-[11px] text-black/60 mt-1">
                  + {product.gst ?? 3}% GST extra
                </p>
              </div>
            </>
          )}

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={isUnavailable}
            className={`w-full py-1.5 sm:py-2 lg:py-2.5 text-[11px] sm:text-xs lg:text-sm font-medium rounded-lg transition-all mt-1 sm:mt-1.5 ${isUnavailable
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
              }`}
          >
            {isUnavailable ? 'Currently Unavailable' : 'Buy Now'}
          </button>
        </div>
      </motion.div>

      {/* ========== SELECTION MODAL ========== */}
      <AnimatePresence>
        {showMetalModal && pendingAction !== 'exchange' && (
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
                    {isCoupleRing ? 'Choose Your Ring & Sizes' : 'Select Size & Metal'}
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

                  <div>
                    <p className="text-xs text-gray-700 font-bold mb-2">
                      {hasMultipleMaterials ? '2. ' : '1. '}Choose Your Ring Option:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
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

                  {hasMultipleSizes && (
                    <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-3">
                      {selectedCoupleOption === 'Women’s Ring' && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                              <span>Women’s Size (♀)</span>
                              <span className="text-red-600">*</span>
                            </label>
                            {selectedWomenSize ? (
                              <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                {selectedWomenSize}
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 font-bold">Select</span>
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
                              <span>Men’s Size (♂)</span>
                              <span className="text-red-600">*</span>
                            </label>
                            {selectedMenSize ? (
                              <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                {selectedMenSize}
                              </span>
                            ) : (
                              <span className="text-[10px] text-blue-700 font-bold">Select</span>
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
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-amber-900 flex items-center gap-1">
                                <span>1. Women’s Size (♀)</span>
                                <span className="text-red-600">*</span>
                              </label>
                              {selectedWomenSize ? (
                                <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                  {selectedWomenSize}
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-700 font-bold">Select</span>
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

                          <div className="pt-2 border-t border-gray-200/80">
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-blue-900 flex items-center gap-1">
                                <span>2. Men’s Size (♂)</span>
                                <span className="text-red-600">*</span>
                              </label>
                              {selectedMenSize ? (
                                <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                  {selectedMenSize}
                                </span>
                              ) : (
                                <span className="text-[10px] text-blue-700 font-bold">Select</span>
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
                // ========== REGULAR RING MODAL ==========
                <div className="space-y-4 mt-3">
                  {hasMultipleSizes && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                          <span>Select Ring Size</span>
                          <span className="text-red-600">*</span>
                        </label>
                        {ringSelectedSize ? (
                          <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                            {ringSelectedSize}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-bold">Select</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRingSelectedSize(size);
                            }}
                            className={`w-10 h-10 text-xs font-semibold rounded-lg border transition-all ${ringSelectedSize === size
                              ? 'bg-primary text-white border-primary shadow-xs scale-105'
                              : 'bg-white text-gray-800 border-gray-300 hover:border-primary'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasMultipleMaterials && (
                    <div className={hasMultipleSizes ? 'pt-3 border-t border-gray-100' : ''}>
                      <p className="text-xs text-gray-700 font-bold mb-2">Select Metal:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {availableMaterials.map((mat) => {
                          const isSelected = ringSelectedMetal === mat;
                          const isGold = !mat.toLowerCase().includes('rose');
                          return (
                            <button
                              key={mat}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRingSelectedMetal(mat);
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

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasMultipleSizes && !ringSelectedSize) {
                        setNotification({ message: 'Please select a ring size', type: 'error' });
                        return;
                      }
                      handleRingModalConfirm();
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
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
};