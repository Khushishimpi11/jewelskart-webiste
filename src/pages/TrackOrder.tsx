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
  XCircle, Mail, Phone, MapPin, DollarSign, Settings
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
  const [searchId, setSearchId] = useState('');
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [returnRequest, setReturnRequest] = useState<ReturnRequestInfo | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fromOrderHistory, setFromOrderHistory] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);
  const [productImagesMap, setProductImagesMap] = useState<Record<string, string>>({});
  const [isOrdersLoaded, setIsOrdersLoaded] = useState(false);
  const [pendingSearchId, setPendingSearchId] = useState<string | null>(null);
  
  const { getTrackingByTrackingId, fetchMyOrders, orders } = useOrderStore();

  // Fetch product images
  const fetchProductImage = async (productId: string) => {
    if (productImagesMap[productId]) return productImagesMap[productId];
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.product) {
        const imageUrl = data.product.mainImage?.url || data.product.images?.[0] || '';
        setProductImagesMap(prev => ({ ...prev, [productId]: imageUrl }));
        return imageUrl;
      }
    } catch (error) {
      console.error('Error fetching product image:', error);
    }
    return '';
  };

  // Fetch orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      await fetchMyOrders();
      setIsOrdersLoaded(true);
    };
    loadOrders();
  }, [fetchMyOrders]);

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

  // Search order by ID (works with both Tracking ID and Order ID)
  const searchOrder = async (id: string) => {
    if (!id) {
      toast.error('Please enter an ID');
      return;
    }

    setIsTracking(true);
    setOrderStatus(null);
    setReturnRequest(null);
    
    // First try as Tracking ID
    const tracking = await getTrackingByTrackingId(id);
    
    if (tracking && tracking.orderId) {
      const order = orders.find(o => o.id === tracking.orderId || o.orderNumber === tracking.orderNumber);
      
      if (order) {
        await displayOrderDetails(order, tracking.trackingId);
        toast.success(`Order found!`);
        setIsTracking(false);
        return;
      }
    }
    
    // If not found as Tracking ID, try as Order ID
    const foundOrder = orders.find(o => o.orderNumber === id || o.id === id);
    
    if (foundOrder) {
      const trackingNumber = foundOrder.trackingNumber;
      if (trackingNumber) {
        await displayOrderDetails(foundOrder, trackingNumber);
      } else {
        await displayOrderDetails(foundOrder, null);
      }
      toast.success(`Order #${id} found!`);
    } else {
      toast.error('No order found with this Tracking ID or Order ID');
      setOrderStatus(null);
    }
    
    setIsTracking(false);
  };

  const displayOrderDetails = async (order: any, trackingId: string | null) => {
    const currentStatus = order.status || 'Confirmed';
    let requestType: string | undefined;
    
    if (returnRequest) {
      requestType = returnRequest.requestType;
    }
    
    // Fetch images for all items
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        if (item.productId) {
          await fetchProductImage(item.productId);
        }
      }
    }
    
    // Calculate estimated delivery date if not present
    let estimatedDelivery = order.estimatedDelivery;
    if (!estimatedDelivery && order.date) {
      const deliveryDate = new Date(order.date);
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    
    setOrderStatus({
      id: order.id,
      orderNumber: order.orderNumber,
      trackingId: trackingId || 'N/A',
      status: currentStatus,
      date: order.date,
      estimatedDelivery: estimatedDelivery,
      items: order.items || [],
      shippingAddress: order.shippingAddress,
      total: order.total || 0,
      paymentMethod: order.paymentMethod,
      requestType: requestType,
      steps: getTimelineSteps(currentStatus, order.date, requestType),
    });
    
    await fetchReturnRequest(order.id);
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      toast.error('Please enter a Tracking ID or Order ID');
      return;
    }
    await searchOrder(searchId.trim());
  };

  const copyId = () => {
    navigator.clipboard.writeText(searchId);
    setCopied(true);
    toast.success('ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle URL params and state on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get('id');
    
    // Also support ?order= and ?tracking= for backward compatibility
    if (!idParam) idParam = urlParams.get('order');
    if (!idParam) idParam = urlParams.get('tracking');
    
    if (idParam) {
      setSearchId(idParam);
      
      if (isOrdersLoaded && orders.length > 0) {
        searchOrder(idParam);
      } else {
        setPendingSearchId(idParam);
      }
      setFromOrderHistory(true);
    } else if (location.state?.fromOrderHistory === true) {
      setFromOrderHistory(true);
    } else if (location.state?.trackingId) {
      const id = location.state.trackingId;
      setSearchId(id);
      if (isOrdersLoaded && orders.length > 0) {
        searchOrder(id);
      } else {
        setPendingSearchId(id);
      }
      setFromOrderHistory(true);
    } else if (location.state?.orderNumber) {
      const orderNumber = location.state.orderNumber;
      setSearchId(orderNumber);
      if (isOrdersLoaded && orders.length > 0) {
        searchOrder(orderNumber);
      } else {
        setPendingSearchId(orderNumber);
      }
      setFromOrderHistory(true);
    } else {
      setFromOrderHistory(false);
    }
  }, [location.state, orders, isOrdersLoaded]);

  // When orders are loaded, search for pending ID
  useEffect(() => {
    if (isOrdersLoaded && pendingSearchId) {
      searchOrder(pendingSearchId);
      setPendingSearchId(null);
    }
  }, [isOrdersLoaded, pendingSearchId]);

  // RETURN TIMELINE STEPS
  const getReturnTimelineSteps = () => {
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

  // EXCHANGE TIMELINE STEPS
  const getExchangeTimelineSteps = () => {
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

  // NORMAL ORDER TIMELINE
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

  // Get timeline steps based on request type
  const getTimelineSteps = (orderStatusStr: string, orderDate: string, requestType?: string) => {
    if (requestType === 'return' || orderStatusStr.includes('Return')) {
      const steps = getReturnTimelineSteps();
      const statusOrder = [
        'Return Requested', 'Return Under Review', 'Return Approved', 
        'Return Pickup Scheduled', 'Return Picked Up', 'Return Quality Check',
        'Return Refund Initiated', 'Return Refund Completed'
      ];
      const currentIndex = statusOrder.findIndex(s => orderStatusStr.includes(s));
      
      return steps.map((step, index) => ({
        ...step,
        completed: index <= currentIndex && currentIndex >= 0,
        current: index === currentIndex,
        date: index <= currentIndex ? (index === 0 ? orderDate : 'Completed') : 'Pending',
      }));
    }
    
    if (requestType === 'exchange' || orderStatusStr.includes('Exchange')) {
      const steps = getExchangeTimelineSteps();
      const statusOrder = [
        'Exchange Requested', 'Exchange Under Review', 'Exchange Approved',
        'Exchange Pickup Scheduled', 'Exchange Picked Up', 'Exchange Quality Check',
        'Exchange Replacement Processing', 'Exchange Shipped', 'Exchange Delivered'
      ];
      const currentIndex = statusOrder.findIndex(s => orderStatusStr.includes(s));
      
      return steps.map((step, index) => ({
        ...step,
        completed: index <= currentIndex && currentIndex >= 0,
        current: index === currentIndex,
        date: index <= currentIndex ? (index === 0 ? orderDate : 'Completed') : 'Pending',
      }));
    }
    
    return getNormalOrderSteps(orderStatusStr, orderDate);
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
        year: 'numeric'
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
        { label: 'Track Order', path: '/track-order' }
      ];
    } else {
      return [
        { label: 'Home', path: '/' },
        { label: 'Track Order', path: '/track-order' }
      ];
    }
  };

  // Show loading while orders are being fetched
  if (!isOrdersLoaded && !orderStatus && pendingSearchId === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-24">
          <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your orders...</p>
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
          title="Track Your Order"
          subtitle="Enter Tracking ID or Order ID"
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
                  placeholder="Enter Tracking ID or Order ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value.toUpperCase())}
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
                Enter your Tracking ID (e.g., TRK123456) or Order ID to track your order
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
                        <p className="text-sm text-muted-foreground">ORDER NUMBER</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-lg font-semibold text-primary">
                            {orderStatus.orderNumber}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(orderStatus.orderNumber);
                              toast.success('Order number copied!');
                            }}
                            className="p-1 hover:bg-primary/10 rounded transition-colors"
                          >
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">TRACKING ID</p>
                        <p className="text-sm font-medium text-foreground font-mono">{orderStatus.trackingId}</p>
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

                  {/* ORDER ITEMS */}
                  <div className="px-6 py-4 border-b border-border/30">
                    <h3 className="font-semibold text-foreground mb-3">Items</h3>
                    <div className="space-y-3">
                      {orderStatus.items && orderStatus.items.length > 0 ? (
                        orderStatus.items.map((item: any, idx: number) => {
                          const productSize = item.size || item.selectedSize || '';
                          
                          let productImage = productImagesMap[item.productId] || item.image || item.productImage || '';
                          if (!productImage) {
                            productImage = `https://placehold.co/200x200/3b82f6/white?text=${encodeURIComponent((item.name || 'P').substring(0, 1))}`;
                          }
                          
                          return (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="w-16 h-16 flex-shrink-0">
                                <img 
                                  src={productImage}
                                  alt={item.name || 'Product'}
                                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://placehold.co/200x200/3b82f6/white?text=${encodeURIComponent((item.name || 'P').substring(0, 1))}`;
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{item.name || item.productName || 'Product'}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity || 1}</p>
                                  {productSize && productSize !== '' ? (
                                    <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full text-primary">
                                      Size: {productSize}
                                    </span>
                                  ) : (
                                    <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full text-primary">
                                      Free Size
                                    </span>
                                  )}
                                  {item.productSku && (
                                    <p className="text-xs text-muted-foreground">SKU: {item.productSku}</p>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{formatPrice(item.price || 0)} each</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-primary">{formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-muted-foreground py-4">No items found</p>
                      )}
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

                {/* Order Timeline */}
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
                          <div className="flex-1">
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
                <h3 className="text-xl text-foreground mb-2">Track Your Order</h3>
                <p className="text-muted-foreground">
                  Enter your Tracking ID or Order ID to track your order
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