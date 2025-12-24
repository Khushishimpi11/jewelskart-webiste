import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ChevronLeft, Minus, Plus, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { products, ringSizes } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductCard } from '@/components/ProductCard';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care'>('details');

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/shop" className="btn-gold">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product.isRing && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 lg:pt-32">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="aspect-square overflow-hidden rounded-sm border border-border/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="text-primary font-body text-sm tracking-wider uppercase">
                  {product.category}
                </span>
                <h1 className="font-display text-3xl lg:text-4xl text-foreground mt-2">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl text-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through text-lg">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Material */}
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm">Material:</span>
                <span className="text-muted-foreground text-sm">{product.material}</span>
              </div>

              {/* Size Selector */}
              {product.isRing && (
                <div>
                  <label className="block text-foreground text-sm mb-3">Ring Size</label>
                  <div className="flex flex-wrap gap-2">
                    {ringSizes.map((size) => (
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
                <label className="block text-foreground text-sm mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border/50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-foreground">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button onClick={handleAddToCart} className="flex-1 btn-gold flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 border flex items-center justify-center transition-all ${
                    inWishlist
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border/50 text-foreground hover:border-primary'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Features */}
              <div className="pt-6 space-y-3 border-t border-border/30">
                {[
                  'Free shipping on orders over $500',
                  '30-day return policy',
                  'Lifetime warranty',
                  'Certificate of authenticity',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="pt-6 border-t border-border/30">
                <div className="flex gap-6 mb-4">
                  {['details', 'care'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as typeof activeTab)}
                      className={`text-sm uppercase tracking-wider transition-colors ${
                        activeTab === tab
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab === 'details' ? 'Product Details' : 'Care Instructions'}
                    </button>
                  ))}
                </div>
                <div className="text-muted-foreground text-sm leading-relaxed">
                  {activeTab === 'details' ? (
                    <div className="space-y-2">
                      <p>Material: {product.material}</p>
                      <p>Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                      <p>SKU: EV-{product.id.padStart(5, '0')}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>• Store in a cool, dry place away from direct sunlight</p>
                      <p>• Clean with a soft, lint-free cloth</p>
                      <p>• Avoid contact with perfumes, lotions, and chemicals</p>
                      <p>• Remove before swimming or bathing</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 lg:mt-32">
              <h2 className="font-display text-2xl text-foreground mb-8">
                You May Also Like
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
