import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  Search,
  Package,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  BadgeCheck,
  ShieldCheck,
  Lock,
  RotateCcw,
} from 'lucide-react';

import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import NotificationBell from '@/components/NotificationBell';

import logo from '@/assets/logo.png';

import ringImg from '@/assets/ring.jpeg';
import pendantImg from '@/assets/chains.webp';
import earringImg from '@/assets/earring/e1.jpg';
import braceletImg from '@/assets/c.jpg';
import necklaceImg from '@/assets/c.png';

interface AnnouncementItem {
  icon: React.ReactNode;
  text: string;
  subtext: string;
  link: string;
}

const announcements: AnnouncementItem[] = [
  {
    icon: <BadgeCheck className="w-4 h-4" />,
    text: '100% Authentic',
    subtext: 'Certified Jewellery',
    link: '/terms',
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    text: 'Lifetime Warranty',
    subtext: 'Against Manufacturing Defects',
    link: '/terms',
  },
  {
    icon: <Lock className="w-4 h-4" />,
    text: 'Secure Payments',
    subtext: '100% Safe Checkout',
    link: '/privacy',
  },
  {
    icon: <RotateCcw className="w-4 h-4" />,
    text: 'Easy Returns',
    subtext: '24 Hours Return Window',
    link: '/privacy',
  },
];

