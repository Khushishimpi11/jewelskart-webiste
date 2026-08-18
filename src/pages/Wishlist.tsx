import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ChevronDown, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { useState } from 'react';

const Wishlist = () => {
  const { items, removeItem, clearWishlist, updateItemSize } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [showSizeDropdown, setShowSizeDropdown] = useState<string | null>(null);

  const handleAddToCart = (item: typeof items[0]) => {
    // Check if ring product and size not selected
    if (item.isRingProduct && !item.selectedSize) {
      toast.error('Please select a size first');
      return;
    }

    // Create product object for cart
    const cartProduct = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      material: item.material,
      ringOption: item.ringOption,
      sku: item.sku || item.id
    };

    addToCart(cartProduct, item.selectedSize, item.material, item.ringOption);
    removeItem(item.id);

    const details = [
      item.ringOption,
      item.material,
      item.selectedSize && item.selectedSize !== 'Free Size' ? `Size ${item.selectedSize}` : null
    ].filter(Boolean).join(' • ');

    if (details) {
      toast.success(`${item.name} (${details}) moved to cart`);
    } else {
      toast.success(`${item.name} moved to cart`);
    }
  };

  const handleSizeSelect = (itemId: string, size: string) => {
    updateItemSize(itemId, size);
    setShowSizeDropdown(null);
    toast.success(`Size updated to ${size}`);
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

        <div className="container mx-auto px-4 lg:px-8 py-12">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
              <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-md inline-block transition-all duration-300 hover:bg-primary/90">
                Discover Products
              </Link>
            </div>
          ) : (
            <>
              {/* Clear All Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={clearWishlist}
                  className="text-red-500 text-sm hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border/30 rounded-sm overflow-hidden"
                  >
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full aspect-product object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </Link>
                    <div className="p-4">
                      <h3 className="font-display text-lg text-foreground line-clamp-2">{product.name}</h3>
                      <p className="text-primary font-semibold mt-1">{formatPrice(product.price)}</p>

                      {/* ✅ Display Selected Size if ring product */}
                      {product.isRingProduct && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between">
                            <div className="relative flex-1">
                              <button
                                onClick={() => setShowSizeDropdown(showSizeDropdown === product.id ? null : product.id)}
                                className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background hover:border-primary transition-colors flex items-center justify-between"
                              >
                                <span className={product.selectedSize ? 'text-foreground' : 'text-muted-foreground'}>
                                  {product.selectedSize ? `Size: ${product.selectedSize}` : 'Select Ring Size'}
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showSizeDropdown === product.id ? 'rotate-180' : ''}`} />
                              </button>

                              {showSizeDropdown === product.id && (
                                <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-sm shadow-lg">
                                  <div className={`grid ${product.availableSizes?.length > 4 ? 'grid-cols-4' : `grid-cols-${Math.min(product.availableSizes?.length || 1, 4)}`} gap-1 p-2`}>
                                    {(product.availableSizes || ['Free Size']).map((size) => (
                                      <button
                                        key={size}
                                        onClick={() => handleSizeSelect(product.id, size)}
                                        className={`px-2 py-2 text-sm text-center rounded transition-colors ${product.selectedSize === size
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
                          </div>
                          {/* ✅ Show selected size badge */}
                          {product.selectedSize && (
                            <div className="mt-2 flex items-center gap-1">
                              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                ✓ Size: {product.selectedSize}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ✅ Show Ring Option badge */}
                      {product.ringOption && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
                            Ring: {product.ringOption}
                          </span>
                        </div>
                      )}

                      {/* ✅ Show Metal badge */}
                      {product.material && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 border ${
                            product.material.toLowerCase().includes('rose')
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              product.material.toLowerCase().includes('rose') ? 'bg-rose-500' : 'bg-amber-500'
                            }`} />
                            Metal: {product.material}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`flex-1 text-xs py-2 flex items-center justify-center gap-1 rounded transition-all ${product.isRingProduct && !product.selectedSize
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'btn-gold-outline'
                            }`}
                          disabled={product.isRingProduct && !product.selectedSize}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          {product.isRingProduct && !product.selectedSize ? 'Select Size' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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