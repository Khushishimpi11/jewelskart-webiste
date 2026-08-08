import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, Truck, 
  RefreshCw, CheckSquare, Square, Trash 
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(true);

  const getItemKey = (item: any) => {
    return `${item.product.id}-${item.size || 'nosize'}`;
  };

  useEffect(() => {
    const allKeys = items.map(item => getItemKey(item));
    setSelectedItems(new Set(allKeys));
  }, [items]);

  useEffect(() => {
    const allKeys = items.map(item => getItemKey(item));
    const allSelected = allKeys.length > 0 && allKeys.every(key => selectedItems.has(key));
    setSelectAll(allSelected);
  }, [selectedItems, items]);

  const toggleItemSelection = (itemKey: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allKeys = items.map(item => getItemKey(item));
      setSelectedItems(new Set(allKeys));
    }
  };

  const getSelectedItemsForCheckout = () => {
    return items.filter(item => selectedItems.has(getItemKey(item)));
  };

  const getSelectedTotal = () => {
    return items.reduce((total, item) => {
      if (selectedItems.has(getItemKey(item))) {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const getSelectedCount = () => {
    return items.filter(item => selectedItems.has(getItemKey(item))).length;
  };

  const removeSelectedItems = () => {
    const itemsToRemove = items.filter(item => selectedItems.has(getItemKey(item)));
    itemsToRemove.forEach(item => {
      removeItem(item.product.id, item.size);
    });
    toast.success(`${itemsToRemove.length} item(s) removed`);
  };

  const handleProceedToCheckout = () => {
    const selected = getSelectedItemsForCheckout();
    
    if (selected.length === 0) {
      toast.error("Please select at least one item to checkout");
      return;
    }
    
    navigate('/checkout', {
      state: {
        selectedItems: selected,
        fromCart: true,
        isBuyNow: false
      }
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDeliveryDate = () => {
    const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

 const getDisplaySize = (item: any) => {
  // If size is not present or empty, show "Free Size" for non-ring products
  if (!item.size) {
    return 'Free Size';
  }
  return item.size;
};

  const selectedCount = getSelectedCount();
  const selectedTotal = getSelectedTotal();
  const shipping = selectedTotal >= 5000 ? 0 : (selectedTotal > 0 ? 250 : 0);
  const finalTotal = selectedTotal + shipping;

  // GST breakdown for selected items
  const selectedCartItems = items.filter(item => selectedItems.has(getItemKey(item)));
  const gstTotal = selectedCartItems.reduce((sum, item) => {
    const gst = item.product.gst ?? 3;
    const itemTotal = item.product.price * item.quantity;
    const gstAmount = itemTotal - (itemTotal / (1 + gst / 100));
    return sum + gstAmount;
  }, 0);
  const totalExclGst = selectedTotal - gstTotal;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-24">
          <InnerPageBanner
            title="Shopping Cart"
            breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Cart' }]}
          />
          <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 lg:py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 lg:py-20"
            >
              <ShoppingBag className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-4 lg:mb-6" />
              <h2 className="font-display text-xl lg:text-2xl text-foreground mb-3 lg:mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6 lg:mb-8 text-sm lg:text-base">Discover our exquisite collection and find your perfect piece.</p>
              <Link
                to="/shop"
                className="bg-primary text-white px-6 py-3 min-h-[44px] rounded-md inline-flex items-center justify-center transition-all duration-300 hover:bg-primary/90"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Shopping Cart"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Cart' }]}
        />
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 lg:py-8">
          <p className="text-muted-foreground mb-4 lg:mb-6 text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            {selectedCount > 0 && selectedCount !== items.length && (
              <span className="ml-2 text-primary">({selectedCount} selected)</span>
            )}
          </p>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
            <div className="lg:col-span-2 space-y-3 lg:space-y-4">
              <div className="bg-card p-4 border border-border/30 rounded-sm flex items-center justify-between">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors min-h-[44px]"
                >
                  {selectAll ? (
                    <CheckSquare className="w-5 h-5 text-primary" />
                  ) : (
                    <Square className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">
                    {selectAll ? 'Deselect All' : 'Select All'}
                  </span>
                </button>
                {selectedCount > 0 && (
                  <button
                    onClick={removeSelectedItems}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors min-h-[44px]"
                  >
                    <Trash className="w-4 h-4" />
                    <span>Remove Selected ({selectedCount})</span>
                  </button>
                )}
              </div>

              {items.map((item, index) => {
                const selectedSize = getDisplaySize(item);
                const itemKey = getItemKey(item);
                const isSelected = selectedItems.has(itemKey);
                
                return (
                  <motion.div
                    key={itemKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 sm:gap-6 p-3 sm:p-6 bg-card border rounded-sm hover:shadow-md transition-shadow ${
                      isSelected ? 'border-primary/50 border-2' : 'border-border/30'
                    }`}
                  >
                    <div className="flex-shrink-0 pt-2">
                      <button
                        onClick={() => toggleItemSelection(itemKey)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-6 h-6 text-primary" />
                        ) : (
                          <Square className="w-6 h-6 text-muted-foreground" />
                        )}
                      </button>
                    </div>

                    {/* ✅ Product Image Link with size */}
                    <Link 
                      to={`/product/${item.product.id}`} 
                      state={{ selectedSize: selectedSize }}
                      className="flex-shrink-0 group"
                    >
                      <div className="relative overflow-hidden rounded-sm">
                        <img 
                          src={item.product.image || item.product.images?.[0]} 
                          alt={item.product.name} 
                          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          {/* ✅ Product Name Link with size */}
                          <Link 
                            to={`/product/${item.product.id}`} 
                            state={{ selectedSize: selectedSize }}
                            className="font-display text-sm sm:text-lg text-foreground hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          {item.product.category && (
                            <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider mt-0.5 sm:mt-1">
                              {item.product.category}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`font-display text-sm sm:text-lg ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Incl. {item.product.gst ?? 3}% GST
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 sm:mt-2">
                        {selectedSize ? (
                          <div className="flex items-center gap-1 text-xs sm:text-sm bg-primary/10 px-2 py-1 rounded border border-primary/20">
                            <span className="font-medium text-primary">Size:</span>
                            <span className="text-foreground font-semibold">
                              {selectedSize === 'Free Size' ? 'Free Size' : selectedSize}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                            <span className="font-medium">Size:</span>
                            <span className="text-foreground">Standard</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-border/20">
                        <div className="flex items-center border border-border/50 rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, selectedSize)} 
                            className="w-8 h-8 sm:w-8 sm:h-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-8 sm:w-10 text-center text-foreground text-xs sm:text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, selectedSize)} 
                            className="w-8 h-8 sm:w-8 sm:h-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Truck className="w-3 h-3" />
                          <span>Delivery by {getDeliveryDate()}</span>
                        </div>

                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {formatPrice(item.product.price)} each
                        </div>

                        <button 
                          onClick={() => removeItem(item.product.id, selectedSize)} 
                          className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors text-xs sm:text-sm min-h-[44px] px-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <div className="flex items-center justify-between pt-4">
                <button 
                  onClick={clearCart} 
                  className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm hover:text-destructive transition-colors min-h-[44px]"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
                <Link 
                  to="/shop" 
                  className="flex items-center gap-2 text-primary text-xs sm:text-sm hover:underline min-h-[44px]"
                >
                  <RefreshCw className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card p-4 sm:p-6 lg:p-8 border border-border/30 rounded-sm sticky top-28">
                <h2 className="font-display text-lg lg:text-xl text-foreground mb-4 lg:mb-6">
                  Order Summary
                  {selectedCount > 0 && selectedCount !== items.length && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({selectedCount} items selected)
                    </span>
                  )}
                </h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Product Price (Excl. GST)</span>
                    <span className="text-foreground font-medium">{formatPrice(Math.round(totalExclGst))}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GST</span>
                    <span className="text-foreground font-medium">{formatPrice(Math.round(gstTotal))}</span>
                  </div>
                  {selectedCount > 0 && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground font-medium">
                          {selectedTotal >= 5000 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            formatPrice(250)
                          )}
                        </span>
                      </div>
                      {selectedTotal < 5000 && selectedTotal > 0 && (
                        <div className="bg-muted/50 p-3 rounded-sm text-xs">
                          <p className="text-muted-foreground">
                            Add {formatPrice(5000 - selectedTotal)} more to get 
                            <span className="text-green-600 font-medium"> FREE shipping</span>
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="border-t border-border/30 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base lg:text-lg text-foreground">Total</span>
                    <div className="text-right">
                      <span className="font-display text-xl lg:text-2xl text-primary">
                        {selectedCount > 0 ? formatPrice(finalTotal) : formatPrice(0)}
                      </span>
                      <p className="text-xs text-muted-foreground">Inclusive of GST</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={selectedCount === 0}
                  className={`w-full py-3 min-h-[44px] rounded-md flex items-center justify-center gap-2 transition-all duration-300 group text-sm lg:text-base ${
                    selectedCount === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  Proceed to Checkout ({selectedCount} {selectedCount === 1 ? 'item' : 'items'})
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {selectedCount === 0 && (
                  <p className="text-xs text-red-500 text-center mt-2">
                    Please select at least one item to proceed
                  </p>
                )}

                <div className="mt-4 lg:mt-6 space-y-2 lg:space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Secure payment · 100% buyer protection</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RefreshCw className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Free returns within 15 days</span>
                  </div>
                </div>

                <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-border/30">
                  <p className="text-muted-foreground text-xs mb-3 text-center">We accept</p>
                  <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                    {['Visa', 'Mastercard', 'UPI', 'Zoho Payments', 'Paytm'].map((method) => (
                      <span key={method} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Need help? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;