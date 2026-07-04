import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from "@/assets/logo.png";

// Images for categories
import ringImg from '@/assets/ring.jpeg';
import pendantImg from '@/assets/chains.webp';
import earringImg from '@/assets/earring/e1.jpg';
import braceletImg from '@/assets/c.jpg';
import necklaceImg from '@/assets/c.png';

const getCategoryImage = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('ring')) return ringImg;
  if (name.includes('earring')) return earringImg;
  if (name.includes('pendant')) return pendantImg;
  if (name.includes('necklace')) return necklaceImg;
  if (name.includes('bracelet')) return braceletImg;
  return ringImg;
};

const capitalizeCategory = (name: string) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const Footer = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL || API_BASE_URL;

  // Fetch ONLY featured categories from API (same as Header)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        
        if (data.success && data.categories) {
          // ✅ ONLY featured categories (same filter as Header)
          const featuredCategories = data.categories
            .filter((cat: any) => cat.isActive === true && cat.featured === true)
            .map((cat: any) => ({
              name: capitalizeCategory(cat.name),
              slug: cat.slug || cat.name.toLowerCase(),
              img: getCategoryImage(cat.name),
            }));
          setCategories(featuredCategories);
        }
      } catch (error) {
        console.error("Error fetching categories for footer:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <footer className="bg-primary border-t border-burgundy/20">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 items-start">

          {/* Column 1: Logo and Info */}
          <div className="lg:col-span-1 flex flex-col gap-6 -mt-20 items-center text-center md:items-start md:text-left">
            <Link to="/" className="block">
              <img 
                src={logo}
                alt="Jewelskart Jewellery"
                className="w-40 md:w-48 lg:w-56 h-auto object-contain md:-ml-8"
              />
            </Link>
            
            <p className="text-white/60 text-sm leading-relaxed max-w-xs -mt-16">
              Crafting timeless elegance since 1995. Every piece tells a story of luxury, passion, and unparalleled craftsmanship.
            </p>
            
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-display text-lg text-white mb-6 font-bold">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Shop All', path: '/shop' },
                { name: 'About Us', path: '/about' },
                { name: 'Testimonials', path: '/testimonials' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'My Account', path: '/account' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/80 text-sm hover:underline hover:decoration-white underline-offset-4 transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories - Featured Categories ONLY */}
          <div className="text-center md:text-left">
            <h4 className="font-display text-lg text-white mb-6 font-bold">Categories</h4>
            {loadingCategories ? (
              <div className="text-white/60 text-sm">Loading...</div>
            ) : categories.length === 0 ? (
              <div className="text-white/60 text-sm">No categories</div>
            ) : (
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link 
                      to={`/shop?category=${category.slug}`} 
                      className="text-white/80 text-sm hover:underline hover:decoration-white underline-offset-4 transition-all duration-300"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Column 4: Contact Us */}
          <div className="text-center md:text-left">
            <h4 className="font-display text-lg text-white mb-6 font-bold">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start md:items-start items-center justify-center md:justify-start gap-3 text-white/80 text-sm text-center md:text-left">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3 h-3 text-primary" />
                </div>
                <span>42, MG Road, Connaught Place, New Delhi 110001</span>
              </li>

              <li className="flex items-center justify-center md:justify-start gap-3 text-white/80 text-sm text-center md:text-left">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 h-3 text-primary" />
                </div>
                <span>+91 98765 43210</span>
              </li>

              <li className="flex items-center justify-center md:justify-start gap-3 text-white/80 text-sm text-center md:text-left">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 text-primary" />
                </div>
                <span>support@jewelskartindia.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
         <p className="text-white/70 text-sm">
  © 2026 
  <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
    <span className="font-bold">Jewels</span>
    <span className="font-thin tracking-wider">kart</span>
  </span>. 
  All rights reserved. | Designed by{" "}
  
  <a 
    href="https://www.pawartechnologyservices.com/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-white font-semibold hover:underline"
  >
    Pawar Technologies and Services
  </a>
</p>
          <div className="flex items-center gap-6 text-white/60 text-sm justify-center md:justify-start">
            <Link to="/RefundCancellationPage" className="hover:text-white transition-colors">Refund & Cancellation Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};