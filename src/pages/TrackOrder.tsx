import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { Input } from '@/components/ui/input';
import { Package, CheckCircle, Truck, Home, Clock } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { toast } from 'sonner';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const { getOrderById, orders } = useOrderStore();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      toast.error('Please enter an order ID');
      return;
    }
    
    const order = getOrderById(orderId);
    if (order) {
      setOrderStatus({
        id: order.id,
        status: order.status,
        date: order.date,
        estimatedDelivery: order.estimatedDelivery,
        items: order.items,
        steps: [
          { name: 'Order Placed', completed: true, date: order.date },
          { name: 'Processing', completed: true, date: order.date },
          { name: 'Shipped', completed: order.status !== 'Processing' && order.status !== 'Order Placed', date: 'In Progress' },
          { name: 'In Transit', completed: order.status === 'In Transit' || order.status === 'Delivered', date: 'Pending' },
          { name: 'Delivered', completed: order.status === 'Delivered', date: 'Pending' },
        ],
      });
    } else {
      // Show dummy data for demo
      setOrderStatus({
        id: orderId,
        status: 'In Transit',
        date: 'February 15, 2026',
        estimatedDelivery: 'February 20, 2026',
        items: [],
        steps: [
          { name: 'Order Placed', completed: true, date: 'Feb 15, 2026' },
          { name: 'Processing', completed: true, date: 'Feb 16, 2026' },
          { name: 'Shipped', completed: true, date: 'Feb 17, 2026' },
          { name: 'In Transit', completed: true, date: 'Feb 18, 2026' },
          { name: 'Delivered', completed: false, date: 'Pending' },
        ],
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
<main className="pt-16 lg:pt-24">  
        <InnerPageBanner
          title="Track Your Order"
          subtitle="Order Tracking"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Track Order' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleTrack}
              className="flex gap-4 mb-12"
            >
              <Input
                placeholder="Enter your order ID (e.g., EV-XXXXXX)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="bg-card flex-1"
              />
            <button
  type="submit"
  className="bg-primary text-white px-6 py-3 rounded-md transition-all duration-300 hover:bg-primary/90"
>
  Track Order
</button>
            </motion.form>

            {orderStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/30 p-8"
              >
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/30">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-display text-xl text-foreground">{orderStatus.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-display text-lg text-primary">{orderStatus.estimatedDelivery}</p>
                  </div>
                </div>

                {/* Order Items if available */}
                {orderStatus.items && orderStatus.items.length > 0 && (
                  <div className="mb-8 pb-6 border-b border-border/30 space-y-3">
                    {orderStatus.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-sm" />
                        <div className="flex-1">
                          <p className="text-foreground text-sm">{item.name}</p>
                          <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-primary text-sm">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative">
                  {orderStatus.steps.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {index === 0 && <Package className="w-5 h-5" />}
                        {index === 1 && <CheckCircle className="w-5 h-5" />}
                        {index === 2 && <Package className="w-5 h-5" />}
                        {index === 3 && <Truck className="w-5 h-5" />}
                        {index === 4 && <Home className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-display ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.name}</p>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Orders */}
            {!orderStatus && orders.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-display text-lg text-foreground">Your Recent Orders</h3>
                {orders.slice(0, 3).map((order) => (
                  <button
                    key={order.id}
                    onClick={() => { setOrderId(order.id); }}
                    className="w-full flex items-center justify-between bg-card border border-border/30 p-4 hover:border-primary/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-foreground font-display">{order.id}</p>
                        <p className="text-muted-foreground text-sm">{order.date}</p>
                      </div>
                    </div>
                    <span className="text-primary text-sm">{order.status}</span>
                  </button>
                ))}
              </div>
            )}

            {!orderStatus && orders.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p>Enter your order ID to track your package</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrder;
