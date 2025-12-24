import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Step = 'login' | 'shipping' | 'summary' | 'payment' | 'confirmation';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<Step>('login');
  const [isGuest, setIsGuest] = useState(false);
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  const steps: Step[] = ['login', 'shipping', 'summary', 'payment', 'confirmation'];
  const stepLabels = {
    login: 'Account',
    shipping: 'Shipping',
    summary: 'Summary',
    payment: 'Payment',
    confirmation: 'Confirmation',
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setCurrentStep('shipping');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.firstName || !shippingData.email || !shippingData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCurrentStep('summary');
  };

  const handlePlaceOrder = () => {
    setCurrentStep('payment');
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setCurrentStep('confirmation');
      clearCart();
    }, 1500);
  };

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 lg:pt-32">
          <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
            <h1 className="font-display text-3xl text-foreground mb-4">Your cart is empty</h1>
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

      <main className="pt-24 lg:pt-32">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Progress Steps */}
          {currentStep !== 'confirmation' && (
            <div className="flex items-center justify-center gap-2 mb-12">
              {steps.slice(0, -1).map((step, index) => {
                const isActive = steps.indexOf(currentStep) >= index;
                const isCurrent = currentStep === step;
                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isActive && steps.indexOf(currentStep) > index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`ml-2 text-sm hidden sm:block ${
                        isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {stepLabels[step]}
                    </span>
                    {index < steps.length - 2 && (
                      <div
                        className={`w-8 lg:w-16 h-px mx-2 ${
                          isActive ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            {/* Step 1: Login */}
            {currentStep === 'login' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="font-display text-3xl text-foreground text-center">
                  Checkout
                </h1>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 border border-border/30 rounded-sm">
                    <h2 className="font-display text-xl text-foreground mb-4">
                      Returning Customer
                    </h2>
                    <form className="space-y-4">
                      <Input type="email" placeholder="Email" className="bg-background" />
                      <Input type="password" placeholder="Password" className="bg-background" />
                      <button type="button" className="w-full btn-gold">
                        Sign In
                      </button>
                    </form>
                  </div>

                  <div className="bg-card p-6 border border-border/30 rounded-sm">
                    <h2 className="font-display text-xl text-foreground mb-4">
                      Guest Checkout
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      Continue without creating an account. You can create one later to track your order.
                    </p>
                    <button onClick={handleContinueAsGuest} className="w-full btn-gold-outline">
                      Continue as Guest
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setCurrentStep('login')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <h1 className="font-display text-3xl text-foreground">Shipping Details</h1>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="First Name *"
                      value={shippingData.firstName}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, firstName: e.target.value })
                      }
                      className="bg-card"
                    />
                    <Input
                      placeholder="Last Name"
                      value={shippingData.lastName}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, lastName: e.target.value })
                      }
                      className="bg-card"
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email *"
                    value={shippingData.email}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, email: e.target.value })
                    }
                    className="bg-card"
                  />
                  <Input
                    placeholder="Phone"
                    value={shippingData.phone}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, phone: e.target.value })
                    }
                    className="bg-card"
                  />
                  <Input
                    placeholder="Address *"
                    value={shippingData.address}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, address: e.target.value })
                    }
                    className="bg-card"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={shippingData.city}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, city: e.target.value })
                      }
                      className="bg-card"
                    />
                    <Input
                      placeholder="State"
                      value={shippingData.state}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, state: e.target.value })
                      }
                      className="bg-card"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="ZIP Code"
                      value={shippingData.zip}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, zip: e.target.value })
                      }
                      className="bg-card"
                    />
                    <Input
                      placeholder="Country"
                      value={shippingData.country}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, country: e.target.value })
                      }
                      className="bg-card"
                    />
                  </div>
                  <button type="submit" className="w-full btn-gold">
                    Continue to Summary
                  </button>
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
                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <h1 className="font-display text-3xl text-foreground">Order Summary</h1>

                {/* Items */}
                <div className="bg-card p-6 border border-border/30 rounded-sm space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-sm"
                      />
                      <div className="flex-1">
                        <p className="text-foreground">{item.product.name}</p>
                        <p className="text-muted-foreground text-sm">
                          Qty: {item.quantity}
                          {item.size && ` • Size: ${item.size}`}
                        </p>
                      </div>
                      <span className="text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping Info */}
                <div className="bg-card p-6 border border-border/30 rounded-sm">
                  <h3 className="font-display text-lg text-foreground mb-2">
                    Shipping Address
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {shippingData.firstName} {shippingData.lastName}<br />
                    {shippingData.address}<br />
                    {shippingData.city}, {shippingData.state} {shippingData.zip}<br />
                    {shippingData.country}
                  </p>
                </div>

                {/* Totals */}
                <div className="bg-card p-6 border border-border/30 rounded-sm space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {getTotal() >= 500 ? 'Free' : formatPrice(25)}
                    </span>
                  </div>
                  <div className="border-t border-border/30 pt-3 flex justify-between">
                    <span className="font-display text-lg text-foreground">Total</span>
                    <span className="font-display text-xl text-primary">
                      {formatPrice(getTotal() + (getTotal() >= 500 ? 0 : 25))}
                    </span>
                  </div>
                </div>

                <button onClick={handlePlaceOrder} className="w-full btn-gold">
                  Proceed to Payment
                </button>
              </motion.div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setCurrentStep('summary')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <h1 className="font-display text-3xl text-foreground">Payment</h1>

                <div className="bg-card p-6 border border-border/30 rounded-sm space-y-4">
                  <Input placeholder="Card Number" className="bg-background" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" className="bg-background" />
                    <Input placeholder="CVC" className="bg-background" />
                  </div>
                  <Input placeholder="Cardholder Name" className="bg-background" />
                </div>

                <button onClick={handlePayment} className="w-full btn-gold">
                  Complete Order • {formatPrice(getTotal() + (getTotal() >= 500 ? 0 : 25))}
                </button>

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
                  Order #EV-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
                <p className="text-muted-foreground mb-8">
                  A confirmation email has been sent to {shippingData.email}
                </p>
                <Link to="/shop" className="btn-gold">
                  Continue Shopping
                </Link>
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
