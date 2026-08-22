import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, Loader2, Copy, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { formatCoupleOrRingSize } from '@/utils/coupleRing';
import { calculateEstimatedDelivery } from '@/utils/deliveryCalculator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// ✅ FIXED: Define API_BASE_URL properly with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type Step = 'login' | 'shipping' | 'summary' | 'payment' | 'confirmation';
type PaymentMethod = 'cod' | 'online';

declare global {
  interface Window {
    ZPayments?: any;
  }
}

const Checkout = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading, login, register, googleLogin, user } = useAuthStore();
  const { items: cartItems, clearCart } = useCartStore();
  const { isLoading: orderLoading, resetLoading } = useOrderStore();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [isBuyNow, setIsBuyNow] = useState(false);

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

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');

  // ✅ FIXED: Read items from location.state or cart
  useEffect(() => {
    console.log("🔍 Checkout mounted - Location state:", location.state);

    // Priority 1: Items from Cart page (via navigate state)
    if (location.state?.fromCart && location.state?.selectedItems) {
      setCheckoutItems(location.state.selectedItems);
      setIsBuyNow(false);
      console.log("✅ Cart Mode - Items from state:", location.state.selectedItems.length);
      return;
    }

    // Priority 2: Buy Now from Product Card / Product Detail
    if (location.state?.isBuyNow && location.state?.buyNowProduct) {
      const buyNowProduct = location.state.buyNowProduct;
      setCheckoutItems([{
        product: buyNowProduct.product,
        quantity: buyNowProduct.quantity || 1,
        size: buyNowProduct.size,
        material: buyNowProduct.material || buyNowProduct.product?.material
      }]);
      setIsBuyNow(true);
      console.log("✅ Buy Now Mode - Single product");
      return;
    }

    // Priority 3: Fallback to cart store
    setCheckoutItems(cartItems);
    setIsBuyNow(false);
    console.log("✅ Fallback to cart store - Items:", cartItems.length);

  }, [location.state, cartItems]);

  useEffect(() => {
    return () => {
      resetLoading();
    };
  }, [resetLoading]);

  // ✅ FIXED: NO REDIRECT - Just log and stay on page
  useEffect(() => {
    console.log("🛒 Checkout Status:", {
      itemsCount: checkoutItems.length,
      currentStep,
      isBuyNow,
      isOrderCompleted
    });
  }, [checkoutItems, currentStep, isBuyNow, isOrderCompleted]);

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

  // Google Login Handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Success:", tokenResponse);
      const success = await googleLogin(tokenResponse.access_token);
      if (success) {
        toast.success('Successfully signed in with Google!');
        setCurrentStep('shipping');
      } else {
        toast.error('Google sign in failed. Please try again.');
      }
    },
    onError: (error) => {
      console.log("Google error:", error);
      toast.error('Google sign in failed');
    },
  });

  const handleGoogleButtonClick = () => {
    console.log("🔵 Google Sign-In button clicked in Checkout!");
    handleGoogleLogin();
  };

  // ✅ Load Zoho SDK with timeout + retry
  const loadZohoPaymentsScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('🔄 [ZPay] Checking if ZPayments SDK already loaded...');

      if (window.ZPayments) {
        console.log('✅ [ZPay] ZPayments already available on window');
        resolve(true);
        return;
      }

      // Check if script is already being injected
      const existing = document.querySelector('script[src*="zpayments.js"]');
      if (existing) {
        console.log('🔄 [ZPay] Script tag already in DOM, waiting for it to load...');
        const poll = setInterval(() => {
          if (window.ZPayments) {
            clearInterval(poll);
            console.log('✅ [ZPay] ZPayments loaded (poll)');
            resolve(true);
          }
        }, 100);
        // Timeout after 10s
        setTimeout(() => {
          clearInterval(poll);
          console.warn('⚠️ [ZPay] SDK poll timeout after 10s');
          resolve(!!window.ZPayments);
        }, 10000);
        return;
      }

      console.log('📥 [ZPay] Injecting ZPayments SDK script...');
      const script = document.createElement('script');
      script.src = 'https://static.zohocdn.com/zpay/zpay-js/v1/zpayments.js';
      script.async = true;

      script.onload = () => {
        console.log('✅ [ZPay] Script onload fired. window.ZPayments:', typeof window.ZPayments);
        // Give it a tick to initialize
        setTimeout(() => resolve(!!window.ZPayments), 200);
      };

      script.onerror = (e) => {
        console.error('❌ [ZPay] Failed to load ZPayments SDK script:', e);
        resolve(false);
      };

      document.body.appendChild(script);

      // Timeout fallback
      setTimeout(() => {
        if (!window.ZPayments) {
          console.warn('⚠️ [ZPay] Script load timeout after 15s');
          resolve(false);
        }
      }, 15000);
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

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

    // Email format validation
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setAuthLoading2(true);
    const success = await login(loginEmail, loginPassword);
    setAuthLoading2(false);

    if (success) {
      toast.success('Logged in successfully!');
      setCurrentStep('shipping');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
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

    // Email format validation
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setAuthLoading2(true);
    const success = await register(registerEmail, registerPassword, registerFirstName, registerLastName);
    setAuthLoading2(false);

    if (success) {
      toast.success('Account created! Continuing checkout...');
      setCurrentStep('shipping');
    } else {
      toast.error('Registration failed. Email may already be registered.');
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

  const handleCODOrder = async () => {
    setIsPlacingOrder(true);

    try {
      const authUser = user;
      const token = localStorage.getItem('customer_token') || localStorage.getItem('admin_token');

      const subtotal = checkoutItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      // GST exclusive: calculated on top of product price
      const gstAmount = checkoutItems.reduce((sum, item) => {
        const gst = item.product.gst ?? 3;
        return sum + (item.product.price * item.quantity * gst / 100);
      }, 0);
      const shippingCharge = 1200;
      const total = subtotal + gstAmount + shippingCharge;

      const orderData = {
        items: checkoutItems.map(item => ({
          productId: item.product.id || item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          material: item.material || item.product?.material || '',
          ringOption: item.ringOption || item.product?.ringOption || '',
          name: item.product.name,
          image: item.product.image
        })),
        shippingAddress: {
          street: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.zip,
          country: shippingData.country
        },
        paymentMethod: 'COD',
        customerPhone: shippingData.phone,
        customerId: authUser?.id || authUser?._id,
        userId: authUser?.id || authUser?._id,
        customerName: authUser?.name || `${shippingData.firstName} ${shippingData.lastName}`,
        customerEmail: authUser?.email || shippingData.email,
        totalAmount: total,
        subtotal: subtotal,
        shippingCharge: shippingCharge,
        tax: Math.round(gstAmount),
        discount: 0,
        notes: ""
      };

      console.log('📦 Creating COD order:', orderData);

      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      const newOrderId = data.order?._id || data.order?.id;
      const newOrderNumber = data.order?.orderNumber || newOrderId;

      setOrderNumber(newOrderNumber);
      setOrderId(newOrderId);

      toast.success("Order placed successfully!");

      setIsOrderCompleted(true);
      setCurrentStep('confirmation');

      if (!isBuyNow) {
        setTimeout(() => {
          clearCart();
        }, 100);
      }
    } finally {
      setIsPlacingOrder(false);
      resetLoading();
    }
  };

  const handleZohoPayment = async () => {
    console.log('🟢 ============ PAY ONLINE CLICKED ============');
    console.log('🟢 [Step 1] handleZohoPayment() started');
    console.log('🟢 [Step 1] checkoutItems:', checkoutItems.length, 'items');
    console.log('🟢 [Step 1] paymentMethod:', paymentMethod);

    setIsProcessingPayment(true);

    try {
      // ── STEP 1: Check token ────────────────────────────────────
      const token = localStorage.getItem('customer_token') || localStorage.getItem('admin_token');
      console.log('🔑 [Step 1] Auth token present:', !!token);
      if (!token) {
        toast.error('You must be logged in to pay. Please login and try again.');
        setIsProcessingPayment(false);
        return;
      }

      // ── STEP 2: Compute totals (display / order payload) ──────
      const authUser = user;
      const subtotal = checkoutItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      // GST exclusive: calculated on top
      const gstAmount = checkoutItems.reduce((sum, item) => {
        const gst = item.product.gst ?? 3;
        return sum + (item.product.price * item.quantity * gst / 100);
      }, 0);
      const shippingCost = 1200;
      const total = subtotal + gstAmount + shippingCost;

      console.log('💰 [Step 2] Totals — subtotal:', subtotal, '| gst:', gstAmount, '| shipping:', shippingCost, '| total:', total);

      if (total <= 0) {
        toast.error('Invalid order total. Please go back and try again.');
        setIsProcessingPayment(false);
        return;
      }

      // ── STEP 3: Read env vars (needed for session + widget) ───
      const accountId = import.meta.env.VITE_ZOHO_ACCOUNT_ID as string | undefined;
      if (!accountId) {
        toast.error('Payment configuration error: VITE_ZOHO_ACCOUNT_ID is not set.');
        setIsProcessingPayment(false);
        return;
      }

      const apiKey = import.meta.env.VITE_ZOHO_API_KEY as string | undefined;
      if (!apiKey) {
        toast.error('Payment configuration error: VITE_ZOHO_API_KEY is not set.');
        setIsProcessingPayment(false);
        return;
      }

      // ── STEP 4: Create backend order ───────────────────────────
      const orderData = {
        items: checkoutItems.map(item => ({
          productId: item.product.id || item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          material: item.material || item.product?.material || '',
          ringOption: item.ringOption || item.product?.ringOption || '',
          name: item.product.name,
          image: item.product.image
        })),
        shippingAddress: {
          street: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.zip,
          country: shippingData.country
        },
        paymentMethod: 'ONLINE',
        customerPhone: shippingData.phone,
        customerId: authUser?.id || authUser?._id,
        userId: authUser?.id || authUser?._id,
        customerName: authUser?.name || `${shippingData.firstName} ${shippingData.lastName}`.trim(),
        customerEmail: authUser?.email || shippingData.email,
        totalAmount: total,
        subtotal,
        shippingCharge: shippingCost,
        tax: Math.round(gstAmount),
        discount: 0,
        notes: ''
      };

      console.log('📦 [Step 4] Creating order — POST', `${API_BASE_URL}/orders/create`);
      console.log('📦 [Step 4] Order payload:', JSON.stringify(orderData, null, 2));

      let newOrderId = '';
      let newOrderNumber = '';
      let backendTotal = total;

      try {
        const orderResponse = await fetch(`${API_BASE_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });

        const orderResult = await orderResponse.json();
        if (!orderResponse.ok) {
          throw new Error(orderResult.message || `Order creation failed with status ${orderResponse.status}`);
        }

        newOrderId = orderResult.order?._id || orderResult.order?.id || '';
        newOrderNumber = orderResult.order?.orderNumber || newOrderId;
        backendTotal = orderResult.order?.totalAmount ?? total;

        setOrderId(newOrderId);
        setOrderNumber(newOrderNumber);
        console.log('✅ [Step 4] Order created — ID:', newOrderId, '| Number:', newOrderNumber);
      } catch (orderErr: any) {
        console.error('❌ [Step 4] Order creation failed:', orderErr.message);
        toast.error(`Failed to create order: ${orderErr.message}`);
        setIsProcessingPayment(false);
        return;
      }

      // ── STEP 5: Create Zoho payment session ────────────────────
      let sessionId = '';
      const sessionDescription = `JewelsKart Order #${newOrderNumber}`;

      try {
        const sessionPayload = {
          amount: backendTotal,
          currency: 'INR',
          description: sessionDescription,
          orderId: newOrderId,
          invoice_number: `INV-${newOrderNumber}`,
          reference_number: newOrderId
        };

        const sessionResponse = await fetch(`${API_BASE_URL}/payment/create-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(sessionPayload)
        });

        const sessionData = await sessionResponse.json();
        if (!sessionResponse.ok) {
          throw new Error(sessionData?.message || 'Session creation failed');
        }

        sessionId = sessionData.payments_session_id;
        if (!sessionId) throw new Error('No session ID returned');
      } catch (sessionErr: any) {
        console.error('Zoho session creation failed', sessionErr);
        toast.error('Unable to create payment session.');
        setIsProcessingPayment(false);
        return;
      }

      // ── STEP 6: Load Zoho SDK ──────────────────────────────────
      const isLoaded = await loadZohoPaymentsScript();
      if (!isLoaded || !window.ZPayments) {
        toast.error('Payment widget failed to load.');
        setIsProcessingPayment(false);
        return;
      }

      // ── STEP 7: Initialize ZPayments ──────────────────────────
      const config = { account_id: accountId, domain: 'IN', otherOptions: { api_key: apiKey } };
      let zpayments: any;
      try {
        zpayments = new window.ZPayments(config);
      } catch (initErr: any) {
        toast.error('Payment widget initialization failed');
        setIsProcessingPayment(false);
        return;
      }

      // ── STEP 8: Payment completion handler ────────────────────
      let isVerified = false;
      const handlePaymentCompletion = async (paymentResult: any) => {
        if (isVerified) return;
        try {
          console.log('🔄 Verifying payment with backend...', paymentResult);
          const verifyPayload = {
            payment_id: paymentResult?.payment_id || paymentResult?.id || '',
            payments_session_id: sessionId,
            signature: paymentResult?.signature || '',
            orderId: newOrderId
          };
          const verifyResponse = await fetch(`${API_BASE_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(verifyPayload)
          });
          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            isVerified = true;
            toast.success('Payment successful & Order Confirmed!');
            setIsOrderCompleted(true);
            setCurrentStep('confirmation');
            if (!isBuyNow) clearCart();
            setIsProcessingPayment(false);
          } else {
            console.warn('⚠️ Verification response not success:', verifyData);
            if (paymentResult?.payment_id || paymentResult?.id) {
              toast.error(verifyData.message || 'Verification failed');
            }
            setIsProcessingPayment(false);
          }
        } catch (verifyErr: any) {
          console.error('Verification error:', verifyErr);
          toast.error('Payment verification failed');
          setIsProcessingPayment(false);
        }
      };

      // ── STEP 9: Open the payment widget with all callbacks ────
      try {
        const widgetParams = {
          payments_session_id: sessionId,
          session_id: sessionId,
          amount: String(Number(backendTotal).toFixed(2)),
          currency_code: 'INR',
          currency_symbol: '₹',
          business: 'JewelsKart',
          description: sessionDescription,
          invoice_number: `INV-${newOrderNumber}`,
          reference_number: newOrderId,
          address: {
            name: authUser?.name || `${shippingData.firstName} ${shippingData.lastName}`.trim(),
            email: authUser?.email || shippingData.email,
            phone: shippingData.phone
          },
          onSuccess: async (paymentResult: any) => {
            console.log('✅ Zoho onSuccess fired:', paymentResult);
            await handlePaymentCompletion(paymentResult);
          },
          handler: async (paymentResult: any) => {
            console.log('✅ Zoho handler fired:', paymentResult);
            await handlePaymentCompletion(paymentResult);
          },
          onFailure: (err: any) => {
            console.error('❌ Zoho onFailure:', err);
            toast.error(err?.message || 'Payment failed');
            setIsProcessingPayment(false);
          },
          onClose: async () => {
            console.log('ℹ️ Zoho widget closed. Checking server verification...');
            if (!isVerified) {
              await handlePaymentCompletion({});
            }
          }
        };

        if (typeof zpayments.requestPaymentMethod === 'function') {
          const res = await zpayments.requestPaymentMethod(widgetParams);
          if (res) {
            await handlePaymentCompletion(res);
          }
        } else if (typeof zpayments.open === 'function') {
          zpayments.open(widgetParams);
        }
      } catch (err: any) {
        if (err?.code !== 'widget_closed') {
          console.error('Payment widget error:', err);
          toast.error(err?.message || 'Payment failed');
        }
        // Even if caught, try checking status once in case payment finished
        if (!isVerified) {
          await handlePaymentCompletion({});
        }
        setIsProcessingPayment(false);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handlePlaceOrder = async () => {
    console.log('🟢 [handlePlaceOrder] called — paymentMethod:', paymentMethod);
    if (paymentMethod === 'cod') {
      await handleCODOrder();
    } else {
      await handleZohoPayment();
    }
  };


  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  // Fixed shipping
  const shipping = 1200;
  // GST exclusive: add on top
  const gstTotal = checkoutItems.reduce((sum, item) => {
    const gst = item.product.gst ?? 3;
    const itemTotal = item.product.price * item.quantity;
    return sum + itemTotal * (gst / 100);
  }, 0);
  const total = subtotal + gstTotal + shipping;

  // Unique GST rate label for display
  const uniqueGstRates = [...new Set(checkoutItems.map(i => i.product.gst ?? 3))];
  const gstLabel = uniqueGstRates.length === 1 ? `GST (${uniqueGstRates[0]}% Extra)` : 'GST (3% Extra)';

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
          title={isBuyNow ? "Checkout (Buy Now)" : "Checkout"}
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
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
                      className={`flex-1 py-3 text-center text-sm uppercase tracking-wider transition-colors ${authTab === tab ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border/30'
                        }`}
                    >
                      {tab === 'login' ? 'Sign In' : 'Register'}
                    </button>
                  ))}
                </div>

                {authTab === 'login' && (
                  <form onSubmit={handleLogin} className="bg-card p-6 border border-border/30 space-y-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-background"
                      required
                      autoComplete="email"
                    />

                    {/* Password field with eye icon */}
                    <div className="relative">
                      <Input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="bg-background pr-10"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={authLoading2}
                    >
                      {authLoading2 ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign In & Continue'}
                    </button>

                    {/* Google Sign In Button */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleButtonClick}
                      className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 rounded-md border border-gray-300 transition-all duration-300 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </button>
                  </form>
                )}

                {authTab === 'register' && (
                  <form onSubmit={handleRegister} className="bg-card p-6 border border-border/30 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="First Name *"
                        value={registerFirstName}
                        onChange={(e) => setRegisterFirstName(e.target.value)}
                        className="bg-background"
                        required
                        autoComplete="given-name"
                      />
                      <Input
                        placeholder="Last Name"
                        value={registerLastName}
                        onChange={(e) => setRegisterLastName(e.target.value)}
                        className="bg-background"
                        autoComplete="family-name"
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email *"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="bg-background"
                      required
                      autoComplete="email"
                    />

                    {/* Password field with eye icon for registration */}
                    <div className="relative">
                      <Input
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="Password * (min 6 characters)"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="bg-background pr-10"
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Confirm Password field with eye icon */}
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password *"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="bg-background pr-10"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={authLoading2}
                    >
                      {authLoading2 ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Account & Continue'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-primary/10 p-3 rounded-sm text-center">
                  <p className="text-sm text-foreground">
                    {checkoutItems.length === 0 ? (
                      <span className="text-amber-600">No items in your order. <Link to="/shop" className="text-primary underline">Continue Shopping</Link></span>
                    ) : (
                      `You have ${checkoutItems.length} item(s) in your order`
                    )}
                  </p>
                </div>
                <h2 className="font-display text-2xl text-foreground">Shipping Details</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="First Name *"
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                      className="bg-card"
                      required
                    />
                    <Input
                      placeholder="Last Name"
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                      className="bg-card"
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email *"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    className="bg-card"
                    required
                  />
                  <Input
                    placeholder="Phone *"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    className="bg-card"
                    required
                  />
                  <Input
                    placeholder="Address *"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    className="bg-card"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className="bg-card"
                    />
                    <Input
                      placeholder="State"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      className="bg-card"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="PIN Code"
                      value={shippingData.zip}
                      onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                      className="bg-card"
                    />
                    <Input
                      placeholder="Country"
                      value={shippingData.country}
                      disabled
                      className="bg-card opacity-60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={checkoutItems.length === 0}
                    className={`w-full py-3 rounded-md transition-all duration-300 ${checkoutItems.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                  >
                    Continue to Summary
                  </button>
                </form>
              </motion.div>
            )}

            {/* Summary Step */}
            {currentStep === 'summary' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-2xl text-foreground">Order Summary</h2>
                <div className="bg-card p-6 border border-border/30 rounded-sm space-y-4">
                  {checkoutItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No items in your order</p>
                      <Link to="/shop" className="text-primary hover:underline">
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    checkoutItems.map((item, idx) => {
                      const itemMaterial = item.material || item.product?.material;
                      const itemRingOption = item.ringOption || item.product?.ringOption;
                      const displaySize = item.size ? formatCoupleOrRingSize(item.size, itemRingOption) : '';
                      return (
                        <div key={`${item.product.id}-${item.size}-${itemMaterial}-${itemRingOption}-${idx}`} className="flex items-start gap-4">
                          <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-sm flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-foreground font-medium">{item.product.name}</p>
                            <p className="text-muted-foreground text-sm">
                              Qty: {item.quantity}
                              {itemMaterial && ` • Metal: ${itemMaterial}`}
                              {displaySize && ` • Size: ${displaySize}`}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.product.gst ?? 3}% GST Extra</p>
                          </div>
                          <span className="text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      );
                    })
                  )}
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
                    <span className="text-muted-foreground">Product Subtotal</span>
                    <span className="text-foreground">{formatPrice(Math.round(subtotal))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{gstLabel}</span>
                    <span className="text-foreground">{formatPrice(Math.round(gstTotal))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping (Pan-India)</span>
                    <span className="text-foreground">{formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-border/30 pt-3 flex justify-between">
                    <span className="font-display text-lg text-foreground">Total Payable</span>
                    <span className="font-display text-xl text-primary">{formatPrice(Math.round(total))}</span>
                  </div>
                </div>
                <div className="bg-primary/5 p-3 rounded-sm border border-primary/20 flex items-center gap-2 text-xs sm:text-sm text-foreground">
                  <span className="font-medium">Estimated Delivery:</span> <strong className="text-foreground font-semibold">{calculateEstimatedDelivery()}</strong> (12–15 working days from order date)
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setCurrentStep('shipping')} className="flex-1 border border-primary text-primary py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={() => setCurrentStep('payment')}
                    disabled={checkoutItems.length === 0}
                    className={`flex-1 py-3 rounded-md transition-all duration-300 ${checkoutItems.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-2xl text-foreground">Payment Method</h2>
                <div className="flex border border-border/30 rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`flex-1 py-3 text-sm uppercase tracking-wider transition-colors ${paymentMethod === 'online' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-primary/5'
                      }`}
                  >
                    💳 Pay Online (Zoho Payments)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex-1 py-3 text-sm uppercase tracking-wider transition-colors ${paymentMethod === 'cod' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-primary/5'
                      }`}
                  >
                    💵 Cash on Delivery
                  </button>
                </div>

                <div className="bg-card p-6 border border-border/30 rounded-sm">
                  {paymentMethod === 'online' && (
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <p className="text-foreground font-medium">Pay securely with Zoho Payments</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Cards • UPI • NetBanking • Wallet
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span>🔒 100% Secure</span>
                        <span>⚡ Instant Payment</span>
                        <span>🛡️ PCI Compliant</span>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'cod' && (
                    <div className="text-center py-4">
                      <p className="text-foreground mb-2">Pay when your order arrives</p>
                      <p className="text-muted-foreground text-sm">No additional charges for COD</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setCurrentStep('summary')} className="flex-1 border border-primary text-primary py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || orderLoading || isProcessingPayment || checkoutItems.length === 0}
                    className="flex-1 bg-primary text-white py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90"
                  >
                    {(isPlacingOrder || orderLoading || isProcessingPayment) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `Complete Order • ${formatPrice(Math.round(total))}`
                    )}
                  </button>
                </div>

                <p className="text-muted-foreground text-xs text-center">
                  By placing this order, you agree to our terms and conditions
                </p>
              </motion.div>
            )}

            {/* Confirmation Step */}
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
                    aria-label="Copy order number"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-muted-foreground mb-4">A confirmation has been sent to {shippingData.email}</p>
                <div className="bg-primary/5 p-4 rounded-md border border-primary/20 max-w-md mx-auto mb-8 text-sm">
                  <p className="font-medium text-foreground">Estimated Delivery: {calculateEstimatedDelivery(new Date())} (12–15 working days)</p>
                  <p className="text-xs text-muted-foreground mt-1">Products are prepared after receiving the order (Mon–Fri).</p>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link to="/order-summary" className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/5 transition-colors">
                    View Orders
                  </Link>
                  <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;