import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
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
              <Link to="/shop" className="btn-gold">Continue Shopping</Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-card border border-border/30 rounded-sm"
                  >
                    <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-sm" />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/product/${item.product.id}`} className="font-display text-lg text-foreground hover:text-primary transition-colors">
                          {item.product.name}
                        </Link>
                        {item.size && <p className="text-muted-foreground text-sm mt-1">Size: {item.size}</p>}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border/50">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)} className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-foreground text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)} className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-display text-lg text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                          <button onClick={() => removeItem(item.product.id, item.size)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <button onClick={clearCart} className="text-muted-foreground text-sm hover:text-destructive transition-colors">Clear Cart</button>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card p-6 lg:p-8 border border-border/30 rounded-sm h-fit"
              >
                <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">{getTotal() >= 5000 ? 'Free' : formatPrice(250)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">Calculated at checkout</span>
                  </div>
                </div>
                <div className="border-t border-border/30 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg text-foreground">Total</span>
                    <span className="font-display text-2xl text-primary">{formatPrice(getTotal() + (getTotal() >= 5000 ? 0 : 250))}</span>
                  </div>
                </div>
                <Link to="/checkout" className="w-full btn-gold flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/shop" className="block text-center mt-4 text-muted-foreground text-sm hover:text-primary transition-colors">Continue Shopping</Link>
                <div className="mt-8 pt-6 border-t border-border/30 text-center">
                  <p className="text-muted-foreground text-xs mb-2">Secure checkout with</p>
                  <div className="flex items-center justify-center gap-4 text-muted-foreground text-xs">
                    <span>Visa</span><span>Mastercard</span><span>UPI</span><span>RazorPay</span>
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
