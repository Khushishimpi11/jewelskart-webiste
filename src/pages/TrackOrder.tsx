import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Package, CheckCircle, Truck, Home } from 'lucide-react';
import { toast } from 'sonner';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      toast.error('Please enter an order ID');
      return;
    }
    // Simulate order tracking
    setOrderStatus({
      id: orderId,
      status: 'In Transit',
      date: 'December 24, 2024',
      estimatedDelivery: 'December 28, 2024',
      steps: [
        { name: 'Order Placed', completed: true, date: 'Dec 20, 2024' },
        { name: 'Processing', completed: true, date: 'Dec 21, 2024' },
        { name: 'Shipped', completed: true, date: 'Dec 22, 2024' },
        { name: 'In Transit', completed: true, date: 'Dec 24, 2024' },
        { name: 'Delivered', completed: false, date: 'Pending' },
      ],
    });
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
                Order Tracking
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mt-4">
                Track Your Order
              </h1>
              <div className="section-divider mt-6" />
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Track Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleTrack}
              className="flex gap-4 mb-12"
            >
              <Input
                placeholder="Enter your order ID (e.g., EV-12345)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="bg-card flex-1"
              />
              <button type="submit" className="btn-gold">
                Track Order
              </button>
            </motion.form>

            {/* Order Status */}
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

                {/* Progress Steps */}
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
                        <p className={`font-display ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {!orderStatus && (
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
