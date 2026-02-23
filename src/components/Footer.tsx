import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-burgundy-dark border-t border-burgundy/20">
      <div className="container mx-auto px-4 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logo} 
                alt="Jewelskart Jewellery"
                className="h-16 sm:h-20 lg:h-28 w-auto object-contain"
              />
            </Link>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 mt-2 sm:mt-4">
              Crafting timeless elegance since 1995. Every piece tells a story of luxury, passion, and unparalleled craftsmanship.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-9 h-9 sm:w-10 sm:h-10 min-h-[44px] min-w-[44px] rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-base sm:text-lg text-white mb-4 sm:mb-6 font-bold">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Shop All', path: '/shop' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'My Account', path: '/account' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/80 text-xs sm:text-sm hover:underline hover:decoration-white underline-offset-4 transition-all duration-300 min-h-[44px] inline-flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base sm:text-lg text-white mb-4 sm:mb-6 font-bold">Categories</h4>
            <ul className="space-y-2 sm:space-y-3">
              {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants'].map((category) => (
                <li key={category}>
                  <Link to={`/shop?category=${category.toLowerCase()}`} className="text-white/80 text-xs sm:text-sm hover:underline hover:decoration-white underline-offset-4 transition-all duration-300 min-h-[44px] inline-flex items-center">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-display text-base sm:text-lg text-white mb-4 sm:mb-6 font-bold">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3 text-white/80 text-xs sm:text-sm">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3 h-3 text-primary" />
                </div>
                <span>42, MG Road, Connaught Place, New Delhi 110001</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 text-xs sm:text-sm">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 h-3 text-primary" />
                </div>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 text-xs sm:text-sm">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 text-primary" />
                </div>
                <span>hello@evimeria.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-4 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-white/70 text-[10px] sm:text-sm text-center md:text-left">
            © 2026 <span className="text-white">Jewelskart.</span> All rights reserved. | Designed by <span className="text-white">Pawar Technologies and Services</span>
          </p>
          <div className="flex items-center gap-4 sm:gap-6 text-white/40 text-[10px] sm:text-sm">
            <Link to="#" className="hover:text-gold transition-colors min-h-[44px] inline-flex items-center">Privacy Policy</Link>
            <Link to="#" className="hover:text-gold transition-colors min-h-[44px] inline-flex items-center">Terms of Service</Link>
            <Link to="#" className="hover:text-gold transition-colors min-h-[44px] inline-flex items-center">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};