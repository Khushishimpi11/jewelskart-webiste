import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import bannerImg from '@/assets/inner-banner.jpg';

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
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={bannerImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/60" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {subtitle && (
            <span className="text-primary font-body text-sm tracking-luxury uppercase">
              {subtitle}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-5xl text-foreground mt-2">
            {title}
          </h1>
          <div className="section-divider mt-4" />

          {/* Breadcrumb below title */}
          <nav className="flex items-center justify-center gap-2 mt-5 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </motion.div>
      </div>
    </section>
  );
};
