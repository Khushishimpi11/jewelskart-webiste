import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronLeft } from 'lucide-react';
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
  const { isAuthenticated } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<Step>(isAuthenticated ? 'shipping' : 'login');
  const [isGuest, setIsGuest] = useState(false);
  const { items, getTotal, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderId, setOrderId] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const { login, register } = useAuthStore();
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'guest'>('login');

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

  const steps: Step[] = isAuthenticated || isGuest
    ? ['shipping', 'summary', 'payment', 'confirmation']
    : ['login', 'shipping', 'summary', 'payment', 'confirmation'];

  const visibleSteps = steps.filter(s => s !== 'confirmation');
  const stepLabels: Record<Step, string> = {
    login: 'Account',
    shipping: 'Shipping',
    summary: 'Summary',
    payment: 'Payment',
    confirmation: 'Confirmation',
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    const success = login(loginEmail, loginPassword);
    if (success) {
      toast.success('Logged in successfully!');
      setCurrentStep('shipping');
    } else {
      toast.error('Account not found. Please register.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !registerFirstName) {
      toast.error('Please fill in all required fields');
      return;
    }
    const success = register(registerEmail, registerPassword, registerFirstName, registerLastName);
    if (success) {
      toast.success('Account created! Continuing checkout...');
      setCurrentStep('shipping');
    } else {
      toast.error('Email already registered');
    }
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setCurrentStep('shipping');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.firstName || !shippingData.email || !shippingData.address || !shippingData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCurrentStep('summary');
  };

  const handlePlaceOrder = () => {
    setCurrentStep('payment');
  };

  const total = getTotal() + (getTotal() >= 5000 ? 0 : 250);

  const handlePayment = () => {
    const newOrderId = placeOrder(items, shippingData, paymentMethod, total);
    setOrderId(newOrderId);
    setTimeout(() => {
      setCurrentStep('confirmation');
      clearCart();
    }, 1000);
  };

  if (items.length === 0 && currentStep !== 'confirmation') {
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
            <Link to="/shop" className="btn-gold">Continue Shopping</Link>
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
          title="Checkout"
          subtitle="Secure Checkout"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }, { label: 'Checkout' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Progress Steps */}
          {currentStep !== 'confirmation' && (
            <div className="flex items-center justify-center gap-2 mb-12">
              {visibleSteps.map((step, index) => {
                const isActive = visibleSteps.indexOf(currentStep as any) >= index;
                const isCurrent = currentStep === step;
                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isActive && visibleSteps.indexOf(currentStep as any) > index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`ml-2 text-sm hidden sm:block ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stepLabels[step]}
                    </span>
                    {index < visibleSteps.length - 1 && (
                      <div className={`w-8 lg:w-16 h-px mx-2 ${isActive ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            {/* Step 1: Login (only if not authenticated) */}
            {currentStep === 'login' && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="font-display text-2xl text-foreground text-center">How would you like to proceed?</h2>

                {/* Auth Tabs */}
                <div className="flex mb-4">
                  {['login', 'register', 'guest'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAuthTab(tab as any)}
                      className={`flex-1 py-3 text-center text-sm uppercase tracking-wider transition-colors ${
                        authTab === tab ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border/30'
                      }`}
                    >
                      {tab === 'login' ? 'Sign In' : tab === 'register' ? 'Register' : 'Guest'}
                    </button>
                  ))}
                </div>

                {authTab === 'login' && (
                  <form onSubmit={handleLogin} className="bg-card p-6 border border-border/30 space-y-4">
                    <Input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="bg-background" />
                    <Input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="bg-background" />
                    <button type="submit" className="w-full btn-primary">Sign In & Continue</button>
                  </form>
                )}

                {authTab === 'register' && (
                  <form onSubmit={handleRegister} className="bg-card p-6 border border-border/30 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First Name *" value={registerFirstName} onChange={(e) => setRegisterFirstName(e.target.value)} className="bg-background" />
                      <Input placeholder="Last Name" value={registerLastName} onChange={(e) => setRegisterLastName(e.target.value)} className="bg-background" />
                    </div>
                    <Input type="email" placeholder="Email *" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="bg-background" />
                    <Input type="password" placeholder="Password *" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="bg-background" />
                    <button type="submit" className="w-full btn-primary">Create Account & Continue</button>
                  </form>
                )}

                {authTab === 'guest' && (
                  <div className="bg-card p-6 border border-border/30 text-center space-y-4">
                    <p className="text-muted-foreground">Continue without creating an account. You can create one later to track your order.</p>
                    <button onClick={handleContinueAsGuest} className="w-full btn-primary">
                      Continue as Guest
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="font-display text-2xl text-foreground">Shipping Details</h2>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="First Name *" value={shippingData.firstName} onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })} className="bg-card" />
                    <Input placeholder="Last Name" value={shippingData.lastName} onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })} className="bg-card" />
                  </div>
                  <Input type="email" placeholder="Email *" value={shippingData.email} onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })} className="bg-card" />
                  <Input placeholder="Phone *" value={shippingData.phone} onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })} className="bg-card" />
                  <Input placeholder="Address *" value={shippingData.address} onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })} className="bg-card" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="City" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} className="bg-card" />
                    <Input placeholder="State" value={shippingData.state} onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })} className="bg-card" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="PIN Code" value={shippingData.zip} onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })} className="bg-card" />
                    <Input placeholder="Country" value={shippingData.country} disabled className="bg-card opacity-60" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    {!isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep('login')}
                        className="btn-gold-outline flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                    )}
                  <button
  type="submit"
  className="flex-1 bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90"
