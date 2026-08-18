import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus, Check, Truck, RotateCcw, Shield, Award, Star, X, Loader2, Upload, Image as ImageIcon, Trash2, ThumbsUp, Calendar, User, MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductCard } from '@/components/ProductCard';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ========== YOUR CLOUDINARY CREDENTIALS ==========
const CLOUDINARY_CLOUD_NAME = "dkawppfwu";
const CLOUDINARY_UPLOAD_PRESET = "review_upload";

// ========== CLOUDINARY IMAGE INTERFACES ==========
interface CloudinaryImage {
  url: string;
  publicId: string;
}

interface GalleryImage {
  url: string;
  publicId: string;
  alt?: string;
}

interface ReviewImage {
  url: string;
  publicId: string;
  file?: File;
}

interface Review {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerLocation?: string;
  rating: number;
  comment: string;
  images?: ReviewImage[];
  productName: string;
  verifiedPurchase: boolean;
  helpful: number;
  isFeatured: boolean;
  createdAt: string;
}

import { isCoupleRingProduct, getCoupleRingPrices } from '@/utils/coupleRing';

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
  mainImage?: CloudinaryImage;
  galleryImages?: GalleryImage[];
  sku: string;
  tags: string[];
  status: "Published" | "Draft" | "Archived";
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
  careInstructions?: {
    instructions: string[];
  };
  additionalInfo?: {
    delivery?: string;
    returns?: string;
    payment?: string;
  };
  reviews?: {
    rating: number;
    count: number;
    distribution?: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  gst?: number;
  ringSizes?: string[];
  ringOption?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ========== FIXED HELPER FUNCTIONS FOR CLOUDINARY IMAGES ==========

// FIX 1: Get ALL unique product images - REMOVED DUPLICATES
const getAllProductImages = (product: Product): string[] => {
  const images: string[] = [];

  console.log('🖼️ Getting images for product:', product?.name || 'Unknown');

  // 1. Add main image if exists
  if (product?.mainImage?.url && product.mainImage.url !== '') {
    console.log('📸 Found main image:', product.mainImage.url);
    images.push(product.mainImage.url);
  }

  // 2. Add gallery images if exist
  if (product?.galleryImages && product.galleryImages.length > 0) {
    console.log('📸 Found gallery images:', product.galleryImages.length);
    product.galleryImages.forEach((img, index) => {
      if (img?.url && img.url !== '') {
        console.log(`📸 Gallery image ${index + 1}:`, img.url);
        images.push(img.url);
      }
    });
  }

  // 3. Add images array if exists (and not already added)
  if (product?.images && product.images.length > 0) {
    console.log('📸 Found images array:', product.images.length);
    product.images.forEach((img, index) => {
      if (img && img !== '') {
        // Check if already added (to avoid duplicates)
        if (!images.includes(img)) {
          console.log(`📸 Images array ${index + 1}:`, img);
          images.push(img);
        }
      }
    });
  }

  // 4. Remove duplicates using Set (keep first occurrence)
  const uniqueImages: string[] = [];
  const seen = new Set<string>();

  for (const img of images) {
    if (!seen.has(img)) {
      seen.add(img);
      uniqueImages.push(img);
    }
  }

  console.log(`✅ Total unique images: ${uniqueImages.length}`);
  console.log('📸 Final images list:', uniqueImages);

  // 5. If no images, return placeholder
  if (uniqueImages.length === 0) {
    console.log('⚠️ No images found, using placeholder');
    return ['/placeholder-image.jpg'];
  }

  return uniqueImages;
};

// FIX 2: Get product image with proper Cloudinary optimization
const getProductImageUrl = (product: Product, index: number = 0): string => {
  // Get all unique images first
  const allImages = getAllProductImages(product);

  console.log(`🔍 Getting image at index ${index}, total images: ${allImages.length}`);

  // If index is out of bounds, return first image or placeholder
  if (index >= allImages.length || index < 0) {
    console.log(`⚠️ Index ${index} out of bounds, using first image`);
    return allImages[0] || '/placeholder-image.jpg';
  }

  const imageUrl = allImages[index];
  console.log(`📸 Returning image ${index + 1}:`, imageUrl);

  return imageUrl || '/placeholder-image.jpg';
};

// ========== CLOUDINARY IMAGE UPLOAD FUNCTION ==========
const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'product_reviews');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  return data.secure_url;
};

// Indian cities list for dropdown (popular cities)
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
  'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
  'Lucknow', 'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra',
  'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan',
  'Thane', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad',
  'Amritsar', 'Navi Mumbai', 'Allahabad', 'Howrah', 'Ranchi',
  'Gwalior', 'Chandigarh', 'Coimbatore', 'Mysore', 'Noida'
];

