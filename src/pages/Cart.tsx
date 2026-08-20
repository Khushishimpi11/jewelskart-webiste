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
    return `${item.product.id}-${item.size || 'nosize'}-${item.material || item.product?.material || 'nomat'}-${item.ringOption || item.product?.ringOption || 'noopt'}`;
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
      removeItem(item.product.id, item.size, item.material || item.product?.material, item.ringOption || item.product?.ringOption);
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

  const getDisplaySize = (item: any) => {
    if (!item.size) {
      return 'Free Size';
    }
    return item.size;
  };

  const selectedCount = getSelectedCount();
  const selectedTotal = getSelectedTotal();
  const shipping = selectedCount > 0 ? 1200 : 0;

  const selectedCartItems = items.filter(item => selectedItems.has(getItemKey(item)));
  const gstTotal = selectedCartItems.reduce((sum, item) => {
    const gst = item.product.gst ?? 3;
    const itemTotal = item.product.price * item.quantity;
    const gstAmount = itemTotal * (gst / 100);
    return sum + gstAmount;
  }, 0);
  const totalExclGst = selectedTotal;
  const finalTotal = selectedTotal + gstTotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-24">
          <InnerPageBanner
            title="Shopping Cart"
            breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Cart' }]}
          />
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="font-display text-2xl text-foreground mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Discover our exquisite collection and find your perfect piece.</p>
              <Link
                to="/shop"
                className="bg-primary text-white px-8 py-3 rounded-md inline-flex items-center justify-center transition-all duration-300 hover:bg-primary/90"
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
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground mb-6 text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            {selectedCount > 0 && selectedCount !== items.length && (
              <span className="ml-2 text-primary">({selectedCount} selected)</span>
            )}
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All / Remove Controls */}
              <div className="bg-card p-4 border border-border/30 rounded-lg flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
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
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                    <span>Remove Selected ({selectedCount})</span>
                  </button>
                )}
              </div>

              {/* Cart Items */}
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
                    className={`bg-card border rounded-lg p-4 hover:shadow-md transition-shadow ${isSelected ? 'border-primary/50 border-2' : 'border-border/30'
                      }`}
                  >
                    <div className="flex gap-4">
                      {/* Select Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        <button
                          onClick={() => toggleItemSelection(itemKey)}
                          className="flex items-center justify-center"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Product Image */}
                      <Link
                        to={`/product/${item.product.id}`}
                        state={{ selectedSize: selectedSize, selectedMaterial: item.material || item.product?.material }}
                        className="flex-shrink-0 group"
                      >
                        <div className="relative overflow-hidden rounded-lg w-24 h-24 sm:w-28 sm:h-28">
                          <img
                            src={item.product.image || item.product.images?.[0]}
                            alt={item.product.name}
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
                              to={`/product/${item.product.id}`}
                              state={{ selectedSize: selectedSize, selectedMaterial: item.material || item.product?.material }}
                              className="font-display text-base sm:text-lg text-foreground hover:text-primary transition-colors line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            {item.product.category && (
                              <p className="text-muted-foreground text-xs uppercase tracking-wider mt-0.5">
                                {item.product.category}
                              </p>
                            )}
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <span className={`font-display text-base sm:text-lg ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              + {item.product.gst ?? 3}% GST applicable
                            </p>
                          </div>
                        </div>

                        {/* Product Attributes - Metal & Size */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {(item.material || item.product?.material) && (
                            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border font-medium ${(item.material || item.product?.material || '').toLowerCase().includes('rose')
                              ? 'bg-rose-500/10 text-rose-950 border-rose-400/40'
                              : 'bg-amber-500/10 text-amber-950 border-amber-400/40'
                              }`}>
                              <span className={`w-2 h-2 rounded-full inline-block ${(item.material || item.product?.material || '').toLowerCase().includes('rose')
                                ? 'bg-gradient-to-br from-rose-300 to-rose-500'
                                : 'bg-gradient-to-br from-amber-300 to-amber-500'
                                }`} />
                              <span>Metal: <strong className="font-semibold">{item.material || item.product?.material}</strong></span>
                            </div>
                          )}
                          {selectedSize && (
                            <div className="flex items-center gap-1 text-xs bg-primary/10 px-2.5 py-1 rounded border border-primary/20">
                              <span className="font-medium text-primary">Size:</span>
                              <span className="text-foreground font-semibold">
                                {selectedSize === 'Free Size' ? 'Free Size' : selectedSize}
                              </span>
                            </div>
                          )}
                          {/* {(item.ringOption || item.product?.ringOption) && (
                            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border font-semibold bg-primary/10 text-primary border-primary/20">
                              <span>Ring: <strong>{item.ringOption || item.product?.ringOption}</strong></span>
                            </div>
                          )} */}
                        </div>

                        {/* Quantity & Actions Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-border/20">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-border/50 rounded">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1, selectedSize, item.material || item.product?.material, item.ringOption || item.product?.ringOption)}
                                className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-foreground text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, selectedSize, item.material || item.product?.material, item.ringOption || item.product?.ringOption)}
                                className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {formatPrice(item.product.price)} each
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Truck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <span>12-15 days</span>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id, selectedSize, item.material || item.product?.material, item.ringOption || item.product?.ringOption)}
                              className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-muted-foreground text-sm hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
                <Link
                  to="/shop"
                  className="flex items-center gap-2 text-primary text-sm hover:underline"
                >
                  <RefreshCw className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card p-6 border border-border/30 rounded-lg sticky top-28">
                <h2 className="font-display text-xl text-foreground mb-6">
                  Order Summary
                  {selectedCount > 0 && selectedCount !== items.length && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({selectedCount} items selected)
                    </span>
                  )}
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Product Subtotal</span>
                    <span className="text-foreground font-medium">{formatPrice(Math.round(totalExclGst))}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GST (+ as applicable)</span>
                    <span className="text-foreground font-medium">{selectedCount > 0 ? formatPrice(Math.round(gstTotal)) : '₹0'}</span>
                  </div>
                  {selectedCount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping (Pan-India)</span>
                      <span className="text-foreground font-medium">{formatPrice(1200)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/30 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg text-foreground">Total Payable</span>
                    <div className="text-right">
                      <span className="font-display text-2xl text-primary">
                        {selectedCount > 0 ? formatPrice(Math.round(finalTotal)) : formatPrice(0)}
                      </span>
                      <p className="text-xs text-muted-foreground">Incl. GST + ₹1,200 Shipping</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={selectedCount === 0}
                  className={`w-full py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 group text-sm ${selectedCount === 0
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

                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Estimated Delivery: 12–15 days from order date</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Secure payment · 100% buyer protection</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RefreshCw className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Free returns within 15 days</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/30">
                  <p className="text-muted-foreground text-xs mb-3 text-center">We accept</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {['Visa', 'Mastercard', 'UPI', 'Zoho Payments', 'Paytm'].map((method) => (
                      <span key={method} className="text-xs bg-muted px-3 py-1.5 rounded text-muted-foreground">
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