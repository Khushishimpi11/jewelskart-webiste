import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, Truck, RefreshCw } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useCartStore } from '@/store/cartStore';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateSavings = (price: number, quantity: number) => {
    const originalPrice = price * 1.1;
    return (originalPrice - price) * quantity;
  };

  const totalSavings = items.reduce((acc, item) => 
    acc + calculateSavings(item.product.price, item.quantity), 0
  );

  const getDeliveryDate = () => {
    const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDisplaySize = (item: any) => {
    return item.size;
  };

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
          </p>

          {items.length === 0 ? (
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
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 lg:space-y-4">
                {items.map((item, index) => {
                  const selectedSize = getDisplaySize(item);
                  
                  return (
                    <motion.div
                      key={`${item.product.id}-${selectedSize || 'nosize'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 sm:gap-6 p-3 sm:p-6 bg-card border border-border/30 rounded-sm hover:shadow-md transition-shadow"
                    >
                      {/* Product Image */}
                      <Link to={`/product/${item.product.id}`} className="flex-shrink-0 group">
                        <div className="relative overflow-hidden rounded-sm">
                          <img 
                            src={item.product.image || item.product.images?.[0]} 
                            alt={item.product.name} 
                            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col min-w-0">
                        {/* Product Name and Price Row */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <Link 
                              to={`/product/${item.product.id}`} 
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
                          
                          {/* Price - Right side */}
                          <div className="text-right flex-shrink-0">
                            <span className="font-display text-sm sm:text-lg text-primary">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                        {/* Size and Material */}
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

                        {/* Quantity, Delivery Date, Price Each, and Remove - All in one row */}
                        <div className="flex items-center justify-between flex-wrap gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-border/20">
                          {/* Quantity Controls */}
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

                          {/* Delivery Date - Next to quantity */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Truck className="w-3 h-3" />
                            <span>Delivery by {getDeliveryDate()}</span>
                          </div>

                          {/* Price Each */}
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {formatPrice(item.product.price)} each
                          </div>

                          {/* Remove Button */}
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

                {/* Cart Actions */}
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

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-card p-4 sm:p-6 lg:p-8 border border-border/30 rounded-sm sticky top-28">
                  <h2 className="font-display text-lg lg:text-xl text-foreground mb-4 lg:mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">{formatPrice(getTotal())}</span>
                    </div>
                    
                    {totalSavings > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Savings</span>
                        <span className="text-green-600 font-medium">- {formatPrice(totalSavings)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground font-medium">
                        {getTotal() >= 5000 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(250)
                        )}
                      </span>
                    </div>
                    
                    {getTotal() < 5000 && (
                      <div className="bg-muted/50 p-3 rounded-sm text-xs">
                        <p className="text-muted-foreground">
                          Add {formatPrice(5000 - getTotal())} more to get 
                          <span className="text-green-600 font-medium"> FREE shipping</span>
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground font-medium">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-border/30 pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base lg:text-lg text-foreground">Total</span>
                      <div className="text-right">
                        <span className="font-display text-xl lg:text-2xl text-primary">
                          {formatPrice(getTotal() + (getTotal() >= 5000 ? 0 : 250))}
                        </span>
                        <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="w-full bg-primary text-white py-3 min-h-[44px] rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 group text-sm lg:text-base"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

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
                      {['Visa', 'Mastercard', 'UPI', 'RazorPay', 'Paytm'].map((method) => (
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;