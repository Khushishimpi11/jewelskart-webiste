import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Star, Shield, Truck, RefreshCw } from 'lucide-react';
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

  // Calculate savings (example: 10% off original price)
  const calculateSavings = (price: number, quantity: number) => {
    const originalPrice = price * 1.1; // Assuming 10% higher original price
    return (originalPrice - price) * quantity;
  };

  const totalSavings = items.reduce((acc, item) => 
    acc + calculateSavings(item.product.price, item.quantity), 0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        <InnerPageBanner
          title="Shopping Cart"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Cart' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-8">
          <p className="text-muted-foreground mb-6">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="font-display text-2xl text-foreground mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Discover our exquisite collection and find your perfect piece.</p>
              <Link
                to="/shop"
                className="bg-primary text-white px-6 py-3 rounded-md inline-block transition-all duration-300 hover:bg-primary/90"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart Items - Left Column */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 p-6 bg-card border border-border/30 rounded-sm hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <Link to={`/product/${item.product.id}`} className="flex-shrink-0 group">
                      <div className="relative overflow-hidden rounded-sm">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-24 h-24 lg:w-32 lg:h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {item.product.stock && item.product.stock < 5 && (
                          <span className="absolute top-1 left-1 bg-destructive text-white text-[10px] px-1.5 py-0.5 rounded-sm">
                            Only {item.product.stock} left
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col">
                      {/* Title and Category */}
                      <div className="flex justify-between items-start">
                        <div>
                          <Link 
                            to={`/product/${item.product.id}`} 
                            className="font-display text-lg text-foreground hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          {item.product.category && (
                            <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
                              {item.product.category}
                            </p>
                          )}
                        </div>
                        
                        {/* Price per item */}
                        <div className="text-right">
                          <span className="font-display text-lg text-primary">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            ₹{formatPrice(item.product.price)} each
                          </p>
                        </div>
                      </div>

                      {/* Product Specifications */}
                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                        {item.product.material && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span className="text-xs">Material:</span>
                            <span className="text-foreground font-medium">{item.product.material}</span>
                          </div>
                        )}
                        {item.product.weight && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span className="text-xs">Weight:</span>
                            <span className="text-foreground font-medium">{item.product.weight}g</span>
                          </div>
                        )}
                        {item.size && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span className="text-xs">Size:</span>
                            <span className="text-foreground font-medium">{item.size}</span>
                          </div>
                        )}
                        {item.product.purity && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span className="text-xs">Purity:</span>
                            <span className="text-foreground font-medium">{item.product.purity}</span>
                          </div>
                        )}
                      </div>

                      {/* Rating if available */}
                      {item.product.rating && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(item.product.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({item.product.reviews || 0} reviews)
                          </span>
                        </div>
                      )}

                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/20">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-border/50 rounded-sm">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)} 
                              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-foreground text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)} 
                              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                              disabled={item.product.stock ? item.quantity >= item.product.stock : false}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Delivery Estimate */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Truck className="w-3 h-3" />
                            <span>Delivery by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeItem(item.product.id, item.size)} 
                          className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden lg:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Cart Actions */}
                <div className="flex items-center justify-between pt-4">
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

              {/* Order Summary - Right Column */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-card p-6 lg:p-8 border border-border/30 rounded-sm sticky top-28">
                  <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>
                  
                  {/* Price Breakdown */}
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

                  {/* Total */}
                  <div className="border-t border-border/30 pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg text-foreground">Total</span>
                      <div className="text-right">
                        <span className="font-display text-2xl text-primary">
                          {formatPrice(getTotal() + (getTotal() >= 5000 ? 0 : 250))}
                        </span>
                        <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    className="w-full bg-primary text-white py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 group"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Secure Checkout Info */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Secure payment · 100% buyer protection</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RefreshCw className="w-4 h-4 text-green-600" />
                      <span>Free returns within 15 days</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-8 pt-6 border-t border-border/30">
                    <p className="text-muted-foreground text-xs mb-3 text-center">We accept</p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      {['Visa', 'Mastercard', 'UPI', 'RazorPay', 'Paytm'].map((method) => (
                        <span key={method} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Need Help */}
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