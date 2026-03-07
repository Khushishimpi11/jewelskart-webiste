import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Heart, User, Search, Package, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { brands } from '@/data/brands';
import logo from '@/assets/logo.png';

const categoryLinks = [
  { name: 'Rings', path: '/shop?category=rings' },
  { name: 'Chains', path: '/shop?category=chains' },
  { name: 'Pendants', path: '/shop?category=pendants' },
  { name: 'Bracelets', path: '/shop?category=bracelets' },
  { name: 'Earrings', path: '/shop?category=earrings' },
  { name: 'Necklaces', path: '/shop?category=necklaces' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [showMobileBrandsDropdown, setShowMobileBrandsDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowMobileBrandsDropdown(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleLogout = () => { logout(); setShowDropdown(false); };
  const getInitial = () => user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  const textColor = 'text-primary-foreground';
  const textMutedColor = 'text-primary-foreground/80';
  const hoverColor = 'hover:text-primary-foreground';

  // Check if a nav link is a category link (starts with /shop?category=)
  const isCategoryLink = (path: string) => path.startsWith('/shop?category=');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg transition-all duration-500">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logo} alt="Jewelskart" className="h-28 sm:h-36 lg:h-56 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/shop' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 ${
                  (link.path === '/' ? location.pathname === '/' : location.pathname === link.path)
                    ? textColor : `${textMutedColor} ${hoverColor}`
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Brands dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowBrandsDropdown(true)}
              onMouseLeave={() => setShowBrandsDropdown(false)}
            >
              <button className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 flex items-center gap-1 ${textMutedColor} ${hoverColor}`}>
                Brands
                <ChevronDown className={`w-4 h-4 transition-transform ${showBrandsDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showBrandsDropdown && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 top-full mt-2 w-52 bg-card border border-border/50 shadow-lg py-2 z-50">
                    {brands.map((brand) => (
                      <Link key={brand.id} to={`/shop?brand=${brand.slug}`} className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">{brand.name}</Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category links */}
            {categoryLinks.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 ${
                  location.pathname + location.search === cat.path ? textColor : `${textMutedColor} ${hoverColor}`
                }`}
              >
                {cat.name}
              </Link>
            ))}

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
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/50 shadow-lg py-2">
                      <Link to="/track-order" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"><Package className="w-4 h-4" /> Track Order</Link>
                      <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"><User className="w-4 h-4" /> Profile</Link>
                      <Link to="/order-summary" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"><ShoppingBag className="w-4 h-4" /> Order Summary</Link>
                      <Link to="/account" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"><Settings className="w-4 h-4" /> Account</Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full"><LogOut className="w-4 h-4" /> Logout</button>
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
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80">Shop</Link>

              {/* Brands dropdown */}
              <button
                onClick={() => setShowMobileBrandsDropdown(!showMobileBrandsDropdown)}
                className="w-full flex items-center justify-between py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80"
              >
                Brands
                <ChevronDown className={`w-5 h-5 transition-transform ${showMobileBrandsDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showMobileBrandsDropdown && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-muted/30">
                    {brands.map((brand) => (
                      <Link key={brand.id} to={`/shop?brand=${brand.slug}`} onClick={() => setIsMenuOpen(false)} className="block py-2 px-6 text-sm text-foreground/70 hover:text-primary">
                        {brand.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category links */}
              {categoryLinks.map((cat) => (
                <Link key={cat.name} to={cat.path} onClick={() => setIsMenuOpen(false)} className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80">
                  {cat.name}
                </Link>
              ))}

              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80">About</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80">Contact Us</Link>

              {/* Account actions */}
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
  );
};
