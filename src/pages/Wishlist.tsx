import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, Heart, Truck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (item: typeof items[0]) => {
    const cartProduct = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      material: item.material,
      purity: item.purity,
      ringOption: item.ringOption,
      sku: item.sku || item.id
    };

    addToCart(cartProduct, item.selectedSize, item.material, item.purity, item.ringOption);
    removeItem(item.id);

    const details = [
      item.ringOption,
      item.material,
      item.purity,
      item.selectedSize && item.selectedSize !== 'Free Size' ? `Size ${item.selectedSize}` : null
    ].filter(Boolean).join(' • ');

    if (details) {
      toast.success(`${item.name} (${details}) moved to cart`);
    } else {
      toast.success(`${item.name} moved to cart`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="My Wishlist"
          subtitle="Saved Items"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]}
        />

        <div className="container mx-auto px-4 py-8 lg:py-12">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4 text-lg">Your wishlist is empty</p>
              <Link
                to="/shop"
                className="bg-primary text-white px-8 py-3 rounded-md inline-block transition-all duration-300 hover:bg-primary/90"
              >
                Discover Products
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground text-sm">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
                <button
                  onClick={clearWishlist}
                  className="text-red-500 text-sm hover:underline flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Clear All
                </button>
              </div>

              <div className="space-y-4">
                {items.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border/30 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-shrink-0 group"
                      >
                        <div className="relative overflow-hidden rounded-lg w-24 h-24 sm:w-28 sm:h-28">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {/* Product Name & Price Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <div>
                            <Link
                              to={`/product/${product.id}`}
                              className="font-display text-base sm:text-lg text-foreground hover:text-primary transition-colors line-clamp-2"
                            >
                              {product.name}
                            </Link>
                            {product.category && (
                              <p className="text-muted-foreground text-xs uppercase tracking-wider mt-0.5">
                                {product.category}
                              </p>
                            )}
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <span className="font-display text-base sm:text-lg text-primary">
                              {formatPrice(product.price)}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              + {product.gst ?? 3}% GST applicable
                            </p>
                          </div>
                        </div>

                        {/* Product Attributes - Metal, Purity, Size, Ring */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {product.material && (
                            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border font-medium ${product.material.toLowerCase().includes('rose')
                                ? 'bg-rose-500/10 text-rose-950 border-rose-400/40'
                                : 'bg-amber-500/10 text-amber-950 border-amber-400/40'
                              }`}>
                              <span className={`w-2 h-2 rounded-full inline-block ${product.material.toLowerCase().includes('rose')
                                  ? 'bg-gradient-to-br from-rose-300 to-rose-500'
                                  : 'bg-gradient-to-br from-amber-300 to-amber-500'
                                }`} />
                              <span>Metal: <strong className="font-semibold">{product.material}</strong></span>
                            </div>
                          )}

                          {product.purity && (
                            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border font-medium bg-purple-50 text-purple-700 border-purple-200">
                              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                              <span>Purity: <strong className="font-semibold">{product.purity}</strong></span>
                            </div>
                          )}

                          {product.selectedSize && (
                            <div className="flex items-center gap-1 text-xs bg-primary/10 px-2.5 py-1 rounded border border-primary/20">
                              <span className="font-medium text-primary">Size:</span>
                              <span className="text-foreground font-semibold">
                                {product.selectedSize === 'Free Size' ? 'Free Size' : product.selectedSize}
                              </span>
                            </div>
                          )}

                          {product.ringOption && (
                            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border font-semibold bg-primary/10 text-primary border-primary/20">
                              <span>Ring: <strong>{product.ringOption}</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Actions Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-border/20">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Truck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <span>12-15 days</span>
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {formatPrice(product.price)} each
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(product.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;