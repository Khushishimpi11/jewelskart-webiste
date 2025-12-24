import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import logo from '@/assets/logo.png';

export const Footer = () => {
  return (
    <footer className="bg-charcoal-dark border-t border-border/30">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src={logo}
                alt="Evimeria Jewellery"
                className="h-20 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Crafting timeless elegance since 1995. Every piece tells a story of
              luxury, passion, and unparalleled craftsmanship.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['Shop All', 'New Arrivals', 'Best Sellers', 'Collections', 'Sale'].map(
                (link) => (
                  <li key={link}>
                    <Link
                      to="/shop"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors link-underline"
                    >
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-6">
              Categories
            </h4>
            <ul className="space-y-3">
              {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Wedding'].map(
                (category) => (
                  <li key={category}>
                    <Link
                      to={`/shop?category=${category.toLowerCase()}`}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors link-underline"
                    >
                      {category}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span>123 Luxury Lane, Diamond District, NYC 10036</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@evimeria.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Evimeria Jewellery. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <Link to="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
