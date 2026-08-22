import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

import ringImg from '@/assets/kk.png';
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
          // Active categories only
          .filter((cat: any) => cat.isActive === true)

          .map((cat: any) => ({
            name: capitalizeCategory(cat.name),
            category: cat.slug || cat.name.toLowerCase(),
            img:
              cat.image && cat.image.trim() !== ''
                ? cat.image
                : getCategoryImage(cat),

            _id: cat._id,
            productCount: cat.productCount || 0,
            featured: cat.featured,
          }))

          // Important jewellery categories first
          .sort((a: any, b: any) => {
            const order = [
              'ring',
              'rings',
              'couple-ring',
              'couple-rings',
              'pendant',
              'pendants',
              'pendant-set',
              'pendant-sets',
              'earring',
              'earrings',
              'necklace',
              'necklaces',
              'bracelet',
              'bracelets',
            ];

            const aSlug = a.category?.toLowerCase();
            const bSlug = b.category?.toLowerCase();

            const aIndex = order.indexOf(aSlug);
            const bIndex = order.indexOf(bSlug);

            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;

            return aIndex - bIndex;
          });

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
                    <div
                      className="
                        fixed
                        left-1/2
                        -translate-x-1/2
                        z-[70]
                        pt-3
                        w-[1180px]
                        max-w-[calc(100vw-32px)]
                      "
                      style={{ top: `${totalHeaderHeight - 8}px` }}
                    >
                      {/* Hover bridge between the Shop link and mega menu */}
                      <div className="absolute -top-4 left-0 right-0 h-7" />

                      <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.99 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="
                          w-full
                          overflow-hidden
                          rounded-[28px]
                          bg-[#fffafb]
                          border border-white/80
                          shadow-[0_32px_90px_rgba(69,8,34,0.24)]
                        "
                      >
                        <div className="grid grid-cols-[350px_1fr] max-h-[80vh] min-h-[400px]">
                          {/* LEFT EDITORIAL PANEL */}
                          <Link
                            to="/shop"
                            onClick={() => setShowShopMega(false)}
                            className="group relative overflow-hidden bg-primary min-h-[400px] max-h-[80vh]"
                          >
                            <img
                              src={ringImg}
                              alt="JewelsKart Jewellery Collection"
                              className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#4b0620] via-[#6b1238]/70 to-[#22030e]/10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />

                            {/* Fine editorial frame */}
                            <div className="absolute inset-5 rounded-[20px] border border-white/20 pointer-events-none" />

                            {/* Top label */}
                            <div className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between">
                              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/90">
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                Curated for you
                              </span>

                              <span className="font-serif text-[11px] italic text-white/65">
                                JewelsKart
                              </span>
                            </div>

                            {/* Editorial content */}
                            <div className="relative z-10 h-full flex flex-col justify-end p-10 text-white">
                              <div className="flex items-center gap-3 mb-5">
                                <span className="w-9 h-px bg-white/70" />
                                <span className="text-[9px] uppercase tracking-[0.34em] text-white/75">
                                  The Jewellery Edit
                                </span>
                              </div>

                              <h3 className="font-serif text-[40px] leading-[0.98] tracking-[-0.02em]">
                                Timeless
                                <br />
                                <span className="italic font-normal">Jewellery</span>
                              </h3>

                              <p className="mt-5 max-w-[235px] text-[13px] leading-6 text-white/76">
                                Pieces designed to celebrate everyday elegance, gifting moments and lasting memories.
                              </p>

                              <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-primary transition-all duration-300 group-hover:gap-4 group-hover:shadow-xl">
                                Shop the collection
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </Link>

                          {/* RIGHT CATEGORY EDITORIAL GRID */}
                          <div className="relative bg-[#fffafb] px-8 xl:px-10 py-8">
                            {/* very subtle decorative glow */}
                            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/[0.035] blur-3xl" />

                            {/* Header */}
                            <div className="relative z-10 flex items-end justify-between gap-6 mb-7">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-6 h-px bg-primary/45" />
                                  <p className="text-[9px] uppercase tracking-[0.34em] font-semibold text-primary/55">
                                    Discover
                                  </p>
                                </div>

                                <h4 className="font-serif text-[28px] leading-none text-[#4b0a25]">
                                  Shop by Category
                                </h4>

                                <p className="mt-2 text-[11px] tracking-wide text-gray-400">
                                  Seven signature categories, one refined edit.
                                </p>
                              </div>

                              <Link
                                to="/shop"
                                onClick={() => setShowShopMega(false)}
                                className="group/all inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-primary/70 transition-all duration-300 hover:border-primary/30 hover:text-primary hover:shadow-sm"
                              >
                                View all
                                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/all:translate-x-1" />
                              </Link>
                            </div>

                            {/* Categories */}
                            {loadingCategories ? (
                              <div className="min-h-[250px] max-h-[400px] flex flex-col items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-7 w-7 border-2 border-primary/15 border-t-primary" />
                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                                  Loading collections
                                </span>
                              </div>
                            ) : categories.length === 0 ? (
                              <div className="min-h-[250px] max-h-[400px] rounded-[20px] border border-dashed border-primary/15 bg-white/60 flex items-center justify-center">
                                <p className="text-sm text-gray-400">No categories available</p>
                              </div>
                            ) : (
                              <div className="relative z-10 grid grid-cols-4 gap-x-4 gap-y-6">
                                {categories.slice(0, 7).map((cat, index) => (
                                  <Link
                                    key={cat._id || cat.name}
                                    to={`/shop?category=${cat.category}`}
                                    onClick={() => setShowShopMega(false)}
                                    className="group/category min-w-0"
                                  >
                                    <div className="relative aspect-[1.22/1] overflow-hidden rounded-[18px] bg-[#f5ecef] shadow-[0_8px_24px_rgba(78,13,39,0.06)]">
                                      <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/category:scale-[1.08]"
                                      />

                                      <div className="absolute inset-0 bg-gradient-to-t from-[#3e071a]/35 via-transparent to-transparent opacity-55 transition-opacity duration-300 group-hover/category:opacity-75" />

                                      {/* Number */}
                                      <span className="absolute top-3 left-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-white/45 bg-white/70 backdrop-blur-md px-1.5 text-[8px] font-bold tracking-wider text-primary">
                                        {String(index + 1).padStart(2, '0')}
                                      </span>

                                      {/* Floating arrow */}
                                      <span className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white text-primary opacity-0 shadow-md transition-all duration-300 group-hover/category:translate-y-0 group-hover/category:opacity-100">
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </span>
                                    </div>

                                    <div className="pt-3 px-0.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <h5 className="truncate font-serif text-[15px] leading-tight text-[#29121c] transition-colors duration-300 group-hover/category:text-primary">
                                          {cat.name}
                                        </h5>

                                        {cat.productCount > 0 && (
                                          <span className="flex-shrink-0 text-[9px] font-medium text-gray-400">
                                            {cat.productCount}
                                          </span>
                                        )}
                                      </div>

                                      <div className="mt-1.5 h-px w-0 bg-primary/50 transition-all duration-500 group-hover/category:w-10" />
                                    </div>
                                  </Link>
                                ))}

                                {/* The eighth tile balances the 7 categories without inventing a category */}
                                <Link
                                  to="/shop"
                                  onClick={() => setShowShopMega(false)}
                                  className="group/view relative aspect-[1.22/1] overflow-hidden rounded-[18px] border border-primary/10 bg-gradient-to-br from-[#f8eef2] via-white to-[#f5e7ed] flex flex-col items-center justify-center text-center px-4 transition-all duration-300 hover:border-primary/25 hover:shadow-[0_10px_28px_rgba(78,13,39,0.08)]"
                                >
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_20px_rgba(91,14,44,0.22)] transition-transform duration-300 group-hover/view:scale-110">
                                    <ChevronRight className="w-4 h-4" />
                                  </div>
                                  <span className="mt-3 font-serif text-[14px] text-primary">
                                    View all jewellery
                                  </span>
                                  <span className="mt-1 text-[8px] uppercase tracking-[0.18em] text-primary/45">
                                    Explore everything
                                  </span>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
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

        {/* Mobile Menu - Improved with Icons and Better Design */}
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
                height: `calc(100vh - ${totalHeaderHeight}px)`,
                maxHeight: `calc(100vh - ${totalHeaderHeight}px)`,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-1 min-h-full pb-20">
                {/* Home Link with Icon */}
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 min-h-[52px] font-body text-base tracking-wider border-b border-border/10 text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  <span className="w-6 h-6 flex items-center justify-center text-primary/40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  Home
                </Link>

                {/* Shop Section with Categories */}
                <div className="border-b border-border/10">
                  <button
                    onClick={() => setMobileShopOpen(!mobileShopOpen)}
                    className="w-full flex items-center justify-between py-3 px-2 min-h-[52px] font-body text-base tracking-wider text-foreground/80 hover:text-primary transition-colors duration-200"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center text-primary/40">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </span>
                      Shop
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${mobileShopOpen ? 'rotate-180 text-primary' : 'text-foreground/40'
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileShopOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="py-2 px-2">
                          {loadingCategories ? (
                            <div className="py-8 flex flex-col items-center justify-center gap-3">
                              <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary/20 border-t-primary" />
                              <span className="text-xs text-muted-foreground animate-pulse">Loading collections...</span>
                            </div>
                          ) : categories.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                              No categories available
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              {categories.slice(0, 7).map((cat, index) => (
                                <motion.div
                                  key={cat._id || cat.name}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <Link
                                    to={`/shop?category=${cat.category}`}
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      setMobileShopOpen(false);
                                    }}
                                    className="group flex flex-col items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-primary/5 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-primary/20 active:scale-95"
                                  >
                                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-[#f5ecef] to-[#faf3f6]">
                                      <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                      />
                                      {cat.productCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm text-[8px] font-bold px-1.5 py-0.5 rounded-full text-primary shadow-sm border border-primary/10">
                                          {cat.productCount}
                                        </span>
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <span className="text-xs font-medium text-foreground/80 text-center truncate w-full group-hover:text-primary transition-colors duration-200">
                                      {cat.name}
                                    </span>
                                  </Link>
                                </motion.div>
                              ))}

                              {/* View All Jewellery Card */}
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                              >
                                <Link
                                  to="/shop"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setMobileShopOpen(false);
                                  }}
                                  className="group flex flex-col items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-primary/5 via-white to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 hover:shadow-lg border-2 border-dashed border-primary/20 hover:border-primary/40 active:scale-95"
                                >
                                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                    <div className="flex flex-col items-center justify-center gap-1.5">
                                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                                        <ChevronRight className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                                      </div>
                                      <span className="text-[9px] font-bold text-primary/60 uppercase tracking-wider group-hover:text-primary transition-colors duration-300">
                                        View All
                                      </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                  </div>
                                  <span className="text-xs font-semibold text-primary/80 text-center group-hover:text-primary transition-colors duration-300">
                                    All Jewellery
                                  </span>
                                </Link>
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* About Us with Icon */}
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 min-h-[52px] font-body text-base tracking-wider border-b border-border/10 text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  <span className="w-6 h-6 flex items-center justify-center text-primary/40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  About Us
                </Link>

                {/* Testimonials with Icon */}
                <Link
                  to="/testimonials"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 min-h-[52px] font-body text-base tracking-wider border-b border-border/10 text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  <span className="w-6 h-6 flex items-center justify-center text-primary/40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </span>
                  Testimonials
                </Link>

                {/* Contact Us with Icon */}
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 min-h-[52px] font-body text-base tracking-wider border-b border-border/10 text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  <span className="w-6 h-6 flex items-center justify-center text-primary/40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Contact Us
                </Link>

                {/* Account Section */}
                <div className="mt-4 space-y-1 pt-4 border-t border-border/20">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-2 min-h-[48px] text-foreground/80 hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5"
                      >
                        <User className="w-5 h-5 text-primary/40" /> Profile
                      </Link>
                      <Link
                        to="/track-order"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-2 min-h-[48px] text-foreground/80 hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5"
                      >
                        <Package className="w-5 h-5 text-primary/40" /> Track Order
                      </Link>
                      <Link
                        to="/order-summary"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-2 min-h-[48px] text-foreground/80 hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5"
                      >
                        <ShoppingBag className="w-5 h-5 text-primary/40" /> Order Summary
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-2 min-h-[48px] text-foreground/80 hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5"
                      >
                        <Settings className="w-5 h-5 text-primary/40" /> Account Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 py-3 px-2 min-h-[48px] text-destructive hover:text-destructive/80 transition-colors duration-200 rounded-lg hover:bg-destructive/5 w-full"
                      >
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-2 min-h-[48px] text-foreground/80 hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5"
                    >
                      <User className="w-5 h-5 text-primary/40" /> Login / Register
                    </Link>
                  )}
                </div>

                {/* Footer Branding */}
                <div className="mt-6 pt-4 text-center border-t border-border/10">
                  <p className="text-[10px] text-muted-foreground/50 tracking-wider uppercase">
                    JewelsKart • Premium Jewellery
                  </p>
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