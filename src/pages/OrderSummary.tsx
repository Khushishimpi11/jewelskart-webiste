import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore, SimpleOrder } from '@/store/orderStore';
import { Package, Eye, Loader2, Truck, CheckCircle, Clock, AlertCircle, Copy, Check, User } from 'lucide-react';
import { toast } from 'sonner';

const OrderSummary = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore();
  const { orders, isLoading: ordersLoading, fetchMyOrders } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const loadOrders = async () => {
        await fetchMyOrders();
        setLoading(false);
      };
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchMyOrders]);

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    switch(statusLower) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'out for delivery':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'delivered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'returned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    switch(statusLower) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'out for delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      case 'returned':
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colorClass = getStatusColor(status);
    const icon = getStatusIcon(status);
    const displayStatus = status || 'Confirmed';
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
        {icon}
        {displayStatus}
      </span>
    );
  };

  const getDisplayOrderId = (order: SimpleOrder) => {
    return order.orderNumber || order.id;
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ✅ Get customer ID from backend (NO FALLBACK)
// ✅ Replace getCustomerId with this
const getCustomerId = () => {
  console.log('🔍 user.customerId:', user?.customerId);
  
  if (user?.customerId) {
    return user.customerId;
  }
  
  return 'Loading...';
};

  if (authLoading || (loading && ordersLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Order Summary"
          subtitle="Order History"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Order Summary' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Customer ID Card */}
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Your Customer ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-primary text-lg">
                        {getCustomerId()}
                      </p>
                      {user?.customerId && (
                        <button
                          onClick={() => copyToClipboard(getCustomerId(), 'customer-id')}
                          className="p-1 hover:bg-primary/10 rounded transition-colors"
                        >
                          {copiedId === 'customer-id' ? 
                            <Check className="w-4 h-4 text-green-500" /> : 
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          }
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Use this ID for customer support</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-primary">{orders.length}</p>
                </div>
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border/30 p-6 rounded-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-border/30">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <div className="flex items-center gap-2">
                          <p className="font-display text-lg text-foreground">
                            {getDisplayOrderId(order)}
                          </p>
                          <button
                            onClick={() => copyToClipboard(getDisplayOrderId(order), `order-${order.id}`)}
                            className="p-1 hover:bg-primary/10 rounded transition-colors"
                          >
                            {copiedId === `order-${order.id}` ? 
                              <Check className="w-4 h-4 text-green-500" /> : 
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            }
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-foreground">{formatDate(order.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <StatusBadge status={order.status || 'Confirmed'} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-display text-lg text-primary">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <img 
                              src={item.image || '/placeholder-image.jpg'} 
                              alt={item.name || 'Product'} 
                              className="w-14 h-14 object-cover rounded-sm"
                              onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                            />
                            <div className="flex-1">
                              <p className="text-foreground text-sm">{item.name || 'Product'}</p>
                              <p className="text-muted-foreground text-xs">Qty: {item.quantity || 1}</p>
                              {item.productSku && (
                                <p className="text-muted-foreground text-xs">SKU: {item.productSku}</p>
                              )}
                            </div>
                            <span className="text-primary text-sm">{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No items found</p>
                      )}
                    </div>

                    {order.estimatedDelivery && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                      <div className="mb-4 p-3 bg-primary/5 rounded-sm">
                        <p className="text-sm text-muted-foreground">
                          Estimated Delivery: <span className="text-foreground font-medium">{order.estimatedDelivery}</span>
                        </p>
                      </div>
                    )}

                    {order.trackingNumber && (
                      <div className="mb-4 p-3 bg-primary/10 rounded-sm">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <Truck className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">Tracking Number</p>
                              <div className="flex items-center gap-2">
                                <p className="text-primary font-mono text-sm font-semibold">
                                  {order.trackingNumber}
                                </p>
                                <button
                                  onClick={() => copyToClipboard(order.trackingNumber, `tracking-${order.id}`)}
                                  className="p-1 hover:bg-primary/20 rounded transition-colors"
                                >
                                  {copiedId === `tracking-${order.id}` ? 
                                    <Check className="w-3 h-3 text-green-500" /> : 
                                    <Copy className="w-3 h-3 text-primary" />
                                  }
                                </button>
                              </div>
                            </div>
                          </div>
                          <Link
                            to="/track-order"
                            state={{ trackingId: order.trackingNumber }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            Track Order
                          </Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-md inline-block">
                  Start Shopping
                </Link>
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