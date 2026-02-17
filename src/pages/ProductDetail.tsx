import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus, Check, Truck, RotateCcw, Shield, Award, Star } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductCard } from '@/components/ProductCard';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const colors = [
  { name: 'Gold', value: '#D4AF37' },
  { name: 'Rose Gold', value: '#B76E79' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'White Gold', value: '#F5F5F5' },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/shop" className="btn-gold">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  // Create gallery images (using same image multiple times as placeholder)
  const galleryImages = [product.image, product.image, product.image, product.image];
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize || undefined);
    }
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleProceedToCheckout = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const accordionSections = [
    {
      id: 'additional',
      title: 'Additional Information',
      content: (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Material: {product.material}</p>
          <p>Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
          <p>SKU: EV-{product.id.padStart(5, '0')}</p>
          <p>Weight: 12g (approx.)</p>
        </div>
      ),
    },
    {
      id: 'specifications',
      title: 'Specifications',
      content: (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Purity: 18K / 22K</p>
          <p>Finish: High Polish</p>
          <p>Hallmark: BIS Hallmarked</p>
          <p>Certification: IGI Certified</p>
        </div>
      ),
    },
    {
      id: 'care',
      title: 'Care Instructions',
      content: (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Store in a cool, dry place away from direct sunlight</p>
          <p>• Clean with a soft, lint-free cloth</p>
          <p>• Avoid contact with perfumes, lotions, and chemicals</p>
          <p>• Remove before swimming or bathing</p>
        </div>
      ),
    },
    {
      id: 'reviews',
      title: 'Customer Reviews (24)',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
              <Star className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">4.0 out of 5</span>
          </div>
          <div className="border-t border-border/30 pt-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-primary fill-primary" />)}
              </div>
              <span className="text-sm font-display text-foreground">Priya S.</span>
            </div>
            <p className="text-sm text-muted-foreground">Beautiful piece, exactly as shown. The craftsmanship is exceptional.</p>
          </div>
          <div className="border-t border-border/30 pt-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">
                {[1,2,3,4].map(i => <Star key={i} className="w-3 h-3 text-primary fill-primary" />)}
                <Star className="w-3 h-3 text-muted-foreground" />
              </div>
              <span className="text-sm font-display text-foreground">Rahul M.</span>
            </div>
            <p className="text-sm text-muted-foreground">Great quality, my wife loved it. Fast delivery too!</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        <InnerPageBanner
          title={product.name}
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Shop', path: '/shop' },
            { label: product.name },
          ]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image with Nav */}
              <div className="relative aspect-square overflow-hidden rounded-sm border border-border/30">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={galleryImages[activeImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                <button
                  onClick={() => setActiveImageIndex(i => i === 0 ? galleryImages.length - 1 : i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex(i => i === galleryImages.length - 1 ? 0 : i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        activeImageIndex === idx ? 'bg-primary' : 'bg-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                      activeImageIndex === idx ? 'border-primary' : 'border-border/30'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <span className="text-primary font-body text-sm tracking-wider uppercase">
                  {product.category}
                </span>
                <h1 className="font-display text-3xl lg:text-4xl text-foreground mt-1">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground text-sm">(24 Customer Reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through text-lg">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Product Code & Stock */}
              <div className="text-sm text-muted-foreground">
                Product Code: EV-{product.id.padStart(3, '0')} | <Check className="w-4 h-4 inline text-green-400" /> In Stock
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Free Size Badge */}
              {!product.isRing && (
                <div className="flex items-center gap-3 p-4 border border-border/30 rounded-sm">
                  <div className="bg-primary/10 px-4 py-2 rounded-sm">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Check className="w-4 h-4 text-primary" /> Free Size
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">This product comes in one universal size that fits all.</span>
                </div>
              )}

              {/* Color Selection */}
              <div>
                <label className="block text-foreground text-sm font-medium mb-3">Color</label>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor === color.name ? 'border-primary scale-110' : 'border-border/50'
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Selected Color: {selectedColor}</p>
              </div>

              {/* Size Selector for Rings */}
              {product.isRing && (
                <div>
                  <label className="block text-foreground text-sm font-medium mb-3">Ring Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 border flex items-center justify-center transition-all ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border/50 text-foreground hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-foreground text-sm font-medium mb-3">Quantity</label>
                <div className="inline-flex items-center border border-border/50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-muted transition-colors border-r border-border/50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-14 text-center text-foreground font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-muted transition-colors border-l border-border/50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button onClick={handleAddToCart} className="flex-1 btn-gold flex items-center justify-center gap-2 py-4 text-base">
                  <ShoppingBag className="w-5 h-5" />
                  ADD TO CART
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                    inWishlist
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border/50 text-foreground hover:border-primary'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="w-5 h-5 text-primary" />
                  <span>Free Delivery & Free Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Estimated Delivery: 3–5 Days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Secure Online Payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <span>Return: 7 Days</span>
                </div>
              </div>

              {/* Proceed to Checkout */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full btn-gold py-4 text-base tracking-widest"
              >
                PROCEED TO CHECKOUT
              </button>

              {/* Safe Checkout */}
              <div className="border border-border/30 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Guaranteed Safe Checkout</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span>RazorPay</span>
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>UPI</span>
                  <span>PayPal</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Accordion Sections */}
          <div className="mt-16 lg:mt-20 max-w-4xl mx-auto space-y-4">
            {accordionSections.map((section) => (
              <div key={section.id} className="border border-border/30 rounded-sm overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-card/50 transition-colors"
                >
                  <h3 className="font-display text-lg text-foreground">{section.title}</h3>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === section.id ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 lg:mt-24">
              <h2 className="font-display text-2xl text-foreground mb-8 text-center">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
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