// Helper to parse available Gold / Rose Gold materials saved from CMS
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

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedWomenSize, setSelectedWomenSize] = useState('');
  const [selectedMenSize, setSelectedMenSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedRingOption, setSelectedRingOption] = useState<'Women’s Ring' | 'Men’s Ring' | 'Both Rings (Couple Set)'>('Both Rings (Couple Set)');
  const [materialError, setMaterialError] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState({ rating: 0, count: 0, distribution: {} });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reviewData, setReviewData] = useState({
    name: '',
    email: '',
    location: '',
    rating: 5,
    comment: '',
    images: [] as { url: string; file: File }[]
  });

  const [isInCart, setIsInCart] = useState(false);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const cityInputRef = useRef<HTMLInputElement>(null);

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const cartItems = useCartStore((state) => state.items);

  // Filter cities based on search term
  const filteredCities = INDIAN_CITIES.filter(city =>
    city.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  // Get available materials for current product
  const availableMaterials = getAvailableMaterials(product);

  // Get selected size / material from navigation state or auto-select
  useEffect(() => {
    const passedSize = location.state?.selectedSize;
    if (passedSize) {
      setSelectedSize(passedSize);
    }
  }, [location.state]);

  // Handle material auto-selection or navigation state
  useEffect(() => {
    if (product) {
      const available = getAvailableMaterials(product);
      if (available.length === 1) {
        setSelectedMaterial(available[0]);
      } else if (available.length > 1) {
        const passedMaterial = location.state?.selectedMaterial;
        if (passedMaterial && available.includes(passedMaterial)) {
          setSelectedMaterial(passedMaterial);
        } else {
          setSelectedMaterial('');
        }
      }
      setMaterialError(false);
    }
  }, [product, location.state]);

  // Check if product is already in cart
  useEffect(() => {
    if (product) {
      const productId = product._id || product.id;
      const exists = cartItems.some((item) => item.product.id === productId);
      setIsInCart(exists);
    }
  }, [product, cartItems]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ========== FIXED fetchProduct ==========
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      const productData = data.product || data;

      console.log('📦 Product data received:', productData);

      // FIX: Get all unique images properly
      const allImages = getAllProductImages(productData);

      console.log('📸 All images found:', allImages.length);
      console.log('📸 Images list:', allImages);

      // Use exact sizes from CMS. If no size is configured, treat the product as Free Size.
      const cmsRingSizes =
        Array.isArray(productData.ringSizes) && productData.ringSizes.length > 0
          ? productData.ringSizes
          : Array.isArray(productData.specifications?.ringSizes) && productData.specifications.ringSizes.length > 0
            ? productData.specifications.ringSizes
            : ['Free Size'];

      const normalizedProduct = {
        ...productData,
        price: Number(productData.price),
        purchasePrice: Number(productData.purchasePrice),
        images: allImages,
        mainImage: productData.mainImage || { url: allImages[0] || '', publicId: '' },
        galleryImages: productData.galleryImages || [],
        ringSizes: cmsRingSizes,
        coupleRing: productData.coupleRing || productData.specifications?.coupleRing || undefined,
        specifications: {
          ...productData.specifications,
          ringSizes: cmsRingSizes
        }
      };

      console.log('✅ Normalized product images:', normalizedProduct.images);

      setProduct(normalizedProduct);
      setReviewStats(normalizedProduct.reviews || { rating: 0, count: 0, distribution: {} });
      await fetchRelatedProducts(productData.category);
      await fetchProductReviews();

    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch approved reviews for this product
  const fetchProductReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/product/${id}?limit=10`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
        if (data.stats) setReviewStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Mark review as helpful
  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, { method: 'PUT' });
      if (response.ok) {
        setReviews(prev => prev.map(r =>
          r._id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
        ));
        toast.success('Thanks for your feedback!');
      }
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  useEffect(() => {
    if (product) {
      const timer = setTimeout(() => {
        const priceContainer = document.querySelector('.price-container-fixed');
        if (priceContainer) {
          const walker = document.createTreeWalker(priceContainer, NodeFilter.SHOW_TEXT);
          const nodesToRemove: Text[] = [];
          while (walker.nextNode()) {
            const node = walker.currentNode as Text;
            if (node.textContent && node.textContent.trim() === '0') {
              nodesToRemove.push(node);
            }
          }
          nodesToRemove.forEach(node => {
            if (node.parentNode) {
              node.parentNode.removeChild(node);
            }
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [product]);

  // ========== FIXED fetchRelatedProducts ==========
  const fetchRelatedProducts = async (category: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();

      let productsArray = [];
      if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (Array.isArray(data)) {
        productsArray = data;
      } else {
        productsArray = [];
      }

      const related = productsArray
        .filter((p: Product) => p.category === category && p._id !== id && p.status === "Published")
        .slice(0, 4)
        .map((p: Product) => {
          // FIX: Use getAllProductImages for related products too
          const allImages = getAllProductImages(p);
          // Use exact CMS sizes; if no size is configured, show Free Size.
          const ringSizes =
            Array.isArray((p as any).ringSizes) && (p as any).ringSizes.length > 0
              ? (p as any).ringSizes
              : Array.isArray(p.specifications?.ringSizes) && p.specifications.ringSizes.length > 0
                ? p.specifications.ringSizes
                : ['Free Size'];

          return {
            ...p,
            price: Number(p.price),
            purchasePrice: Number(p.purchasePrice),
            images: allImages,
            mainImage: p.mainImage || { url: allImages[0] || '', publicId: '' },
            galleryImages: p.galleryImages || [],
            ringSizes,
            coupleRing: p.coupleRing || (p as any).specifications?.coupleRing || undefined,
            specifications: {
              ...p.specifications,
              ringSizes
            }
          };
        });

      setRelatedProducts(related);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (reviewData.images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed per review');
      return;
    }

    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));

    setReviewData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index: number) => {
    setReviewData(prev => {
      const newImages = [...prev.images];
      if (newImages[index].url.startsWith('blob:')) {
        URL.revokeObjectURL(newImages[index].url);
      }
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setReviewData(prev => ({ ...prev, location: city }));
    setCitySearchTerm('');
    setShowCitySearch(false);
  };

  // Handle review submit with image upload and location
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!reviewData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!reviewData.comment.trim()) {
      toast.error('Please enter your review');
      return;
    }

    setUploadingImages(true);

    try {
      // Upload images to Cloudinary
      const uploadedImages = [];
      for (const image of reviewData.images) {
        if (image.file) {
          const imageUrl = await uploadImageToCloudinary(image.file);
          uploadedImages.push({
            url: imageUrl,
            publicId: ''
          });
        }
      }

      // Submit review with location
      const reviewPayload = {
        productId: product?._id || product?.id,
        name: reviewData.name,
        email: reviewData.email,
        location: reviewData.location || '',
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: uploadedImages,
      };

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      // Clear form and show success
      setReviewData({
        name: '',
        email: '',
        location: '',
        rating: 5,
        comment: '',
        images: []
      });

      setShowReviewForm(false);
      setShowThankYouPopup(true);

      setTimeout(() => setShowThankYouPopup(false), 3000);
      toast.success('Review submitted! Awaiting admin approval.');

    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setUploadingImages(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-24">
          <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-24">
          <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
            <div className="text-center">
              <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
              <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
              <Link to="/shop" className="btn-gold inline-block">Back to Shop</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id || product.id || '');

  // FIX: Get all unique images
  const galleryImages = getAllProductImages(product);

  console.log('🖼️ Gallery images in component:', galleryImages);
  console.log('🖼️ Number of images:', galleryImages.length);

  const mainImageUrl = getProductImageUrl(product, activeImageIndex);

  const isCoupleRing = isCoupleRingProduct(product);
  const couplePrices = getCoupleRingPrices(product);

  const getEffectiveProductPrice = () => {
    if (!product) return 0;
    if (!isCoupleRing) return product.price;
    if (selectedRingOption === 'Women’s Ring') return couplePrices.womenPrice;
    if (selectedRingOption === 'Men’s Ring') return couplePrices.menPrice;
    return couplePrices.bothPrice;
  };

  const isRingProduct = () => {
    if (!product) return false;
    if (isCoupleRing) return true;
    let cat = '';
    if (typeof product.category === 'string') {
      cat = product.category;
    } else if (product.category && typeof product.category === 'object') {
      cat = (product.category as any).name || (product.category as any).categoryName || '';
    } else if ((product as any).categoryName) {
      cat = (product as any).categoryName;
    }

    const lowerCat = cat.toLowerCase().trim();
    if (lowerCat.includes('earring')) return false; // Earrings are NOT rings!

    const pName = (product.name || '').toLowerCase().trim();
    if (pName.includes('earring')) return false;

    return lowerCat === 'rings' || lowerCat === 'ring' || lowerCat.includes('ring') || pName.includes('ring');
  };

  const getRingSizes = () => {
    if (!product) return ['Free Size'];

    if (Array.isArray(product.ringSizes) && product.ringSizes.length > 0) {
      return product.ringSizes;
    }

    if (Array.isArray(product.specifications?.ringSizes) && product.specifications.ringSizes.length > 0) {
      return product.specifications.ringSizes;
    }

    return ['Free Size'];
  };

  // Ring size selection is required only when CMS has actual selectable sizes.
  // If the only size is "Free Size", hide the size section and allow checkout directly.
  const requiresRingSizeSelection = () => {
    if (!isRingProduct()) return false;

    const sizes = getRingSizes();
    return !(sizes.length === 1 && sizes[0] === 'Free Size');
  };

  // Material selection is required when both Gold and Rose Gold are available and none is selected.
  const requiresMaterialSelection = () => {
    const available = getAvailableMaterials(product);
    return available.length > 1 && !selectedMaterial;
  };

  const getEffectiveSize = () => {
    if (!isRingProduct()) return undefined;
    if (!requiresRingSizeSelection()) return 'Free Size';
    if (isCoupleRing) {
      if (selectedRingOption === 'Women’s Ring') return selectedWomenSize ? `Size ${selectedWomenSize}` : undefined;
      if (selectedRingOption === 'Men’s Ring') return selectedMenSize ? `Size ${selectedMenSize}` : undefined;
      if (selectedWomenSize && selectedMenSize) return `Women: Size ${selectedWomenSize}, Men: Size ${selectedMenSize}`;
      return undefined;
    }
    return selectedSize || undefined;
  };

  const getEffectiveMaterial = () => {
    if (selectedMaterial) return selectedMaterial;
    const available = getAvailableMaterials(product);
    if (available.length === 1) return available[0];
    return undefined;
  };

  // ========== UPDATED: Toggle size selection (click again to unselect) ==========
  const handleSizeToggle = (size: string) => {
    if (selectedSize === size) {
      setSelectedSize(''); // Unselect if already selected
      setSizeError(false);
    } else {
      setSelectedSize(size);
      setSizeError(false);
    }
  };

  const triggerSizeAlert = (customMsg?: string) => {
    setSizeError(true);
    setShowAlertModal(true);
    toast.error(customMsg || 'Please select a ring size first.', {
      duration: 4000,
      style: {
        background: '#612030',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '15px',
        border: '2px solid #b91c1c'
      }
    });
  };

  const triggerMaterialAlert = () => {
    setMaterialError(true);
    toast.error('Please select Gold or Rose Gold before proceeding.', {
      duration: 4000,
      style: {
        background: '#612030',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '15px',
        border: '2px solid #b91c1c'
      }
    });
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (requiresMaterialSelection()) {
      triggerMaterialAlert();
      return;
    }

    if (requiresRingSizeSelection()) {
      if (isCoupleRing) {
        if (selectedRingOption === 'Women’s Ring' && !selectedWomenSize) {
          triggerSizeAlert("Please select Women's ring size first");
          return;
        }
        if (selectedRingOption === 'Men’s Ring' && !selectedMenSize) {
          triggerSizeAlert("Please select Men's ring size first");
          return;
        }
        if (selectedRingOption === 'Both Rings (Couple Set)' && (!selectedWomenSize || !selectedMenSize)) {
          triggerSizeAlert("Please select both Women's and Men's ring sizes");
          return;
        }
      } else if (!selectedSize) {
        triggerSizeAlert("Please select a ring size first");
        return;
      }
    }

    setMaterialError(false);
    setSizeError(false);

    const effectiveMat = getEffectiveMaterial();
    const effectivePrice = getEffectiveProductPrice();
    const ringOpt = isCoupleRing ? selectedRingOption : undefined;

    const cartProduct = {
      id: product._id || product.id || '',
      name: product.name,
      price: effectivePrice,
      image: getProductImageUrl(product, 0),
      category: typeof product.category === 'string' ? product.category : (product.category as any)?.name || '',
      material: effectiveMat,
      ringOption: ringOpt,
      sku: product.sku,
      gst: product.gst ?? 3
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct, getEffectiveSize(), effectiveMat, ringOpt);
    }

    const effectiveSize = getEffectiveSize();
    const itemDetails = [
      ringOpt,
      effectiveMat,
      effectiveSize && effectiveSize !== 'Free Size' ? `Size ${effectiveSize}` : null
    ].filter(Boolean).join(', ');

    if (itemDetails) {
      toast.success(`Added ${quantity} ${product.name} (${itemDetails}) to cart`);
    } else {
      toast.success(`Added ${quantity} ${product.name} to cart`);
    }

    setIsInCart(true);
  };

  const handleWishlistToggle = () => {
    const productId = product._id || product.id || '';

    const effectiveMat = getEffectiveMaterial();
    const effectivePrice = getEffectiveProductPrice();
    const ringOpt = isCoupleRing ? selectedRingOption : undefined;

    const wishlistProduct = {
      id: productId,
      name: product.name,
      price: effectivePrice,
      image: getProductImageUrl(product, 0),
      category: typeof product.category === 'string' ? product.category : (product.category as any)?.name || '',
      material: effectiveMat,
      ringOption: ringOpt,
      originalPrice: product.purchasePrice,
      stock: product.stock,
      sku: product.sku,
      isRingProduct: isRingProduct(),
      isCoupleRing: isCoupleRing,
      availableSizes: isRingProduct() ? getRingSizes() : undefined,
      selectedSize: getEffectiveSize()
    };

    if (inWishlist) {
      removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } else {
      if (requiresMaterialSelection()) {
        triggerMaterialAlert();
        return;
      }
      if (requiresRingSizeSelection()) {
        if (isCoupleRing) {
          if (selectedRingOption === 'Women’s Ring' && !selectedWomenSize) {
            triggerSizeAlert("Please select Women's ring size first");
            return;
          }
          if (selectedRingOption === 'Men’s Ring' && !selectedMenSize) {
            triggerSizeAlert("Please select Men's ring size first");
            return;
          }
          if (selectedRingOption === 'Both Rings (Couple Set)' && (!selectedWomenSize || !selectedMenSize)) {
            triggerSizeAlert("Please select both Women's and Men's ring sizes");
            return;
          }
        } else if (!selectedSize) {
          triggerSizeAlert("Please select a ring size first");
          return;
        }
      }
      addToWishlist(wishlistProduct, getEffectiveSize(), effectiveMat, ringOpt);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleProceedToCheckout = () => {
    if (!product) return;
    const productId = product._id || product.id;

    if (requiresMaterialSelection()) {
      triggerMaterialAlert();
      return;
    }

    if (requiresRingSizeSelection()) {
      if (isCoupleRing) {
        if (selectedRingOption === 'Women’s Ring' && !selectedWomenSize) {
          triggerSizeAlert("Please select Women's ring size first");
          return;
        }
        if (selectedRingOption === 'Men’s Ring' && !selectedMenSize) {
          triggerSizeAlert("Please select Men's ring size first");
          return;
        }
        if (selectedRingOption === 'Both Rings (Couple Set)' && (!selectedWomenSize || !selectedMenSize)) {
          triggerSizeAlert("Please select both Women's and Men's ring sizes");
          return;
        }
      } else if (!selectedSize) {
        triggerSizeAlert("Please select a ring size first");
        return;
      }
    }

    setMaterialError(false);
    setSizeError(false);

    const effectiveMat = getEffectiveMaterial();
    const effectivePrice = getEffectiveProductPrice();
    const ringOpt = isCoupleRing ? selectedRingOption : undefined;

    const buyNowProduct = {
      product: {
        id: productId,
        name: product.name,
        price: effectivePrice,
        image: getProductImageUrl(product, 0),
        category: product.category,
        material: effectiveMat,
        ringOption: ringOpt,
        sku: product.sku,
        stock: product.stock,
        gst: product.gst ?? 3
      },
      quantity: quantity,
      size: getEffectiveSize(),
      material: effectiveMat,
      ringOption: ringOpt,
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

  const formatPrice = (price: number) => {
    const num = Math.round(Number(price));
    if (isNaN(num)) return '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const accordionSections = [
    {
      id: 'specifications',
      title: 'Specifications',
      content: (
        <div className="grid grid-cols-2 gap-4 text-sm">
          {product.specifications?.material && (
            <div>
              <p className="text-muted-foreground">Material</p>
              <p className="text-foreground font-medium">{product.specifications.material}</p>
            </div>
          )}
          {product.goldDetails?.purity && (
            <div>
              <p className="text-muted-foreground">Purity</p>
              <p className="text-foreground font-medium">{product.goldDetails.purity}</p>
            </div>
          )}
          {product.goldDetails?.weight && (
            <div>
              <p className="text-muted-foreground">Weight</p>
              <p className="text-foreground font-medium">{product.goldDetails.weight}g</p>
            </div>
          )}
          {product.specifications?.finish && (
            <div>
              <p className="text-muted-foreground">Finish</p>
              <p className="text-foreground font-medium">{product.specifications.finish}</p>
            </div>
          )}
          {product.specifications?.hallmark && (
            <div>
              <p className="text-muted-foreground">Hallmark</p>
              <p className="text-foreground font-medium">{product.specifications.hallmark}</p>
            </div>
          )}
          {product.specifications?.certification && (
            <div>
              <p className="text-muted-foreground">Certification</p>
              <p className="text-foreground font-medium">{product.specifications.certification}</p>
            </div>
          )}
          {product.specifications?.gender && (
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="text-foreground font-medium">{product.specifications.gender}</p>
            </div>
          )}
          {product.specifications?.occasion && (
            <div>
              <p className="text-muted-foreground">Occasion</p>
              <p className="text-foreground font-medium">{product.specifications.occasion}</p>
            </div>
          )}
          {product.specifications?.stoneType && product.specifications.stoneType !== "No Stone" && (
            <div>
              <p className="text-muted-foreground">Stone Type</p>
              <p className="text-foreground font-medium">{product.specifications.stoneType}</p>
            </div>
          )}
          {product.specifications?.stoneWeight && product.specifications.stoneWeight > 0 && (
            <div>
              <p className="text-muted-foreground">Stone Weight</p>
              <p className="text-foreground font-medium">{product.specifications.stoneWeight} ct</p>
            </div>
          )}
          {product.specifications?.warranty && (
            <div className="col-span-2">
              <p className="text-muted-foreground">Warranty</p>
              <p className="text-foreground font-medium">{product.specifications.warranty}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'care',
      title: 'Care Instructions',
      content: (
        <div className="space-y-2 text-sm">
          {product.careInstructions?.instructions && product.careInstructions.instructions.length > 0 ? (
            product.careInstructions.instructions.map((instruction, idx) => (
              <p key={idx} className="text-muted-foreground flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                {instruction}
              </p>
            ))
          ) : (
            <p className="text-muted-foreground">No care instructions available.</p>
          )}
        </div>
      ),
    },
    {
      id: 'additional',
      title: 'Additional Information',
      content: (
        <div className="space-y-3 text-sm">
          {product.additionalInfo?.delivery && (
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Delivery</p>
                <p className="text-muted-foreground">{product.additionalInfo.delivery}</p>
              </div>
            </div>
          )}
          {product.additionalInfo?.returns && (
            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Returns</p>
                <p className="text-muted-foreground">{product.additionalInfo.returns}</p>
              </div>
            </div>
          )}
          {product.additionalInfo?.payment && (
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Payment</p>
                <p className="text-muted-foreground">{product.additionalInfo.payment}</p>
              </div>
            </div>
          )}
          {product.sku && (
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">SKU</p>
                <p className="text-muted-foreground font-mono text-xs">{product.sku}</p>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'reviews',
      title: `Customer Reviews (${reviewStats.count || 0})`,
      content: (
        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{reviewStats.rating || 0}</div>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= (reviewStats.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">{reviewStats.count || 0} reviews</div>
            </div>

            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-lg">
                        {review.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {review.customerLocation && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {review.customerLocation}
                              </span>
                            )}
                            {review.verifiedPurchase && (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">Verified</span>
                            )}
                            {review.isFeatured && (
                              <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded">Featured</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mt-2 text-sm leading-relaxed">{review.comment}</p>

                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {review.images.slice(0, 3).map((img, idx) => (
                            <img
                              key={idx}
                              src={img.url}
                              alt={`Review ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => window.open(img.url, '_blank')}
                            />
                          ))}
                          {review.images.length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                              +{review.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => handleHelpful(review._id)}
                        className="flex items-center gap-1 text-xs text-gray-500 mt-3 hover:text-primary transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        Helpful ({review.helpful || 0})
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No reviews yet.</p>
                <p className="text-sm mt-1">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowReviewForm(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-4 border-b">
                    <h3 className="font-display text-xl text-foreground">Write a Review</h3>
                    <button onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewData.name}
                        onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:border-primary outline-none"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={reviewData.email}
                        onChange={(e) => setReviewData({ ...reviewData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:border-primary outline-none"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Location/City Field */}
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Your City <span className="text-gray-400 text-xs">(Optional)</span></label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          ref={cityInputRef}
                          type="text"
                          value={reviewData.location}
                          onChange={(e) => {
                            setReviewData({ ...reviewData, location: e.target.value });
                            setCitySearchTerm(e.target.value);
                            setShowCitySearch(true);
                          }}
                          onFocus={() => setShowCitySearch(true)}
                          className="w-full pl-10 pr-3 py-2 border rounded-md focus:border-primary outline-none"
                          placeholder="Enter your city (e.g., Mumbai, Delhi, Bangalore)"
                        />
                      </div>

                      {/* City Search Dropdown */}
                      {showCitySearch && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => handleCitySelect(city)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                              >
                                {city}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No cities found. Type your city name.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Rating *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${star <= reviewData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Upload Images (Optional, max 5)</label>
                      <div className="mt-2">
                        {reviewData.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            {reviewData.images.map((img, idx) => (
                              <div key={idx} className="relative group">
                                <img src={img.url} alt={`Review ${idx + 1}`} className="w-full h-24 object-cover rounded border" />
                                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {reviewData.images.length < 5 && (
                          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload images</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB each</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Review *</label>
                      <textarea required rows={4} value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })} className="w-full px-3 py-2 border rounded-md focus:border-primary outline-none resize-none" placeholder="Share your thoughts about this product..." />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="submit" disabled={uploadingImages} className="flex-1 bg-primary text-white py-2.5 rounded-md font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                        {uploadingImages && <Loader2 className="w-4 h-4 animate-spin" />}
                        {uploadingImages ? 'Uploading...' : 'Submit Review'}
                      </button>
                      <button type="button" onClick={() => setShowReviewForm(false)} className="flex-1 border rounded-md py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Thank You Popup */}
      <AnimatePresence>
        {showThankYouPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-primary rounded-lg shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-2xl text-white mb-2">Thank You!</h3>
              <p className="text-white/90 mb-6">Your review has been submitted and will be published after admin approval.</p>
              <button onClick={() => setShowThankYouPopup(false)} className="bg-white text-primary px-6 py-2 rounded-md font-medium">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="pt-16 lg:pt-24">
        <InnerPageBanner title={product.name} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Shop', path: '/shop' }, { label: product.name }]} />

        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery - FIXED */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-sm border">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={getProductImageUrl(product, activeImageIndex)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      console.log('⚠️ Image load error, using placeholder');
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows - Only show if more than 1 image */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex(i => i === 0 ? galleryImages.length - 1 : i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex(i => i === galleryImages.length - 1 ? 0 : i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${activeImageIndex === idx ? 'bg-primary w-4' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails - FIXED: Shows ALL images */}
              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {galleryImages.map((img, idx) => {
                    // Get thumbnail URL (original size)
                    const thumbUrl = img;

                    return (
                      <button
                        key={`thumb-${idx}-${Date.now()}`}
                        onClick={() => {
                          console.log(`🖼️ Switching to image ${idx + 1}`);
                          setActiveImageIndex(idx);
                        }}
                        className={`w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${activeImageIndex === idx ? 'border-primary' : 'border-gray-200'
                          }`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(`⚠️ Thumbnail ${idx + 1} load error`);
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}


            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <span className="text-primary text-sm tracking-wider uppercase">{product.category}</span>
                <h1 className="font-display text-3xl lg:text-3xl text-foreground mt-0.5">{product.name}</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (<Star key={i} className={`w-4 h-4 ${i <= (reviewStats.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}
                  </div>
                  <span className="text-muted-foreground text-sm">({reviewStats.count || 0} Customer Reviews)</span>
                </div>
              </div>

              {/* Pricing section - Couple Ring dual price or standard single price */}
              {isCoupleRing ? (
                <div className="space-y-3.5">
                  {/* Prominent Dual Price Highlight */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-gradient-to-br from-amber-50/90 via-amber-100/30 to-white border border-amber-200/90 shadow-xs">
                    <div className="p-2.5 rounded-lg bg-white/95 border border-amber-200/80 shadow-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Women’s Ring</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold">♀</span>
                      </div>
                      <p className="text-lg sm:text-xl font-extrabold text-primary">{formatPrice(couplePrices.womenPrice)}</p>
                      {couplePrices.womenWeight ? <p className="text-[11px] text-gray-500 font-medium">{couplePrices.womenWeight}g Gold</p> : null}
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/95 border border-blue-200/80 shadow-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Men’s Ring</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-900 font-bold">♂</span>
                      </div>
                      <p className="text-lg sm:text-xl font-extrabold text-primary">{formatPrice(couplePrices.menPrice)}</p>
                      {couplePrices.menWeight ? <p className="text-[11px] text-gray-500 font-medium">{couplePrices.menWeight}g Gold</p> : null}
                    </div>
                  </div>

                  {/* Ring Option Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        <span>Choose Your Ring</span>
                        <span className="text-red-600 font-extrabold">*</span>
                      </label>
                      <span className="text-[11px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                        {selectedRingOption}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Women's Ring Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedRingOption('Women’s Ring')}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${selectedRingOption === 'Women’s Ring'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">Women’s Ring</span>
                          {selectedRingOption === 'Women’s Ring' && <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />}
                        </div>
                        <p className="text-sm font-extrabold text-primary mt-1">{formatPrice(couplePrices.womenPrice)}</p>
                      </button>

                      {/* Men's Ring Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedRingOption('Men’s Ring')}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${selectedRingOption === 'Men’s Ring'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">Men’s Ring</span>
                          {selectedRingOption === 'Men’s Ring' && <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />}
                        </div>
                        <p className="text-sm font-extrabold text-primary mt-1">{formatPrice(couplePrices.menPrice)}</p>
                      </button>

                      {/* Both Rings Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedRingOption('Both Rings (Couple Set)')}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${selectedRingOption === 'Both Rings (Couple Set)'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">Both Rings (Set)</span>
                          {selectedRingOption === 'Both Rings (Couple Set)' && <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />}
                        </div>
                        <p className="text-sm font-extrabold text-primary mt-1">{formatPrice(couplePrices.bothPrice)}</p>
                      </button>
                    </div>
                  </div>

                  {/* Active Price Breakdown */}
                  <div className="price-container-fixed space-y-0.5 pt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(getEffectiveProductPrice())}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({selectedRingOption})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      + {product.gst ?? 3}% GST extra applicable
                    </p>
                  </div>
                </div>
              ) : (
                <div className="price-container-fixed space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    + {product.gst ?? 3}% GST extra applicable
                  </p>
                </div>
              )}

              <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>SKU: {product.sku}</span>
                <span>|</span>
                {(product as any).isAvailableForOrder !== false ? (
                  <span className="text-emerald-700 font-semibold inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 text-xs">
                    ✨ Made to Order (Prepared on order)
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold inline-flex items-center gap-1 bg-red-50 px-2.5 py-0.5 rounded border border-red-200 text-xs">
                    ✗ Currently Unavailable
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-snug">
                {product.description || "No description available."}
              </p>

              {/* ========== Ring Size Selector ========== */}
              {requiresRingSizeSelection() && (
                <div
                  className={`p-3 rounded-lg border transition-all ${sizeError
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-gray-200 bg-gray-50/30'
                    }`}
                >
                  {isCoupleRing ? (
                    <div className="space-y-3">
                      {selectedRingOption === 'Women’s Ring' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-foreground text-sm font-bold flex items-center gap-1 text-amber-900">
                              <span>Select Women’s Ring Size (♀)</span>
                              <span className="text-red-600 font-extrabold text-sm">*</span>
                            </label>
                            {selectedWomenSize ? (
                              <span className="text-[10px] bg-green-700 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                <Check className="w-3 h-3" />
                                Size {selectedWomenSize} Selected
                              </span>
                            ) : (
                              <span className="text-[10px] bg-[#612030] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                Required
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getRingSizes().map((size) => (
                              <button
                                key={`women-detail-${size}`}
                                type="button"
                                onClick={() => setSelectedWomenSize(selectedWomenSize === size ? '' : size)}
                                className={`w-9 h-9 rounded-md font-semibold text-xs border transition-all duration-200 ${selectedWomenSize === size
                                  ? 'border-amber-600 bg-amber-600 text-white shadow-xs scale-105'
                                  : 'border-gray-300 bg-white hover:border-amber-600 hover:bg-amber-50 text-gray-800'
                                  }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRingOption === 'Men’s Ring' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-foreground text-sm font-bold flex items-center gap-1 text-blue-900">
                              <span>Select Men’s Ring Size (♂)</span>
                              <span className="text-red-600 font-extrabold text-sm">*</span>
                            </label>
                            {selectedMenSize ? (
                              <span className="text-[10px] bg-green-700 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                <Check className="w-3 h-3" />
                                Size {selectedMenSize} Selected
                              </span>
                            ) : (
                              <span className="text-[10px] bg-[#612030] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                Required
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getRingSizes().map((size) => (
                              <button
                                key={`men-detail-${size}`}
                                type="button"
                                onClick={() => setSelectedMenSize(selectedMenSize === size ? '' : size)}
                                className={`w-9 h-9 rounded-md font-semibold text-xs border transition-all duration-200 ${selectedMenSize === size
                                  ? 'border-blue-600 bg-blue-600 text-white shadow-xs scale-105'
                                  : 'border-gray-300 bg-white hover:border-blue-600 hover:bg-blue-50 text-gray-800'
                                  }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRingOption === 'Both Rings (Couple Set)' && (
                        <div className="space-y-3">
                          {/* Women Size Selector */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-foreground text-xs font-bold flex items-center gap-1 text-amber-900">
                                <span>1. Women’s Ring Size (♀)</span>
                                <span className="text-red-600 font-extrabold text-xs">*</span>
                              </label>
                              {selectedWomenSize ? (
                                <span className="text-[10px] bg-green-700 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                  <Check className="w-3 h-3" />
                                  Size {selectedWomenSize}
                                </span>
                              ) : (
                                <span className="text-[10px] bg-amber-800 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                  Required
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {getRingSizes().map((size) => (
                                <button
                                  key={`women-both-${size}`}
                                  type="button"
                                  onClick={() => setSelectedWomenSize(selectedWomenSize === size ? '' : size)}
                                  className={`w-8 h-8 rounded-md font-semibold text-xs border transition-all duration-200 ${selectedWomenSize === size
                                    ? 'border-amber-600 bg-amber-600 text-white shadow-xs scale-105'
                                    : 'border-gray-300 bg-white hover:border-amber-600 hover:bg-amber-50 text-gray-800'
                                    }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Men Size Selector */}
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-foreground text-xs font-bold flex items-center gap-1 text-blue-900">
                                <span>2. Men’s Ring Size (♂)</span>
                                <span className="text-red-600 font-extrabold text-xs">*</span>
                              </label>
                              {selectedMenSize ? (
                                <span className="text-[10px] bg-green-700 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                  <Check className="w-3 h-3" />
                                  Size {selectedMenSize}
                                </span>
                              ) : (
                                <span className="text-[10px] bg-blue-800 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                  Required
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {getRingSizes().map((size) => (
                                <button
                                  key={`men-both-${size}`}
                                  type="button"
                                  onClick={() => setSelectedMenSize(selectedMenSize === size ? '' : size)}
                                  className={`w-8 h-8 rounded-md font-semibold text-xs border transition-all duration-200 ${selectedMenSize === size
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs scale-105'
                                    : 'border-gray-300 bg-white hover:border-blue-600 hover:bg-blue-50 text-gray-800'
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
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-foreground text-sm font-bold flex items-center gap-1">
                          Select Ring Size
                          <span className="text-red-600 font-extrabold text-sm">*</span>
                        </label>

                        {selectedSize ? (
                          <span className="text-[10px] bg-green-700 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" />
                            Size {selectedSize} Selected
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#612030] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                            Required
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {getRingSizes().map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeToggle(size)}
                            className={`w-9 h-9 rounded-md font-semibold text-xs border transition-all duration-200 ${selectedSize === size
                              ? 'border-primary bg-primary text-white shadow-sm scale-105'
                              : 'border-gray-300 bg-white hover:border-primary hover:bg-primary/5 text-gray-800'
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

              {/* Quantity and Gold / Rose Gold Options in a Clean Row */}
              <div className="flex flex-wrap items-start gap-4 sm:gap-6 py-1">
                {/* Quantity */}
                <div>
                  <label className="block text-foreground text-sm font-medium mb-1.5">
                    Quantity
                  </label>

                  <div className="inline-flex items-center border rounded-md bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 border-r transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-10 text-center text-sm font-medium">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 border-l transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Gold / Rose Gold Material Options on Right Side */}
                {availableMaterials.length > 0 && (
                  <div className="flex-1 min-w-[210px]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-foreground text-sm font-medium flex items-center gap-1">
                        Metal / Color
                        {availableMaterials.length > 1 && (
                          <span className="text-red-600 font-extrabold text-sm">*</span>
                        )}
                      </label>

                      {availableMaterials.length > 1 && (
                        selectedMaterial ? (
                          <span className="text-[10px] bg-green-700 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" />
                            {selectedMaterial} Selected
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${materialError ? 'bg-red-700 text-white animate-pulse' : 'bg-[#612030] text-white'
                            }`}>
                            Required
                          </span>
                        )
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {availableMaterials.map((mat) => {
                        const isSelected = selectedMaterial === mat;
                        const isGold = !mat.toLowerCase().includes('rose');

                        return (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => {
                              setSelectedMaterial(mat);
                              setMaterialError(false);
                            }}
                            className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-2 border-2 transition-all duration-200 ${isSelected
                                ? isGold
                                  ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-sm ring-1 ring-amber-600/30'
                                  : 'border-rose-500 bg-rose-50 text-rose-950 shadow-sm ring-1 ring-rose-500/30'
                                : materialError && !selectedMaterial
                                  ? 'border-red-300 bg-red-50/50 text-gray-700 hover:border-red-400'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                              }`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full inline-block shadow-sm ${isGold
                                  ? 'bg-gradient-to-br from-amber-300 to-amber-500 border border-amber-600'
                                  : 'bg-gradient-to-br from-rose-300 to-rose-400 border border-rose-500'
                                }`}
                            />
                            <span>{mat}</span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 ml-0.5 stroke-[2.5]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {materialError && !selectedMaterial && (
                      <p className="text-xs text-red-600 mt-1 font-medium">
                        Please select Gold or Rose Gold.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Cart and Wishlist Buttons */}
              <div className="flex items-center gap-3">
                {isInCart ? (
                  <Link to="/cart" className="flex-1 bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-md shadow-sm">
                    <ShoppingBag className="w-5 h-5" /> GO TO CART
                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={(product as any).isAvailableForOrder === false}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-extrabold rounded-md shadow-sm transition-all ${(product as any).isAvailableForOrder === false
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : requiresMaterialSelection()
                        ? 'bg-[#612030] text-white hover:bg-[#4a1824] border-2 border-red-900 shadow-md'
                        : requiresRingSizeSelection() && !selectedSize
                          ? 'bg-[#612030] text-white hover:bg-[#4a1824] border-2 border-red-900 shadow-md'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                  >
                    <ShoppingBag className="w-4 h-4" />

                    {(product as any).isAvailableForOrder === false
                      ? 'CURRENTLY UNAVAILABLE'
                      : requiresMaterialSelection()
                        ? 'SELECT GOLD OR ROSE GOLD'
                        : requiresRingSizeSelection() && !selectedSize
                          ? 'SELECT SIZE FIRST'
                          : 'ADD TO CART'}
                  </button>
                )}
                <button onClick={handleWishlistToggle} className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all ${inWishlist ? 'border-primary bg-primary text-white' : 'border-gray-300 hover:border-primary'}`}>
                  <Heart className={`w-4.5 h-4.5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Important: Unboxing Video Warning */}
              <div className="py-1.5 px-2.5 bg-amber-100/80 border-l-4 border-amber-600 rounded text-amber-950 text-xs leading-tight">
                <strong>Important:</strong> A complete box-opening / unboxing video is mandatory to be eligible for a return or exchange. The video must clearly show the sealed package being opened and the product inside. Requests without an unboxing video will not be accepted.
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                <div className="flex items-center gap-2 text-sm text-black/80"><Truck className="w-5 h-5 text-primary" /><span>Estimated Delivery 12–15 days <br />from the date of order</span></div>
                <div className="flex items-center gap-2 text-sm text-black/80"><Shield className="w-5 h-5 text-primary" /><span>Secure Payment</span></div>
                <div className="flex items-center gap-2 text-sm text-black/80"><RotateCcw className="w-5 h-5 text-primary" /><span>7-Day Returns & Exchange</span></div>
                <div className="flex items-center gap-2 text-sm text-black/80"><Award className="w-5 h-5 text-primary" /><span>Certified Quality</span></div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={(product as any).isAvailableForOrder === false}
                className={`w-full py-3 text-sm tracking-wider font-extrabold rounded-md shadow-sm transition-all ${(product as any).isAvailableForOrder === false
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : requiresMaterialSelection()
                    ? 'bg-[#612030] text-white hover:bg-[#4a1824] border-2 border-red-900 shadow-md'
                    : requiresRingSizeSelection() && !selectedSize
                      ? 'bg-[#612030] text-white hover:bg-[#4a1824] border-2 border-red-900 shadow-md'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
              >
                {(product as any).isAvailableForOrder === false
                  ? 'CURRENTLY UNAVAILABLE'
                  : requiresMaterialSelection()
                    ? 'SELECT GOLD OR ROSE GOLD TO CHECKOUT'
                    : requiresRingSizeSelection() && !selectedSize
                      ? 'SELECT SIZE FIRST TO CHECKOUT'
                      : 'PROCEED TO CHECKOUT'}
              </button>
            </motion.div>
          </div>

          {/* Accordion Sections */}
          <div className="mt-17 lg:mt-20 max-w-7xl mx-auto space-y-5 px-4">                  {accordionSections.map((section) => (
            <div key={section.id} className={`border rounded-md overflow-hidden transition-all duration-300 ${expandedSection === section.id ? 'border-primary/40 bg-gray-50' : 'border-primary/20'}`}>
              <button onClick={() => toggleSection(section.id)} className="w-full flex items-center justify-between px-6 py-4 text-left bg-primary">
                <h3 className="font-display text-xl font-semibold text-white">{section.title}</h3>
                <ChevronRight className={`w-5 h-5 text-white transition-all duration-300 ${expandedSection === section.id ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-6 pb-6 pt-4 text-sm text-gray-700 border-t">{section.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          </div>

          {/* ========== RELATED PRODUCTS - FIXED ========== */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 lg:mt-24">
              <h2 className="font-display text-2xl text-foreground mb-8 text-center">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => {
                  const ringSizes =
                    Array.isArray(p.ringSizes) && p.ringSizes.length > 0
                      ? p.ringSizes
                      : Array.isArray(p.specifications?.ringSizes) && p.specifications.ringSizes.length > 0
                        ? p.specifications.ringSizes
                        : ['Free Size'];

                  // Ring validation must come from category, not from the size array.
                  const categoryName = typeof p.category === 'string' ? p.category.toLowerCase().trim() : '';
                  const isRing =
                    !categoryName.includes('earring') &&
                    (categoryName === 'ring' || categoryName === 'rings' || categoryName.includes('ring'));

                  return (
                    <ProductCard
                      key={p._id || p.id}
                      product={{
                        id: p._id || p.id || '',
                        name: p.name,
                        price: p.price,
                        originalPrice: p.purchasePrice,
                        image: getProductImageUrl(p, 0),
                        images: p.images,
                        category: p.category,
                        sku: p.sku,
                        tags: p.tags,
                        specifications: p.specifications,
                        coupleRing: p.coupleRing || (p as any).specifications?.coupleRing || undefined,
                        // ⭐ CRITICAL FIX: Pass ring sizes directly
                        ringSizes: ringSizes,
                        isRingProduct: isRing,
                        gst: p.gst ?? 3,
                        rating: p.reviews?.rating || 4.5,
                        reviewCount: p.reviews?.count || 0,
                        stock: p.stock
                      }}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;