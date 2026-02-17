import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Navigate, Link } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';

const OrderSummary = () => {
  const { isAuthenticated } = useAuthStore();
  const { orders } = useOrderStore();

  if (!isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

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
          title="Order Summary"
          subtitle="Order History"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Order Summary' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border/30 p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-border/30">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-display text-lg text-foreground">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-foreground">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span className={`inline-block px-3 py-1 text-xs font-body tracking-wider ${
                          order.status === 'Delivered'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-primary/20 text-primary'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-display text-lg text-primary">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    {/* Order Items with Images */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-sm" />
                          <div className="flex-1">
                            <p className="text-foreground text-sm">{item.name}</p>
                            <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-primary text-sm">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to="/track-order"
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        Track Order
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link to="/shop" className="btn-gold">Start Shopping</Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSummary;
