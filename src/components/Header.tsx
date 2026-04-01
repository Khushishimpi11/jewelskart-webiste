import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Heart, User, Search, Package, Settings, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { brands } from '@/data/brands';
import logo from '@/assets/logo.png';

const shopCategories = ['Rings', 'Chains', 'Pendants'];

const announcements = [
  '✨ Festive Offer – Flat 25% Off on Diamond Collection',
  '🚚 Free Shipping Above ₹1999',
  '🤝 Jewelskart × Vogue Collaboration',
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShopMega, setShowShopMega] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileBrandOpen, setMobileBrandOpen] = useState<string | null>(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { user, isAuthenticated, logout } = useAuthStore();

  const ANNOUNCEMENT_HEIGHT = 38;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 10);
      if (currentY > lastScrollY.current && currentY > 50) {
        setShowAnnouncementBar(false);
      } else if (currentY < lastScrollY.current) {
        setShowAnnouncementBar(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotate announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setMobileShopOpen(false);
    setMobileBrandOpen(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleLogout = () => { logout(); setShowDropdown(false); };
  const getInitial = () => user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  // Color classes
  const textColor = 'text-primary-foreground';
  const textMutedColor = 'text-primary-foreground/80';
  const hoverColor = 'hover:text-primary-foreground';

  const navTopOffset = showAnnouncementBar ? ANNOUNCEMENT_HEIGHT : 0;

  return (
    <>
      {/* Announcement Bar - Color from first code (hsl(345, 60%, 94%)) */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ease-in-out overflow-hidden"
        style={{
          height: `${ANNOUNCEMENT_HEIGHT}px`,
          transform: showAnnouncementBar ? 'translateY(0)' : `translateY(-${ANNOUNCEMENT_HEIGHT}px)`,
          background: 'hsl(345, 60%, 94%)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-full flex items-center justify-center relative">
          {/* Subtle shimmer effect from first code */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsl(332, 87%, 18%) 50%, transparent 100%)',
              animation: 'shimmer 3s infinite',
            }}
          />
          <AnimatePresence mode="wait">
            <motion.p
              key={announcementIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm font-body tracking-wide relative z-10"
              style={{ color: 'hsl(332, 87%, 18%)' }}
            >
              {announcements[announcementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Navbar - with bg-primary from second code */}
      <header
        className="fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-primary  "
        style={{
          top: `${navTopOffset}px`,
        }}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={logo} alt="Jewelskart" className="h-28 sm:h-36 lg:h-56 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/"
                className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 ${
                  location.pathname === '/' ? textColor : `${textMutedColor} ${hoverColor}`
                }`}
              >
                Home
              </Link>

              {/* Shop Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setShowShopMega(true)}
                onMouseLeave={() => setShowShopMega(false)}
              >
                <Link
                  to="/shop"
                  className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 flex items-center gap-1 ${
                    location.pathname === '/shop' ? textColor : `${textMutedColor} ${hoverColor}`
                  }`}
                >
                  Shop
                  <ChevronDown className={`w-4 h-4 transition-transform ${showShopMega ? 'rotate-180' : ''}`} />
                </Link>
                <AnimatePresence>
                  {showShopMega && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="fixed left-[30%] -translate-x-1/2 bg-card border border-border/20 shadow-2xl z-50 w-[760px] rounded-b-xl p-8"
                      style={{ top: `${navTopOffset + 96}px` }}
                    >
                      <Link
                        to="/shop"
                        className="block text-base font-semibold text-primary mb-5 hover:underline uppercase tracking-wider"
                      >
                        All Products
                      </Link>
                      <div className="border-t border-border/20 pt-5">
                        <div className="flex flex-col gap-4 max-w-[300px]">
                          <Link
                            to="/shop?brand=jewelskart"
                            className="block font-display text-[20px] font-bold text-foreground hover:text-primary transition-colors mb-2"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            <span className="font-bold">JEWELS</span><span className="font-thin tracking-wider">KART</span>
                          </Link>
                          <div className="space-y-3 pl-2">
                            {shopCategories.map((cat) => (
                              <Link
                                key={cat}
                                to={`/shop?brand=jewelskart&category=${cat.toLowerCase()}`}
                                className="flex items-center gap-3 text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200"
                              >
                                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                                  {cat.charAt(0)}
                                </span>
                                {cat}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { name: 'About', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 ${
                    location.pathname === link.path ? textColor : `${textMutedColor} ${hoverColor}`
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-6">
              <button className={`${textMutedColor} ${hoverColor} transition-colors`}>
                <Search className="w-5 h-5" />
              </button>
              <Link to="/wishlist" className={`relative ${textMutedColor} ${hoverColor} transition-colors`}>
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-primary text-xs flex items-center justify-center rounded-full">{wishlistCount}</span>
                )}
              </Link>
              <Link to="/cart" className={`relative ${textMutedColor} ${hoverColor} transition-colors`}>
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-primary text-xs flex items-center justify-center rounded-full">{cartItemCount}</span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-display text-lg hover:opacity-90 transition-colors"
                  >
                    {getInitial()}
                  </button>
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }} 
                        className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/50 shadow-lg py-2 rounded-lg -translate-x-[120px]"
                      >
                        <Link to="/track-order" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors">
                          <Package className="w-5 h-5" /> Track Order
                        </Link>
                        <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors">
                          <User className="w-5 h-5" /> Profile
                        </Link>
                        <Link to="/order-summary" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors">
                          <ShoppingBag className="w-5 h-5" /> Order Summary
                        </Link>
                        <Link to="/account" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors">
                          <Settings className="w-5 h-5" /> Account
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-destructive hover:bg-muted transition-colors w-full">
                          <LogOut className="w-5 h-5" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/account" className={`${textMutedColor} ${hoverColor} transition-colors`}><User className="w-5 h-5" /></Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-3">
              <Link to="/wishlist" className={`relative ${textMutedColor} min-h-[44px] min-w-[44px] flex items-center justify-center`}>
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-white text-primary text-[10px] flex items-center justify-center rounded-full">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className={`relative ${textMutedColor} min-h-[44px] min-w-[44px] flex items-center justify-center`}>
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-white text-primary text-[10px] flex items-center justify-center rounded-full">{cartItemCount}</span>}
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${textColor} min-h-[44px] min-w-[44px] flex items-center justify-center`}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed inset-0 top-16 sm:top-20 bg-background z-40 overflow-y-auto"
            >
              <nav className="container mx-auto px-4 py-6 flex flex-col gap-1">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80">Home</Link>

                <button
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="w-full flex items-center justify-between py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80"
                >
                  Shop
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileShopOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-muted/20">
                      <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block py-2 px-4 text-sm font-semibold text-primary">
                        All Products
                      </Link>
                      {brands.map((brand) => (
                        <div key={brand.id}>
                          <button
                            onClick={() => setMobileBrandOpen(mobileBrandOpen === brand.id ? null : brand.id)}
                            className="w-full flex items-center justify-between py-2 px-4 text-sm text-foreground/80"
                          >
                            {brand.name}
                            <ChevronRight className={`w-4 h-4 transition-transform ${mobileBrandOpen === brand.id ? 'rotate-90' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {mobileBrandOpen === brand.id && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                {shopCategories.map((cat) => (
                                  <Link
                                    key={cat}
                                    to={`/shop?brand=${brand.slug}&category=${cat.toLowerCase()}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2 px-8 text-xs text-muted-foreground hover:text-primary"
                                  >
                                    {cat}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80">About</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80">Contact Us</Link>

                <div className="mt-6 space-y-1 pt-4 border-t border-border/30">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"><User className="w-5 h-5" /> Profile</Link>
                      <Link to="/track-order" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"><Package className="w-5 h-5" /> Track Order</Link>
                      <Link to="/order-summary" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"><ShoppingBag className="w-5 h-5" /> Order Summary</Link>
                      <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"><Settings className="w-5 h-5" /> Account Settings</Link>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 py-3 min-h-[48px] text-destructive w-full"><LogOut className="w-5 h-5" /> Logout</button>
                    </>
                  ) : (
                    <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"><User className="w-5 h-5" /> Login / Register</Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Add the shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};