import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import bannerImg from '@/assets/promo-banner.jpg';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface InnerPageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
}

export const InnerPageBanner = ({ title, subtitle, breadcrumbs }: InnerPageBannerProps) => {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img src={bannerImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay for better text visibility */}
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* {subtitle && (
            <span className="text-white font-body text-sm tracking-luxury uppercase">
              {subtitle}
            </span>
          )} */}
          <h1 className="font-display text-4xl md:text-5xl text-white mt-2"> {/* Changed to white text */}
            {title}
          </h1>
          <div className="section-divider mt-4 bg-white" /> {/* Adjusted divider color */}

          {/* Breadcrumb below title */}
          <nav className="flex items-center justify-center gap-2 mt-5 text-s">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-3 h-3 text-white/60" />}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </motion.div>
      </div>
    </section>
  );
};