import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ExchangeProvider } from "@/context/ExchangeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
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

// Forgot Password Pages
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

// ✅ AutoLogoutCheck Component - Checks if customer still exists in database
const AutoLogoutCheck = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const checkInterval = useRef<NodeJS.Timeout | null>(null);
  const isChecking = useRef(false);

  useEffect(() => {
    // Clear any existing interval
    if (checkInterval.current) {
      clearInterval(checkInterval.current);
      checkInterval.current = null;
    }

    // Only run if user is authenticated
    if (!isAuthenticated || !user?.email) {
      return;
    }

    console.log("🔄 AutoLogoutCheck started for:", user.email);

    // Function to check if user exists in database
    const checkUserExists = async () => {
      if (isChecking.current) return;
      
      isChecking.current = true;
      
      try {
        const response = await fetch("http://localhost:5000/api/auth/check-user-exists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();

        if (!data.exists) {
          console.log("🔴 User deleted from database:", user.email);
          
          // Show toast notification
          toast.error("Your account has been deleted by admin", {
            duration: 5000,
            position: "top-center",
          });
          
          // Clear all storage
          localStorage.removeItem("customer_token");
          localStorage.removeItem("customer_storage");
          localStorage.removeItem("customer_user");
          
          // Call logout function
          logout();
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          console.log("✅ User exists in database:", user.email);
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
      } finally {
        isChecking.current = false;
      }
    };

    // Check immediately on mount
    checkUserExists();

    // Set up interval to check every 30 seconds
    checkInterval.current = setInterval(checkUserExists, 30000);

    // Cleanup on unmount
    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
        checkInterval.current = null;
      }
    };
  }, [isAuthenticated, user?.email, logout]);

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
            <AutoLogoutCheck /> {/* ✅ Auto logout check for deleted customers */}
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
              
              {/* Forgot Password & Reset Password Routes */}
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