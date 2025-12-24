import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { Navigate, Link } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';

const dummyOrders = [
  {
    id: 'EV-12345',
    date: 'December 20, 2024',
    status: 'Delivered',
    total: 2450,
    items: [
      { name: 'Diamond Solitaire Ring', quantity: 1, price: 1200 },
      { name: 'Pearl Necklace', quantity: 1, price: 1250 },
    ],
  },
  {
    id: 'EV-12344',
    date: 'December 15, 2024',
    status: 'In Transit',
    total: 890,
    items: [
      { name: 'Gold Hoop Earrings', quantity: 2, price: 445 },
    ],
  },
  {
    id: 'EV-12340',
    date: 'November 28, 2024',
    status: 'Delivered',
    total: 3200,
    items: [
      { name: 'Sapphire Tennis Bracelet', quantity: 1, price: 3200 },
    ],
  },
];

const OrderSummary = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-32">
        {/* Banner */}
        <section className="py-16 bg-card border-b border-border/30">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-primary font-body text-sm tracking-luxury uppercase">
                Order History
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mt-4">
                Order Summary
              </h1>
              <div className="section-divider mt-6" />
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {dummyOrders.length > 0 ? (
              <div className="space-y-6">
                {dummyOrders.map((order, index) => (
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

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                          <span className="text-foreground">{formatPrice(item.price)}</span>
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
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="text-muted-foreground">No orders yet</p>
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