>
  Continue to Summary
</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Summary */}
            {currentStep === 'summary' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="font-display text-2xl text-foreground">Order Summary</h2>

                <div className="bg-card p-6 border border-border/30 rounded-sm space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-4">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-sm" />
                      <div className="flex-1">
                        <p className="text-foreground">{item.product.name}</p>
                        <p className="text-muted-foreground text-sm">
                          Qty: {item.quantity}{item.size && ` • Size: ${item.size}`}
                        </p>
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
                    <span className="text-foreground">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">{getTotal() >= 5000 ? 'Free' : formatPrice(250)}</span>
                  </div>
                  <div className="border-t border-border/30 pt-3 flex justify-between">
                    <span className="font-display text-lg text-foreground">Total</span>
                    <span className="font-display text-xl text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    className="btn-gold-outline flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                <button
  onClick={handlePlaceOrder}
  className="flex-1 bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90"
>
  Proceed to Payment
</button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment - Tab-based */}
            {currentStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="font-display text-2xl text-foreground">Payment Method</h2>

                {/* Payment Tabs */}
                <div className="flex border border-border/30">
                  {([
                    { id: 'cod', label: 'Cash on Delivery' },
                    { id: 'upi', label: 'UPI' },
                    { id: 'card', label: 'Card' },
                  ] as const).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPaymentMethod(tab.id)}
                      className={`flex-1 py-3 text-sm uppercase tracking-wider transition-colors ${
                        paymentMethod === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="bg-card p-6 border border-border/30 rounded-sm">
                  {paymentMethod === 'cod' && (
                    <div className="text-center py-4">
                      <p className="text-foreground mb-2">Pay when your order arrives</p>
                      <p className="text-muted-foreground text-sm">An additional ₹50 COD charge may apply</p>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <Input placeholder="Enter UPI ID (e.g., name@upi)" className="bg-background" />
                      <p className="text-muted-foreground text-sm">You will receive a payment request on your UPI app</p>
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
                  <button
                    onClick={() => setCurrentStep('summary')}
                    className="btn-gold-outline flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                <button
  onClick={handlePayment}
  className="flex-1 bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90"
>
  Complete Order • {formatPrice(total)}
</button>
                </div>

                <p className="text-muted-foreground text-xs text-center">
                  This is a demo. No real payment will be processed.
                </p>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 'confirmation' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-primary-foreground" />
                </div>
                <h1 className="font-display text-3xl text-foreground mb-4">
                  Thank You for Your Order!
                </h1>
                <p className="text-muted-foreground mb-2">
                  Order #{orderId}
                </p>
                <p className="text-muted-foreground mb-8">
                  A confirmation email has been sent to {shippingData.email}
                </p>
                <div className="flex gap-4 justify-center">
                  <Link to="/order-summary" className="btn-gold-outline">
                    View Orders
                  </Link>
                 <Link
  to="/shop"
  className="bg-primary text-white px-6 py-3 rounded-md inline-block transition-all duration-300 hover:bg-primary/90"
>
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
