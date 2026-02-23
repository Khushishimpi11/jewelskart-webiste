import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Heart, User, Search, Package, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { categories } from '@/data/products';
import logo from '@/assets/logo.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop', hasDropdown: true },
  { name: 'About', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showMobileShopDropdown, setShowMobileShopDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowMobileShopDropdown(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const getInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const textColor = isScrolled ? 'text-primary-foreground' : 'text-white';
  const textMutedColor = isScrolled ? 'text-primary-foreground/80' : 'text-white/80';
  const hoverColor = isScrolled ? 'hover:text-primary-foreground' : 'hover:text-white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-primary shadow-lg' : 'bg-primary'
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="Evimeria Jewellery"
              className="h-28 sm:h-36 lg:h-56 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setShowShopDropdown(true)}
                  onMouseLeave={() => setShowShopDropdown(false)}
                >
                  <button
                    className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 flex items-center gap-1 ${
                      location.pathname === link.path || location.pathname.startsWith('/shop')
                        ? textColor
                        : `${textMutedColor} ${hoverColor}`
                    }`}
                  >
                    {link.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showShopDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showShopDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 top-full mt-2 w-48 bg-card border border-border/50 shadow-lg py-2 z-50"
                      >
                        <Link
                          to="/shop"
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                          All Products
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            to={`/shop?category=${category.id}`}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors capitalize"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 ${
                    location.pathname === link.path
                      ? textColor
                      : `${textMutedColor} ${hoverColor}`
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.span
                      layoutId="activeNav"
                      className={`absolute -bottom-1 left-0 right-0 h-px ${
                        isScrolled ? 'bg-primary-foreground' : 'bg-white'
                      }`}
                    />
                  )}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <button className={`${textMutedColor} ${hoverColor} transition-colors`}>
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/wishlist"
              className={`relative ${textMutedColor} ${hoverColor} transition-colors`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-primary text-xs flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className={`relative ${textMutedColor} ${hoverColor} transition-colors`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-primary text-xs flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-10 h-10 rounded-full ${
                    isScrolled 
                      ? 'bg-primary-foreground text-primary' 
                      : 'bg-white text-primary'
                  } flex items-center justify-center font-display text-lg hover:opacity-90 transition-colors`}
                >
                  {getInitial()}
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/50 shadow-lg py-2"
                    >
                      <Link to="/track-order" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <Package className="w-4 h-4" /> Track Order
                      </Link>
                      <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/order-summary" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <ShoppingBag className="w-4 h-4" /> Order Summary
                      </Link>
                      <Link to="/account" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <Settings className="w-4 h-4" /> Account
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/account" className={`${textMutedColor} ${hoverColor} transition-colors`}>
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-3">
            <Link to="/wishlist" className={`relative ${textMutedColor} min-h-[44px] min-w-[44px] flex items-center justify-center`}>
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-white text-primary text-[10px] flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className={`relative ${textMutedColor} min-h-[44px] min-w-[44px] flex items-center justify-center`}>
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-white text-primary text-[10px] flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${textColor} min-h-[44px] min-w-[44px] flex items-center justify-center`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
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
              {navLinks.map((link) => (
                <div key={link.path}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setShowMobileShopDropdown(!showMobileShopDropdown)}
                        className={`w-full flex items-center justify-between py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 ${
                          location.pathname === link.path ? 'text-primary font-medium' : 'text-foreground/80'
                        }`}
                      >
                        {link.name}
                        <ChevronDown className={`w-5 h-5 transition-transform ${showMobileShopDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showMobileShopDropdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-muted/30"
                          >
                            <Link
                              to="/shop"
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-3 px-6 min-h-[44px] text-sm text-foreground/70 hover:text-primary border-b border-border/10"
                            >
                              All Products
                            </Link>
                            {categories.map((category) => (
                              <Link
                                key={category.id}
                                to={`/shop?category=${category.id}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-3 px-6 min-h-[44px] text-sm text-foreground/70 hover:text-primary border-b border-border/10 capitalize"
                              >
                                {category.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 ${
                        location.pathname === link.path ? 'text-primary font-medium' : 'text-foreground/80'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Menu Actions */}
              <div className="mt-6 space-y-1 pt-4 border-t border-border/30">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80">
                      <User className="w-5 h-5" /> Profile
                    </Link>
                    <Link to="/track-order" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80">
                      <Package className="w-5 h-5" /> Track Order
                    </Link>
                    <Link to="/order-summary" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80">
                      <ShoppingBag className="w-5 h-5" /> Order Summary
                    </Link>
                    <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80">
                      <Settings className="w-5 h-5" /> Account Settings
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 py-3 min-h-[48px] text-destructive w-full">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80">
                    <User className="w-5 h-5" /> Login / Register
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};