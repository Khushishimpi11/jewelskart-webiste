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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Evimeria Jewellery"
              className="h-12 lg:h-14 w-auto"
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
                        ? 'text-primary'
                        : 'text-foreground/80 hover:text-primary'
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
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-primary'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                    />
                  )}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="text-foreground/80 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/wishlist"
              className="relative text-foreground/80 hover:text-primary transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative text-foreground/80 hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-lg hover:bg-primary/90 transition-colors"
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
                      <Link
                        to="/track-order"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        Track Order
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/order-summary"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Order Summary
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/account"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-4">
            <Link to="/cart" className="relative text-foreground/80">
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border/50"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-body text-lg tracking-wider ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-foreground/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-foreground/80"
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                </Link>
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-foreground/80"
                >
                  <User className="w-5 h-5" />
                  Account
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
