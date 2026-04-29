import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ExchangeProvider } from "@/context/ExchangeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import Profile from "./pages/Profile";
import OrderSummary from "./pages/OrderSummary";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Testimonials from "./pages/Testimonials";

// Policy Pages
import TermsPage from "./pages/TermsPage";
import RefundCancellationPage from "./pages/RefundCancellationPage";

// ✅ ADD THESE IMPORTS
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <GoogleOAuthProvider clientId="328448157213-htfq8k1fe4igl4reb3vmdvfbmodu6u6l.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ExchangeProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/account" element={<Account />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/order-summary" element={<OrderSummary />} />
              <Route path="/about" element={<About />} />
              <Route path="/testimonials" element={<Testimonials />} />
              
              {/* Policy Pages */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/RefundCancellationPage" element={<RefundCancellationPage />} />
              
              {/* ✅ ADD FORGOT PASSWORD & RESET PASSWORD ROUTES */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ExchangeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;