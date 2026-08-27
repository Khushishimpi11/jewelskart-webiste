import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gem, Bell, Check, X, ArrowRight, Lock, Crown, Star } from 'lucide-react';
import { toast } from 'sonner';

// Import fallback and category assets for background blur
import earringImg from '@/assets/earring.png';
import braceletImg from '@/assets/bracelet.png';
import ringImg from '@/assets/ring.png';
import necklaceImg from '@/assets/necklace.png';
import pendantImg from '@/assets/pendant.png';
import coupleRingImg from '@/assets/couple-ring.png';
import defaultBannerImg from '@/assets/banner1.png';
import offerImg from '@/assets/offer.png';

interface ComingSoonCardProps {
  categoryName?: string;
  categorySlug?: string;
  customImage?: string;
  index?: number;
}

export const ComingSoonCard: React.FC<ComingSoonCardProps> = ({
  categoryName = 'Designs',
  categorySlug = '',
  customImage,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Normalize category name for smart display
  const cleanCategory = categoryName
    .replace(/^jewelskart\s*/i, '')
    .trim();
  
  const displayCategoryTitle = cleanCategory && cleanCategory.toLowerCase() !== 'shop all' && cleanCategory.toLowerCase() !== 'all products'
    ? cleanCategory
    : 'Exclusive';

  // Determine appropriate blurred backdrop image based on active category
  const getBackdropImage = () => {
    if (customImage) return customImage;
    const cat = (categorySlug || categoryName).toLowerCase();
    if (cat.includes('earring')) return earringImg;
    if (cat.includes('bracelet')) return braceletImg;
    if (cat.includes('couple')) return coupleRingImg;
    if (cat.includes('ring')) return ringImg;
    if (cat.includes('necklace') || cat.includes('chain')) return necklaceImg;
    if (cat.includes('pendant')) return pendantImg;
    return offerImg || defaultBannerImg;
  };

  const backdropImage = getBackdropImage();

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitted(true);
    toast.success(`✨ You're on the VIP list for upcoming ${displayCategoryTitle} designs!`);
    setTimeout(() => {
      setIsModalOpen(false);
      setEmail('');
      setIsSubmitted(false);
    }, 1800);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-gradient-to-b from-[#FFFDF9] to-[#FAF4EE] rounded-lg shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-[#611431]/20 hover:border-[#611431]/60 h-full flex flex-col overflow-hidden select-none"
      >
        {/* Subtle Ambient Gold Glow around card on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37]/0 via-[#E8C99B]/30 to-[#611431]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none" />

        {/* ========== IMAGE SECTION (Matches ProductCard aspect-square) ========== */}
        <div className="relative aspect-square overflow-hidden bg-[#200A13] flex-shrink-0 flex items-center justify-center">
          
          {/* Background Blurred Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 filter blur-[10px] scale-105 opacity-60"
            style={{ backgroundImage: `url(${backdropImage})` }}
          />

          {/* Deep Luxury Gradient Overlay for contrast and rich feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2b0817]/95 via-[#3b0d21]/60 to-[#18040d]/80" />

          {/* Golden Pattern / Shimmer Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#E8C99B]/25 via-transparent to-transparent pointer-events-none" />

          {/* Floating animated sparkles */}
          <motion.div
            animate={{
              opacity: [0.3, 0.9, 0.3],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none"
          >
            <Sparkles className="absolute top-6 left-6 w-4 h-4 text-[#F3E5AB] opacity-70 animate-pulse" />
            <Star className="absolute bottom-8 left-8 w-3 h-3 text-[#E8C99B] opacity-60 fill-current" />
            <Sparkles className="absolute top-10 right-8 w-3.5 h-3.5 text-[#F3E5AB] opacity-80" />
            <Star className="absolute bottom-10 right-10 w-2.5 h-2.5 text-[#D4AF37] opacity-60 fill-current" />
          </motion.div>

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#611431] to-[#801b41] text-[#FFFDF9] text-[9px] sm:text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full shadow-lg border border-[#E8C99B]/40 uppercase">
              <Sparkles className="w-2.5 h-2.5 text-[#F3E5AB]" />
              Exclusive Design
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md text-[#E8C99B] text-[9px] sm:text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border border-[#E8C99B]/30 uppercase">
              <Lock className="w-2.5 h-2.5" />
              Coming Soon
            </span>
          </div>

          {/* Centerpiece Luxury Orb / Gem Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
            {/* Animated Golden Halo Ring */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-[#E8C99B]/40 pointer-events-none"
            />

            {/* Glowing Glass Icon Container */}
            <motion.div
              whileHover={{ scale: 1.12, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_0_rgba(232,201,155,0.25)] flex items-center justify-center group-hover:border-[#E8C99B] transition-colors duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#E8C99B]/20 to-transparent opacity-60" />
              <Gem className="w-8 h-8 sm:w-10 sm:h-10 text-[#F9E8B2] drop-shadow-[0_2px_10px_rgba(232,201,155,0.6)] transform group-hover:scale-110 transition-transform duration-300" />
              
              {/* Little crown floating */}
              <div className="absolute -top-2 -right-2 bg-[#611431] text-[#E8C99B] p-1 rounded-full border border-[#E8C99B]/50 shadow-md">
                <Crown className="w-3 h-3" />
              </div>
            </motion.div>

            {/* Center Tagline */}
            <div className="mt-3">
              <p className="text-[#FFFDF9] font-display text-sm sm:text-base font-semibold tracking-wide drop-shadow-md">
                In The Vault
              </p>
              <p className="text-[#E8C99B]/90 text-[10px] sm:text-xs tracking-wider uppercase font-medium">
                Handcrafted Atelier
              </p>
            </div>
          </div>

          {/* Bottom quick CTA on hover */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 py-2 sm:py-2.5 bg-gradient-to-r from-[#611431]/95 via-[#7a1c40]/95 to-[#611431]/95 backdrop-blur-md text-[#FFFDF9] text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-colors z-10 flex items-center justify-center gap-1.5 shadow-lg border-t border-[#E8C99B]/30"
            initial={{ y: '100%', opacity: 0 }}
            animate={{
              y: isHovered ? '0%' : '100%',
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Bell className="w-3.5 h-3.5 text-[#E8C99B]" />
            Notify Me When Available
          </motion.div>
        </div>

        {/* ========== CONTENT SECTION (Matches ProductCard layout & typography) ========== */}
        <div className="p-2.5 sm:p-3.5 lg:p-4 space-y-1 sm:space-y-1.5 flex flex-col flex-grow justify-between bg-gradient-to-b from-white to-[#FDFBF7]">
          <div>
            {/* Category Tag */}
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8px] sm:text-[10px] font-bold text-[#611431] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                {displayCategoryTitle} Collection
              </span>
              <span className="text-[8px] sm:text-[9px] font-semibold text-[#8C6D3F] bg-[#FAF3E0] px-2 py-0.5 rounded-full border border-[#E8C99B]/40">
                New Releases
              </span>
            </div>

            {/* Product Card Title */}
            <h3 className="font-display font-bold text-gray-900 text-xs sm:text-sm lg:text-base line-clamp-2 group-hover:text-[#611431] transition-colors mt-0.5">
              More Exclusive Designs Coming Soon
            </h3>

            {/* Descriptive Note */}
            <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed mt-1">
              Our master artisans are currently crafting limited edition pieces for this collection.
            </p>
          </div>

          {/* Pricing placeholder & CTA Button */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-medium block">
                  Status
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#611431] flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping mr-0.5" />
                  Coming Soon
                </span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md bg-gradient-to-r from-[#611431] to-[#801b41] hover:from-[#4d0f26] hover:to-[#6a1636] text-[#FFFDF9] text-[10px] sm:text-xs font-semibold tracking-wide shadow-sm hover:shadow-md transition-all group/btn"
              >
                <span>Notify Me</span>
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========== VIP NOTIFICATION MODAL ========== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EE] to-[#F5ECE2] rounded-2xl shadow-2xl border border-[#E8C99B]/60 p-6 sm:p-8 overflow-hidden z-10"
            >
              {/* Background decorative glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#E8C99B]/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#611431]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6">
                {/* Diamond Icon Container */}
                <div className="relative mb-3 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#611431] to-[#8b1f48] text-[#E8C99B] shadow-lg border border-[#E8C99B]/50 flex items-center justify-center">
                    <Gem className="w-7 h-7 drop-shadow-sm" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#FAF3E0] border border-[#E8C99B] p-1 rounded-full shadow-sm text-[#8C6D3F]">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                </div>

                {/* VIP Early Access Pill Badge */}
                <span className="inline-flex items-center gap-1.5 bg-[#FAF3E0] border border-[#E8C99B]/60 text-[#8C6D3F] text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3 shadow-xs">
                  <Crown className="w-3 h-3 text-[#D4AF37]" />
                  VIP Early Access
                </span>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Exclusive Designs Coming Soon
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed max-w-xs mx-auto">
                  Be the first to explore new handcrafted <strong>{displayCategoryTitle}</strong> pieces with VIP early bird privileges.
                </p>
              </div>

              {/* Form */}
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-emerald-900 text-sm">You're On The VIP List!</h4>
                  <p className="text-xs text-emerald-700">
                    We'll email you the moment our next exclusive design arrives.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleNotifySubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for early access"
                      className="w-full px-4 py-2.5 text-sm bg-white rounded-lg border border-gray-300 focus:border-[#611431] focus:ring-2 focus:ring-[#611431]/20 outline-none transition-all shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#611431] via-[#7a1c40] to-[#611431] text-[#FFFDF9] rounded-lg text-sm font-semibold tracking-wide shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4 text-[#E8C99B]" />
                    <span>Get Notified on Launch</span>
                  </button>

                  <p className="text-[10px] text-gray-400 text-center">
                    🔒 We respect your privacy. No spam, only exclusive design reveals.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