const capitalizeCategory = (name: string) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShopMega, setShowShopMega] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileBrandOpen, setMobileBrandOpen] = useState<string | null>(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Calculate heights dynamically
  const ANNOUNCEMENT_HEIGHT = 38;
  // For mobile, navbar height is 64px (h-16) and for desktop it's 80px (h-20) or 96px (h-24)
  const getNavbarHeight = () => {
    if (window.innerWidth < 640) return 64; // sm: h-16
    if (window.innerWidth < 1024) return 80; // lg: h-20
    return 96; // lg: h-24
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const getCategoryImage = (cat: any) => {
    if (cat?.image && typeof cat.image === 'string' && cat.image.trim() !== '') {
      return cat.image;
    }
    const name = (typeof cat === 'string' ? cat : cat?.name || '').toLowerCase();

    if (name.includes('ring')) return ringImg;
    if (name.includes('earring')) return earringImg;
    if (name.includes('pendant')) return pendantImg;
    if (name.includes('necklace')) return necklaceImg;
    if (name.includes('bracelet')) return braceletImg;

    return ringImg;
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);

    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();

      if (data.success && data.categories) {
        const activeCategories = data.categories
          .filter((cat: any) => cat.isActive === true && cat.featured === true)
          .map((cat: any) => ({
            name: capitalizeCategory(cat.name),
            category: cat.slug || cat.name.toLowerCase(),
            img: (cat.image && cat.image.trim() !== '') ? cat.image : getCategoryImage(cat),
            _id: cat._id,
            productCount: cat.productCount || 0,
            featured: cat.featured,
          }));

        setCategories(activeCategories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

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

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const getInitial = () => {
    return user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  const textColor = 'text-primary-foreground';
  const textMutedColor = 'text-primary-foreground/80';
  const hoverColor = 'hover:text-primary-foreground';

  const navTopOffset = showAnnouncementBar ? ANNOUNCEMENT_HEIGHT : 0;
  const navbarHeight = getNavbarHeight();
  const totalHeaderHeight = navTopOffset + navbarHeight;

  const activeAnnouncement = announcements[announcementIndex];

  return (
    <>
      {/* Announcement Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ease-in-out overflow-hidden"
        style={{
          height: `${ANNOUNCEMENT_HEIGHT}px`,
          transform: showAnnouncementBar
            ? 'translateY(0)'
            : `translateY(-${ANNOUNCEMENT_HEIGHT}px)`,
          background: 'hsl(345, 60%, 94%)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-full flex items-center justify-center relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, hsl(332, 87%, 18%) 50%, transparent 100%)',
              animation: 'shimmer 3s infinite',
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={announcementIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <Link
                to={activeAnnouncement.link}
                className="flex items-center justify-center gap-2 text-xs sm:text-sm font-body tracking-wide"
                style={{ color: 'hsl(332, 87%, 18%)' }}
              >
                <span className="flex items-center justify-center">
                  {activeAnnouncement.icon}
                </span>

                <span className="font-semibold whitespace-nowrap">
                  {activeAnnouncement.text}
                </span>

                <span className="hidden sm:inline opacity-75">
                  | {activeAnnouncement.subtext}
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className="fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-primary"
        style={{ top: `${navTopOffset}px` }}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src={logo}
                alt="Jewelskart"
                className="h-28 sm:h-32 lg:h-40 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/"
                className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 ${location.pathname === '/'
                  ? textColor
                  : `${textMutedColor} ${hoverColor}`
                  }`}
              >
                Home
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setShowShopMega(true)}
                onMouseLeave={() => setShowShopMega(false)}
              >
                <div
                  className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 flex items-center gap-1 py-4 cursor-pointer ${location.pathname === '/shop'
                    ? textColor
                    : `${textMutedColor} ${hoverColor}`
                    }`}
                >
                  Shop
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showShopMega ? 'rotate-180' : ''
                      }`}
                  />
                </div>

                <AnimatePresence>
                  {showShopMega && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, x: '-50%' }}
                      exit={{ opacity: 0, y: 5, x: '-50%' }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[90%] left-1/2 bg-white border border-border/20 shadow-2xl z-50 w-[320px] rounded-xl p-6"
                    >
                      <Link
                        to="/shop"
                        className="block text-xs font-bold text-primary mb-4 hover:underline uppercase tracking-tight border-b pb-2"
                      >
                        All Products
                      </Link>

                      <div className="space-y-4 pt-2">
                        {loadingCategories ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                          </div>
                        ) : categories.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No featured categories
                          </p>
                        ) : (
                          categories.map((cat) => (
                            <Link
                              key={cat.name}
                              to={`/shop?category=${cat.category}`}
                              className="flex items-center gap-4 text-sm text-gray-600 hover:text-primary group transition-all"
                            >
                              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-border/10 group-hover:border-primary/30 transition-colors">
                                <img
                                  src={cat.img}
                                  alt={cat.name}
                                  className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform"
                                />
                              </div>

                              <span className="font-semibold">{cat.name}</span>
                            </Link>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/about"
                className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 ${location.pathname === '/about'
                  ? textColor
                  : `${textMutedColor} ${hoverColor}`
                  }`}
              >
                About Us
              </Link>

              <Link
                to="/testimonials"
                className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 ${location.pathname === '/testimonials'
                  ? textColor
                  : `${textMutedColor} ${hoverColor}`
                  }`}
              >
                Testimonials
              </Link>

              <Link
                to="/contact"
                className={`relative font-body text-sm tracking-wider uppercase transition-colors duration-300 ${location.pathname === '/contact'
                  ? textColor
                  : `${textMutedColor} ${hoverColor}`
                  }`}
              >
                Contact Us
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                className={`${textMutedColor} ${hoverColor} transition-colors p-1`}
              >
                <Search className="w-5 h-5" />
              </button>

              <NotificationBell />

              <Link
                to="/wishlist"
                className={`relative ${textMutedColor} ${hoverColor} transition-colors p-1`}
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
                className={`relative ${textMutedColor} ${hoverColor} transition-colors p-1`}
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
                    className="w-9 h-9 rounded-full bg-white text-primary flex items-center justify-center font-display text-base hover:opacity-90 transition-colors"
                  >
                    {getInitial()}
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/50 shadow-lg py-2 rounded-lg"
                      >
                        <Link
                          to="/track-order"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <Package className="w-4 h-4" /> Track Order
                        </Link>

                        <Link
                          to="/order-summary"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" /> Order Summary
                        </Link>

                        <Link
                          to="/account"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <Settings className="w-4 h-4" /> My Account
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-muted transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/account"
                  className={`${textMutedColor} ${hoverColor} transition-colors p-1`}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <NotificationBell />

              <Link
                to="/wishlist"
                className={`relative ${textMutedColor} min-h-[40px] min-w-[40px] flex items-center justify-center`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-white text-primary text-[10px] flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className={`relative ${textMutedColor} min-h-[40px] min-w-[40px] flex items-center justify-center`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-white text-primary text-[10px] flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${textColor} min-h-[40px] min-w-[40px] flex items-center justify-center`}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Fixed positioning with proper top offset */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-background z-40 overflow-y-auto"
              style={{
                top: `${totalHeaderHeight}px`,
                height: `calc(100vh - ${totalHeaderHeight}px)`
              }}
            >
              <nav className="container mx-auto px-4 py-6 flex flex-col gap-1 h-full overflow-y-auto">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80"
                >
                  Home
                </Link>

                <button
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="w-full flex items-center justify-between py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80"
                >
                  Shop
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${mobileShopOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {mobileShopOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-muted/20"
                    >
                      <Link
                        to="/shop"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 px-4 text-sm font-semibold text-primary"
                      >
                        All Products
                      </Link>

                      <div>
                        <button
                          onClick={() =>
                            setMobileBrandOpen(
                              mobileBrandOpen === 'jewelskart'
                                ? null
                                : 'jewelskart'
                            )
                          }
                          className="w-full flex items-center justify-between py-2 px-4 text-sm text-foreground/80"
                        >
                          JewelsKart
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${mobileBrandOpen === 'jewelskart'
                              ? 'rotate-90'
                              : ''
                              }`}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileBrandOpen === 'jewelskart' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {loadingCategories ? (
                                <div className="py-2 px-8 text-xs text-muted-foreground">
                                  Loading...
                                </div>
                              ) : categories.length === 0 ? (
                                <div className="py-2 px-8 text-xs text-muted-foreground">
                                  No featured categories
                                </div>
                              ) : (
                                categories.map((cat) => (
                                  <Link
                                    key={cat.name}
                                    to={`/shop?category=${cat.category}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2 px-8 text-xs text-muted-foreground hover:text-primary"
                                  >
                                    {cat.name}
                                  </Link>
                                ))
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80"
                >
                  About Us
                </Link>

                <Link
                  to="/testimonials"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80"
                >
                  Testimonials
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 min-h-[48px] font-body text-base tracking-wider border-b border-border/20 text-foreground/80"
                >
                  Contact Us
                </Link>

                <div className="mt-6 space-y-1 pt-4 border-t border-border/30">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"
                      >
                        <User className="w-5 h-5" /> Profile
                      </Link>

                      <Link
                        to="/track-order"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"
                      >
                        <Package className="w-5 h-5" /> Track Order
                      </Link>

                      <Link
                        to="/order-summary"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"
                      >
                        <ShoppingBag className="w-5 h-5" /> Order Summary
                      </Link>

                      <Link
                        to="/account"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"
                      >
                        <Settings className="w-5 h-5" /> Account Settings
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 py-3 min-h-[48px] text-destructive w-full"
                      >
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 py-3 min-h-[48px] text-foreground/80"
                    >
                      <User className="w-5 h-5" /> Login / Register
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};