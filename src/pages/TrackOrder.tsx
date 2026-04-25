import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { 
  Package, CheckCircle, Truck, Home, Clock, Loader2, 
  Search, Copy, Check, Calendar, ArrowLeft, RefreshCw,
  XCircle, AlertTriangle, Mail, Phone, MapPin, DollarSign, Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface ReturnRequestInfo {
  _id: string;
  requestType: 'cancel' | 'return' | 'exchange';
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'return_received' | 'exchange_shipped';
  refundAmount: number;
  refundStatus: string;
  returnTrackingNumber?: string;
  exchangeTrackingNumber?: string;
  exchangeDetails?: {
    returnShippingTracking: string;
    exchangeShippingTracking: string;
    returnReceived: boolean;
    exchangeShipped: boolean;
    returnReceivedDate?: string;
    exchangeShippedDate?: string;
  };
  createdAt: string;
}

const TrackOrder = () => {
  const location = useLocation();
  const { token } = useAuthStore();
  const [trackingId, setTrackingId] = useState('');
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [returnRequest, setReturnRequest] = useState<ReturnRequestInfo | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fromOrderHistory, setFromOrderHistory] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);
  
  const { getTrackingByTrackingId, fetchMyOrders, orders } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Fetch return request for the order
  const fetchReturnRequest = async (orderId: string) => {
    if (!token) return;
    setLoadingReturn(true);
    try {
      const response = await fetch(`http://localhost:5000/api/returns/my-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const request = data.requests.find((r: any) => r.orderId === orderId);
        if (request) {
          setReturnRequest(request);
        }
      }
    } catch (error) {
      console.error('Error fetching return request:', error);
    } finally {
      setLoadingReturn(false);
    }
  };

  useEffect(() => {
    if (location.state?.fromOrderHistory === true) {
      setFromOrderHistory(true);
    } else if (location.state?.trackingId) {
      const referrer = document.referrer;
      if (referrer.includes('/order-summary')) {
        setFromOrderHistory(true);
      } else {
        setFromOrderHistory(false);
      }
      const id = location.state.trackingId;
      setTrackingId(id);
      handleTrackFromId(id);
    } else {
      setFromOrderHistory(false);
    }
  }, [location.state]);

  const handleTrackFromId = async (id: string) => {
    setIsTracking(true);
    
    const tracking = await getTrackingByTrackingId(id);
    
    if (tracking) {
      const order = orders.find(o => o.id === tracking.orderId);
      
      if (order) {
        const currentStatus = order.status || 'Confirmed';
        let requestType: string | undefined;
        
        // Check if there's a return/exchange request
        if (returnRequest) {
          requestType = returnRequest.requestType;
        }
        
        setOrderStatus({
          id: order.id,
          orderNumber: order.orderNumber,
          trackingId: tracking.trackingId,
          status: currentStatus,
          date: order.date,
          estimatedDelivery: order.estimatedDelivery,
          items: order.items || [],
          shippingAddress: order.shippingAddress,
          total: order.total || 0,
          paymentMethod: order.paymentMethod,
          requestType: requestType,
          steps: getTimelineSteps(currentStatus, order.date, requestType),
        });
        
        await fetchReturnRequest(order.id);
        
        toast.success(`Tracking ID ${tracking.trackingId} found!`);
      } else {
        toast.error('Order details not found');
        setOrderStatus(null);
      }
    } else {
      toast.error('No order found with this Tracking ID');
      setOrderStatus(null);
    }
    setIsTracking(false);
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) {
      toast.error('Please enter a Tracking ID');
      return;
    }
    await handleTrackFromId(trackingId);
  };

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    toast.success('Tracking ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ RETURN TIMELINE STEPS (8 Steps)
  const getReturnTimelineSteps = (orderDate: string) => {
    return [
      { name: 'Return Request Submitted', icon: RefreshCw, key: 'Return Requested', description: 'Your return request has been submitted' },
      { name: 'Under Review', icon: Clock, key: 'Return Under Review', description: 'Admin is reviewing your request' },
      { name: 'Approved', icon: CheckCircle, key: 'Return Approved', description: 'Your return has been approved' },
      { name: 'Pickup Scheduled', icon: Truck, key: 'Return Pickup Scheduled', description: 'Pickup has been scheduled' },
      { name: 'Picked Up', icon: Truck, key: 'Return Picked Up', description: 'Product has been picked up' },
      { name: 'Quality Check', icon: Package, key: 'Return Quality Check', description: 'Product is being inspected' },
      { name: 'Refund Initiated', icon: DollarSign, key: 'Return Refund Initiated', description: 'Refund process started' },
      { name: 'Refund Completed', icon: CheckCircle, key: 'Return Refund Completed', description: 'Refund has been completed' },
    ];
  };

  // ✅ EXCHANGE TIMELINE STEPS (9 Steps)
  const getExchangeTimelineSteps = (orderDate: string) => {
    return [
      { name: 'Exchange Request Submitted', icon: RefreshCw, key: 'Exchange Requested', description: 'Your exchange request has been submitted' },
      { name: 'Under Review', icon: Clock, key: 'Exchange Under Review', description: 'Admin is reviewing your request' },
      { name: 'Approved', icon: CheckCircle, key: 'Exchange Approved', description: 'Your exchange has been approved' },
      { name: 'Pickup Scheduled', icon: Truck, key: 'Exchange Pickup Scheduled', description: 'Pickup has been scheduled' },
      { name: 'Picked Up', icon: Truck, key: 'Exchange Picked Up', description: 'Product has been picked up' },
      { name: 'Quality Check', icon: Package, key: 'Exchange Quality Check', description: 'Product is being inspected' },
      { name: 'Replacement Processing', icon: Settings, key: 'Exchange Replacement Processing', description: 'Preparing replacement product' },
      { name: 'Shipped', icon: Truck, key: 'Exchange Shipped', description: 'Replacement product shipped' },
      { name: 'Delivered', icon: Home, key: 'Exchange Delivered', description: 'Replacement delivered successfully' },
    ];
  };

  // ✅ NORMAL ORDER TIMELINE (5 Steps)
  const getNormalOrderSteps = (status: string, orderDate: string) => {
    const steps = [
      { name: 'Order Confirmed', icon: CheckCircle, key: 'Confirmed', description: 'Your order has been confirmed' },
      { name: 'Processing', icon: Clock, key: 'Processing', description: 'Order is being prepared' },
      { name: 'Shipped', icon: Truck, key: 'Shipped', description: 'Order has been dispatched' },
      { name: 'Out for Delivery', icon: Truck, key: 'Out for Delivery', description: 'Out for delivery' },
      { name: 'Delivered', icon: Home, key: 'Delivered', description: 'Order delivered successfully' },
    ];
    
    const statusOrder = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex && currentIndex >= 0,
      current: index === currentIndex,
      date: index <= currentIndex ? (index === 0 ? orderDate : 'Completed') : 'Pending',
    }));
  };

  // ✅ MAIN FUNCTION: Get timeline steps based on request type
  const getTimelineSteps = (orderStatus: string, orderDate: string, requestType?: string) => {
    // If it's a return request
    if (requestType === 'return' || orderStatus.includes('Return')) {
      const steps = getReturnTimelineSteps(orderDate);
      const statusOrder = [
        'Return Requested', 'Return Under Review', 'Return Approved', 
        'Return Pickup Scheduled', 'Return Picked Up', 'Return Quality Check',
        'Return Refund Initiated', 'Return Refund Completed'
      ];
      const currentIndex = statusOrder.findIndex(s => orderStatus.includes(s));
      
      return steps.map((step, index) => ({
        ...step,
        completed: index <= currentIndex && currentIndex >= 0,
        current: index === currentIndex,
        date: index <= currentIndex ? (index === 0 ? orderDate : 'Completed') : 'Pending',
      }));
    }
    
    // If it's an exchange request
    if (requestType === 'exchange' || orderStatus.includes('Exchange')) {
      const steps = getExchangeTimelineSteps(orderDate);
      const statusOrder = [
        'Exchange Requested', 'Exchange Under Review', 'Exchange Approved',
        'Exchange Pickup Scheduled', 'Exchange Picked Up', 'Exchange Quality Check',
        'Exchange Replacement Processing', 'Exchange Shipped', 'Exchange Delivered'
      ];
      const currentIndex = statusOrder.findIndex(s => orderStatus.includes(s));
      
      return steps.map((step, index) => ({
        ...step,
        completed: index <= currentIndex && currentIndex >= 0,
        current: index === currentIndex,
        date: index <= currentIndex ? (index === 0 ? orderDate : 'Completed') : 'Pending',
      }));
    }
    
    // Normal order timeline
    return getNormalOrderSteps(orderStatus, orderDate);
  };

  const formatPrice = (price: number) => {
    const num = Number(price);
    if (isNaN(num) || num === 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('return')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (statusLower.includes('exchange')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    if (statusLower.includes('cancelled')) return 'bg-red-100 text-red-800 border-red-200';
    if (statusLower.includes('delivered')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('return') || statusLower.includes('exchange')) return <RefreshCw className="w-4 h-4" />;
    if (statusLower.includes('cancelled')) return <XCircle className="w-4 h-4" />;
    if (statusLower.includes('delivered')) return <CheckCircle className="w-4 h-4" />;
    if (statusLower.includes('shipped')) return <Truck className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
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

  const getBreadcrumbs = () => {
    if (fromOrderHistory) {
      return [
        { label: 'Home', path: '/' },
        { label: 'My Orders', path: '/order-summary' },
        { label: 'Track Order' }
      ];
    } else {
      return [
        { label: 'Home', path: '/' },
        { label: 'Track Order' }
      ];
    }
  };

  // ✅ REMOVED: const returnSteps = getReturnTrackingSteps(); - This line was causing error

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Track Your Order"
          subtitle="Enter Tracking ID"
          breadcrumbs={getBreadcrumbs()}
        />

        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            
            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/30 p-6 rounded-sm mb-8"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Track Your Order
              </h2>

              <form onSubmit={handleTrack} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter Tracking ID (e.g., TRK123456)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  className="flex-1 p-3 bg-background border border-border/30 rounded-sm focus:border-primary focus:outline-none text-foreground"
                />
                <button
                  type="submit"
                  disabled={isTracking}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isTracking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Track
                </button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-3">
                Enter the Tracking ID you received in your order confirmation
              </p>
            </motion.div>

            {orderStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Order Summary Card */}
                <div className="bg-card border border-border/30 rounded-sm overflow-hidden">
                  <div className="bg-muted/30 px-6 py-4 border-b border-border/30">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">TRACKING ID</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-lg font-semibold text-primary">
                            {orderStatus.trackingId}
                          </p>
                          <button
                            onClick={copyTrackingId}
                            className="p-1 hover:bg-primary/10 rounded transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ORDER NUMBER</p>
                        <p className="text-sm font-medium text-foreground">{orderStatus.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ORDER DATE</p>
                        <p className="text-sm font-medium text-foreground">{formatDate(orderStatus.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">TOTAL</p>
                        <p className="text-xl font-bold text-primary">{formatPrice(orderStatus.total)}</p>
                      </div>
                      <div>
                        <StatusBadge status={orderStatus.status || 'Confirmed'} />
                      </div>
                    </div>
                  </div>

                  {/* Return/Exchange Status Banner */}
                  {returnRequest && (
                    <div className={`px-6 py-3 border-b ${
                      returnRequest.requestType === 'return' ? 'bg-purple-50 border-purple-200' : 'bg-cyan-50 border-cyan-200'
                    }`}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold">
                            {returnRequest.requestType === 'return' ? 'Return Request' : 'Exchange Request'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            returnRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            returnRequest.status === 'approved' ? 'bg-green-100 text-green-700' :
                            returnRequest.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            returnRequest.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {returnRequest.status.toUpperCase()}
                          </span>
                        </div>
                        {returnRequest.refundStatus === 'completed' && (
                          <div className="flex items-center gap-1 text-green-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs">Refund of {formatPrice(returnRequest.refundAmount)} processed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="px-6 py-4 border-b border-border/30">
                    <h3 className="font-semibold text-foreground mb-3">Items</h3>
                    <div className="space-y-3">
                      {orderStatus.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img 
                            src={item.image || '/placeholder-image.jpg'} 
                            alt={item.name || 'Product'} 
                            className="w-16 h-16 object-cover rounded-sm border border-border/30"
                            onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name || 'Product'}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity || 1}</p>
                            {item.productSku && (
                              <p className="text-xs text-muted-foreground">SKU: {item.productSku}</p>
                            )}
                          </div>
                          <p className="font-semibold text-primary">{formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {orderStatus.shippingAddress && (
                    <div className="px-6 py-4 border-b border-border/30">
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Delivery Address
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        <p>{orderStatus.shippingAddress.firstName} {orderStatus.shippingAddress.lastName}</p>
                        <p>{orderStatus.shippingAddress.address || orderStatus.shippingAddress.street}</p>
                        <p>{orderStatus.shippingAddress.city}, {orderStatus.shippingAddress.state} - {orderStatus.shippingAddress.zip || orderStatus.shippingAddress.pincode}</p>
                      </div>
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  {orderStatus.estimatedDelivery && orderStatus.status !== 'Delivered' && orderStatus.status !== 'Cancelled' && !orderStatus.status.includes('Return') && !orderStatus.status.includes('Exchange') && (
                    <div className="bg-primary/5 px-6 py-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Estimated Delivery: <span className="text-foreground font-medium">{orderStatus.estimatedDelivery}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Timeline - Shows based on request type */}
                <div className="bg-card border border-border/30 rounded-sm p-6">
                  <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                    {orderStatus.requestType === 'return' ? <RefreshCw className="w-5 h-5 text-purple-600" /> : 
                     orderStatus.requestType === 'exchange' ? <RefreshCw className="w-5 h-5 text-cyan-600" /> :
                     <Package className="w-5 h-5 text-primary" />}
                    {orderStatus.requestType === 'return' ? 'Return Timeline' : 
                     orderStatus.requestType === 'exchange' ? 'Exchange Timeline' : 'Order Timeline'}
                  </h3>
                  <div className="relative">
                    {orderStatus.steps.map((step: any, index: number) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="flex gap-4 mb-8 last:mb-0 relative">
                          {index < orderStatus.steps.length - 1 && (
                            <div className={`absolute left-5 top-10 w-0.5 h-12 ${step.completed ? 'bg-primary' : 'bg-border'}`} />
                          )}
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className={`font-semibold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">{step.date}</p>
                            <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                            {step.trackingNumber && (
                              <div className="flex items-center gap-2 mt-2">
                                <p className="text-xs text-primary font-mono">{step.trackingNumber}</p>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(step.trackingNumber);
                                    toast.success('Tracking number copied!');
                                  }}
                                  className="p-0.5 hover:bg-primary/10 rounded"
                                >
                                  <Copy className="w-3 h-3 text-muted-foreground" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Support Section */}
                <div className="bg-muted/20 border border-border/30 rounded-sm p-4">
                  <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
                  <div className="flex flex-wrap gap-4">
                    <a href="mailto:support@jewelskart.com" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Mail className="w-4 h-4" />
                      support@jewelskart.com
                    </a>
                    <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Phone className="w-4 h-4" />
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Link
                    to="/order-summary"
                    className="flex-1 border border-primary text-primary py-3 rounded-sm text-center hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    View Order History
                  </Link>
                  <Link to="/shop" className="flex-1 bg-primary text-primary-foreground py-3 rounded-sm text-center hover:bg-primary/90 transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!orderStatus && !isTracking && (
              <div className="text-center py-16 bg-card border border-border/30 rounded-sm">
                <Package className="w-20 h-20 mx-auto mb-4 text-primary/30" />
                <h3 className="text-xl text-foreground mb-2">Enter Tracking ID</h3>
                <p className="text-muted-foreground">
                  Enter your tracking ID to track your order
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    to="/order-summary" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-primary text-primary rounded-sm hover:bg-primary/10 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    My Orders
                  </Link>
                  <Link 
                    to="/shop" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
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