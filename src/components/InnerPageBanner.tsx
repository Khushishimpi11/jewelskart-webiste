import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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
    <section className="relative bg-card/80 py-16 lg:py-20 border-b border-border/30">
      {/* Dark overlay pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-card to-background opacity-80" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, hsl(43, 52%, 54%, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(43, 52%, 54%, 0.03) 0%, transparent 50%)`,
      }} />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 mb-6 text-sm">
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

          {subtitle && (
            <span className="text-primary font-body text-sm tracking-luxury uppercase">
              {subtitle}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-5xl text-foreground mt-2">
            {title}
          </h1>
          <div className="section-divider mt-6" />
        </motion.div>
      </div>
    </section>
  );
};
