import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, Loader2, X, Copy } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Step = 'login' | 'shipping' | 'summary' | 'payment' | 'confirmation';
type PaymentMethod = 'cod' | 'upi' | 'card';

const Checkout = () => {
  const { isAuthenticated, isLoading: authLoading, login, register } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const { placeOrder, isLoading: orderLoading, resetLoading } = useOrderStore();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState(''); // ✅ Store full order number
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupOrderNumber, setPopupOrderNumber] = useState(''); // ✅ Full order number for popup
  const [popupTotal, setPopupTotal] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authLoading2, setAuthLoading2] = useState(false);
  
  // Shipping form states
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  useEffect(() => {
    return () => {
      resetLoading();
    };
  }, [resetLoading]);

  // Cart empty check
  useEffect(() => {
    if (items.length === 0 && currentStep !== 'confirmation' && !showPopup) {
      navigate('/cart');
    }
  }, [items, navigate, currentStep, showPopup]);

  useEffect(() => {
    if (isAuthenticated && currentStep === 'login') {
      setCurrentStep('shipping');
    }
  }, [isAuthenticated, currentStep]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setCurrentStep('login');
    }
  }, [authLoading, isAuthenticated]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // ✅ Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Order ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    setAuthLoading2(true);
    const success = await login(loginEmail, loginPassword);
    setAuthLoading2(false);
    if (success) {
      toast.success('Logged in successfully!');
      setCurrentStep('shipping');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !registerFirstName) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (registerPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setAuthLoading2(true);
    const success = await register(registerEmail, registerPassword, registerFirstName, registerLastName);
    setAuthLoading2(false);
    if (success) {
      toast.success('Account created! Continuing checkout...');
      setCurrentStep('shipping');
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.firstName || !shippingData.email || !shippingData.address || !shippingData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCurrentStep('summary');
  };

  const subtotal = getTotal();
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shipping;

  // ✅ Handle place order - Get full order number from response
  const handlePlaceOrder = async () => {
    console.log('🟢 Place order started');
    setIsPlacingOrder(true);
    
    try {
      const newOrderId = await placeOrder(items, shippingData, paymentMethod, total);
      console.log('🟢 Order result:', newOrderId);
      
      if (newOrderId) {
        // ✅ Fetch the order details to get the full order number
        const token = localStorage.getItem('customer_token');
        const response = await fetch(`http://localhost:5000/api/orders/${newOrderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        const fullOrderNumber = data.order?.orderNumber || newOrderId;
        console.log('🟢 Full Order Number:', fullOrderNumber);
        
        // Store full order number
        setOrderNumber(fullOrderNumber);
        setOrderId(newOrderId);
        
        // Show popup with full order number
        setPopupOrderNumber(fullOrderNumber);
        setPopupTotal(total);
        setShowPopup(true);
        console.log('🟢 Popup should show now with order:', fullOrderNumber);
        
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('🔴 Order error:', error);
      toast.error('Something went wrong! Please try again.');
    } finally {
      setIsPlacingOrder(false);
      resetLoading();
    }
  };

  // Handle popup close
  const handlePopupClose = () => {
    setShowPopup(false);
    clearCart();
    setCurrentStep('confirmation');
  };

  // Handle continue shopping from popup
  const handleContinueShopping = () => {
    setShowPopup(false);
    clearCart();
    navigate('/shop');
  };

  // Handle view orders from popup
  const handleViewOrders = () => {
    setShowPopup(false);
    clearCart();
    navigate('/order-summary');
  };

  if (items.length === 0 && currentStep !== 'confirmation' && !showPopup) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 lg:pt-24">
          <InnerPageBanner
            title="Checkout"
            breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Checkout' }]}
          />
          <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
            <h2 className="font-display text-2xl text-foreground mb-4">Your cart is empty</h2>
            <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-md inline-block">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Checkout"
          subtitle="Secure Checkout"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }, { label: 'Checkout' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-8">
          {currentStep !== 'confirmation' && (
            <div className="flex items-center justify-center gap-2 mb-12">
              {(['login', 'shipping', 'summary', 'payment'] as Step[]).map((step) => {
                const stepOrder = ['login', 'shipping', 'summary', 'payment'];
                const currentIndex = stepOrder.indexOf(currentStep);
                const isActive = stepOrder.indexOf(step) <= currentIndex;
                const isCurrent = currentStep === step;
                
                if (step === 'login' && isAuthenticated) return null;
                
                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isActive && currentIndex > stepOrder.indexOf(step) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        stepOrder.indexOf(step) + 1
                      )}
                    </div>
                    <span className={`ml-2 text-sm hidden sm:block ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step === 'login' ? 'Account' : step.charAt(0).toUpperCase() + step.slice(1)}
                    </span>
                    {step !== 'payment' && (
                      <div className={`w-8 lg:w-16 h-px mx-2 ${isActive ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            {/* Login Step */}
            {currentStep === 'login' && !isAuthenticated && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-2xl text-foreground text-center">Sign in to continue</h2>
                <div className="flex mb-4">
                  {(['login', 'register'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAuthTab(tab)}
                      className={`flex-1 py-3 text-center text-sm uppercase tracking-wider transition-colors ${
                        authTab === tab ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border/30'
                      }`}
                    >
                      {tab === 'login' ? 'Sign In' : 'Register'}
                    </button>
                  ))}
                </div>
                {authTab === 'login' && (
                  <form onSubmit={handleLogin} className="bg-card p-6 border border-border/30 space-y-4">
                    <Input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="bg-background" required />
                    <Input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="bg-background" required />
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-md" disabled={authLoading2}>
                      {authLoading2 ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign In & Continue'}
                    </button>
                  </form>
                )}
                {authTab === 'register' && (
                  <form onSubmit={handleRegister} className="bg-card p-6 border border-border/30 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First Name *" value={registerFirstName} onChange={(e) => setRegisterFirstName(e.target.value)} className="bg-background" required />
                      <Input placeholder="Last Name" value={registerLastName} onChange={(e) => setRegisterLastName(e.target.value)} className="bg-background" />
                    </div>
                    <Input type="email" placeholder="Email *" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="bg-background" required />
                    <Input type="password" placeholder="Password *" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="bg-background" required />
                    <Input type="password" placeholder="Confirm Password *" value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} className="bg-background" required />
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-md" disabled={authLoading2}>
                      {authLoading2 ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Account & Continue'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-2xl text-foreground">Shipping Details</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="First Name *" value={shippingData.firstName} onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })} className="bg-card" required />
                    <Input placeholder="Last Name" value={shippingData.lastName} onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })} className="bg-card" />
                  </div>
                  <Input type="email" placeholder="Email *" value={shippingData.email} onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })} className="bg-card" required />
                  <Input placeholder="Phone *" value={shippingData.phone} onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })} className="bg-card" required />
                  <Input placeholder="Address *" value={shippingData.address} onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })} className="bg-card" required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="City" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} className="bg-card" />
                    <Input placeholder="State" value={shippingData.state} onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })} className="bg-card" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="PIN Code" value={shippingData.zip} onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })} className="bg-card" />
                    <Input placeholder="Country" value={shippingData.country} disabled className="bg-card opacity-60" />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-3 rounded-md">Continue to Summary</button>
                </form>
              </motion.div>
            )}

            {/* Summary Step */}
            {currentStep === 'summary' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-2xl text-foreground">Order Summary</h2>
                <div className="bg-card p-6 border border-border/30 rounded-sm space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-4">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-sm" />
                      <div className="flex-1">
                        <p className="text-foreground">{item.product.name}</p>
                        <p className="text-muted-foreground text-sm">Qty: {item.quantity}{item.size && ` • Size: ${item.size}`}</p>
                      </div>
                      <span className="text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-card p-6 border border-border/30 rounded-sm">
                  <h3 className="font-display text-lg text-foreground mb-2">Shipping Address</h3>
                  <p className="text-muted-foreground text-sm">
                    {shippingData.firstName} {shippingData.lastName}<br />
                    {shippingData.address}<br />
                    {shippingData.city}, {shippingData.state} {shippingData.zip}<br />
                    {shippingData.country}
                  </p>
                </div>
                <div className="bg-card p-6 border border-border/30 rounded-sm space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-border/30 pt-3 flex justify-between">
                    <span className="font-display text-lg text-foreground">Total</span>
                    <span className="font-display text-xl text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setCurrentStep('shipping')} className="flex-1 border border-primary text-primary py-3 rounded-md flex items-center justify-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</button>
                  <button onClick={() => setCurrentStep('payment')} className="flex-1 bg-primary text-white py-3 rounded-md">Proceed to Payment</button>
                </div>
              </motion.div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-2xl text-foreground">Payment Method</h2>
                <div className="flex border border-border/30">
                  {(['cod', 'upi', 'card'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex-1 py-3 text-sm uppercase tracking-wider transition-colors ${
                        paymentMethod === method ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
                      }`}
                    >
                      {method === 'cod' ? 'Cash on Delivery' : method.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="bg-card p-6 border border-border/30 rounded-sm">
                  {paymentMethod === 'cod' && (
                    <div className="text-center py-4">
                      <p className="text-foreground mb-2">Pay when your order arrives</p>
                      <p className="text-muted-foreground text-sm">No additional charges for COD</p>
                    </div>
                  )}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <Input placeholder="Enter UPI ID (e.g., name@upi)" className="bg-background" />
                    </div>
                  )}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <Input placeholder="Card Number" className="bg-background" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" className="bg-background" />
                        <Input placeholder="CVV" className="bg-background" />
                      </div>
                      <Input placeholder="Cardholder Name" className="bg-background" />
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setCurrentStep('summary')} className="flex-1 border border-primary text-primary py-3 rounded-md flex items-center justify-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || orderLoading}
                    className="flex-1 bg-primary text-white py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPlacingOrder || orderLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Complete Order • ${formatPrice(total)}`}
                  </button>
                </div>
                <p className="text-muted-foreground text-xs text-center">By placing this order, you agree to our terms and conditions</p>
              </motion.div>
            )}

            {/* Confirmation Step - With Full Order Number */}
            {currentStep === 'confirmation' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-primary-foreground" />
                </div>
                <h1 className="font-display text-3xl text-foreground mb-4">Thank You for Your Order!</h1>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <p className="text-muted-foreground">Order Number:</p>
                  <p className="font-mono font-semibold text-primary text-lg">{orderNumber}</p>
                  <button
                    onClick={() => copyToClipboard(orderNumber)}
                    className="p-1 hover:bg-primary/10 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-muted-foreground mb-8">A confirmation has been sent to {shippingData.email}</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link to="/order-summary" className="border border-primary text-primary px-6 py-3 rounded-md">View Orders</Link>
                  <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-md">Continue Shopping</Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* ✅ SUCCESS POPUP - With Full Order Number */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-900"
            >
              <button
                onClick={handlePopupClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                🎉 Order Successful!
              </h2>

              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Thank you for your order!
              </p>

              <div className="mb-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Number</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="font-mono text-lg font-semibold text-primary">
                    {popupOrderNumber}
                  </p>
                  <button
                    onClick={() => copyToClipboard(popupOrderNumber)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors dark:hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="text-xl font-bold text-primary">{formatPrice(popupTotal)}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleViewOrders}
                  className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary/90"
                >
                  View My Orders
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
                >
                  Continue Shopping
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-400">Click outside or X to close</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;