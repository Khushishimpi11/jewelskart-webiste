import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import bannerImg from '@/assets/promo-banner.png';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface InnerPageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  backgroundImage?: string;
}

export const InnerPageBanner = ({ title, subtitle, breadcrumbs, backgroundImage }: InnerPageBannerProps) => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-36 overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img src={backgroundImage || bannerImg} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl text-white mt-2">
            {title?.toLowerCase() === "jewelskart" ? (
              <span
                className="text-xl sm:text-2xl md:text-4xl"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <span className="font-bold">JEWELS</span>
                <span className="font-thin tracking-wider">KART</span>
              </span>
            ) : (
              title
            )}
          </h1>
          <div className="section-divider mt-3 sm:mt-4 bg-white" />

          {/* Breadcrumb below title */}
          <nav className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-5 text-xs sm:text-sm">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1.5 sm:gap-2">
                {index > 0 && <ChevronRight className="w-3 h-3 text-white/60" />}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {crumb.label?.toLowerCase() === "jewelskart" ? (
                      <span
                        className="text-[10px] sm:text-xs md:text-sm"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <span className="font-bold">JEWELS</span>
                        <span className="font-thin tracking-wider">KART</span>
                      </span>
                    ) : (
                      crumb.label
                    )}
                  </Link>
                ) : (
                  <span className="text-white font-medium">
                    {crumb.label?.toLowerCase() === "jewelskart" ? (
                      <span
                        className="text-[10px] sm:text-xs md:text-sm"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <span className="font-bold">JEWELS</span>
                        <span className="font-thin tracking-wider">KART</span>
                      </span>
                    ) : (
                      crumb.label
                    )}
                  </span>
                )}
              </span>
            ))}
          </nav>
        </motion.div>
      </div>
    </section>
  );
};