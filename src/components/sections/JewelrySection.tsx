import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";

import ringHand from "@/assets/mring.png";
import ringBox from "@/assets/mock.png";
import necklace from "@/assets/Chain/Chain/c1.1.jpg";
import ring from "@/assets/Pendant/Pendant/p12.jpg";
import model from "@/assets/p.jpeg";
import exploreIcon from "../../assets/logoicon.png"; 

export const JewelrySection = () => {
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addItem);
  const addToWishlist = useWishlistStore((s) => s.addItem);

  const bottomProducts = [
    {
      id: "chain-001",  // Changed to match actual product ID from products.ts
      name: "Delicate Diamond Chain",
      price: "₹10,000 – ₹15,000",
      minPrice: 12649,
      maxPrice: 15000,
      image: necklace,
      description: "Elegant diamond chain for special occasions",
      category: "neckwear"
    },
    {
      id: "pendant-012",  // Changed to match actual product ID from products.ts
      name: "THE DIYA CREST",
      price: "₹15,000 – ₹21,000",
      minPrice: 20080,
      maxPrice: 21000,
      image: ring,
      description: "Beautiful pendant with intricate design",
      category: "neckwear"
    }
  ];

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ 
      id: product.id,
      name: product.name,
      price: product.minPrice,
      image: product.image,
      category: product.category
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.minPrice,
      image: product.image,
      category: product.category
    });
    toast.success(`${product.name} added to wishlist!`);
  };

  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Quick view: ${product.name}`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="w-full bg-[#fff] py-8 md:py-16 px-4 md:px-6 overflow-hidden">
      {/* --- TOP SECTION (Desktop: Grid / Mobile: Stacked) --- */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center mb-12">
        
        {/* Left Image (Arched) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start order-1 lg:order-none">
          <div className="relative w-full max-w-[480px] md:max-w-[580px] aspect-[10/13] group">
            <div className="w-full h-full rounded-t-full overflow-hidden relative">
              <img src={ringHand} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Ring Hand" />
              <div className="absolute bottom-6 md:bottom-10 left-4 md:left-10 right-4 md:right-10 h-[50%] border-l border-r border-b border-white/60 pointer-events-none z-20"></div>
            </div>

            {/* Arched SVG Text - Visible on ALL devices */}
            <svg viewBox="0 0 580 300" className="absolute top-[20px] left-0 w-full overflow-visible pointer-events-none z-30">
              <defs><path id="archPathTop" d="M 40,280 A 250,250 0 0 1 540,280" /></defs>
              <text fill="white" letterSpacing="1">
                <textPath 
                  href="#archPathTop" 
                  startOffset="50%" 
                  textAnchor="middle" 
                  fontSize="22"
                  className="font-serif italic text-[22px] md:text-[36px]"
                >
                  Where Beauty And Love Intertwine Perfectly
                </textPath>
              </text>
            </svg>

           <button 
  onClick={() => navigate("/shop")}
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
  w-[90px] h-[90px] md:w-[120px] md:h-[120px] 
  rounded-full bg-[#FBF5F6] backdrop-blur-md 
  flex items-center justify-center 
  transition-all duration-300 group-hover:bg-primary 
  border border-white shadow-2xl cursor-pointer z-40"
>
  <span className="text-[9px] md:text-[11px] font-bold tracking-[1.5px] md:tracking-[3px] text-center leading-tight text-gray-900 group-hover:text-white uppercase">
    SHOP<br/>NOW
  </span>
</button>
          </div>
        </div>

        {/* Center Content (Desktop Text) */}
        <div className="lg:col-span-4 text-center lg:text-left z-10 lg:pl-8 order-2 lg:order-none">
          <div className="mb-4 md:mb-6 flex justify-center lg:justify-start">
            <span className="inline-flex items-center bg-primary text-white px-3 md:px-4 py-1.5 md:py-2 font-body text-[8px] md:text-[10px] tracking-[2px] md:tracking-[3px] uppercase rounded-full shadow-md">
              <img src={exploreIcon} alt="Explore" className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 object-contain" />
              Timeless Jewelry Collections
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.1] md:leading-[1.05] mb-4 md:mb-8 text-gray-900">
            Unleash Your Style <br className="hidden sm:block" /> With Our Unique <br className="hidden sm:block" />Masterpieces
          </h2>
          <p className="text-gray-500 mb-6 md:mb-10 text-sm md:text-base lg:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 px-4 md:px-0">
            Discover our hand-picked selection of elegant pendants, exquisite rings, and premium chains designed to complement your unique personality.
          </p>
          <button 
            onClick={() => navigate("/shop")}
            className="bg-primary text-white px-6 md:px-10 py-3 md:py-5 flex items-center gap-3 md:gap-4 mx-auto lg:mx-0 hover:bg-black transition-all uppercase text-[10px] md:text-[12px] tracking-[2px] md:tracking-[3px] font-bold"
          >
            Shop Now <span className="text-lg md:text-xl">→</span>
          </button>
        </div>

        {/* Right Image (Floating Ring Box) */}
        <div className="lg:col-span-3 flex justify-center lg:justify-end relative order-3 lg:order-none">
          <div className="relative md:-top-12 md:-right-10 lg:-right-4 transition-transform duration-700 hover:scale-105">
            <img src={ringBox} className="w-[200px] md:w-[280px] lg:w-[350px] object-contain drop-shadow-2xl" alt="Ring Box" />
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION (Desktop: Grid / Mobile: Centered Row) --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start relative">
        
        {/* Products Grid - MOBILE VIEW FROM CODE 2 */}
        <div className="lg:col-span-7 order-2 lg:order-none">
          <div className="w-full flex justify-center lg:block">
            <div className="flex flex-row lg:flex-row justify-center lg:justify-between gap-4 sm:gap-6 md:gap-8 overflow-x-auto lg:overflow-visible px-4 lg:px-0 pb-4">
              {bottomProducts.map((product) => (
                <div 
                  key={product.id}
                  className="min-w-[160px] max-w-[200px] lg:min-w-0 lg:max-w-none lg:flex-1 group cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative bg-white aspect-[3/3.5] sm:aspect-[4/5] overflow-hidden mb-3 border border-gray-50 rounded-lg md:rounded-none">
                    <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                      <button onClick={(e) => handleAddToCart(product, e)} className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"><ShoppingCart size={14} /></button>
                      <button onClick={(e) => handleQuickView(product, e)} className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"><Eye size={14} /></button>
                      <button onClick={(e) => handleWishlist(product, e)} className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"><Heart size={14} /></button>
                    </div>
                  </div>
                  <h3 className="text-sm md:text-lg font-serif text-gray-800 text-center lg:text-left">{product.name}</h3>
                  <p className="text-gray-500 text-xs md:text-sm mt-1 uppercase tracking-wider text-center lg:text-left">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model Image - DESKTOP VIEW FROM CODE 1 */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end lg:-mt-32 z-20 order-1 lg:order-none">
          <div className="relative w-full max-w-[400px] md:max-w-[500px] aspect-[10/13] group">
            <div className="w-full h-full rounded-t-full overflow-hidden relative shadow-md">
              <img src={model} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Model" />
              <div className="absolute bottom-6 md:bottom-10 left-4 md:left-8 right-4 md:right-8 h-[50%] border-l border-r border-b border-white/60 pointer-events-none z-20"></div>
            </div>
            
            {/* Arched SVG Text - Visible on ALL devices */}
            <svg viewBox="0 0 500 300" className="absolute top-[20px] left-0 w-full overflow-visible pointer-events-none z-30">
              <defs><path id="archPathBottom" d="M 30,280 A 220,220 0 0 1 470,280" /></defs>
              <text fill="white" letterSpacing="1">
                <textPath 
                  href="#archPathBottom" 
                  startOffset="50%" 
                  textAnchor="middle" 
                  fontSize="18"
                  className="font-serif italic text-[18px] md:text-[28px]"
                >
                  Elegance In Every Detail
                </textPath>
              </text>
            </svg>

            <button 
              onClick={() => navigate("/shop")}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full bg-[#FBF5F6] backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-primary border border-white shadow-lg cursor-pointer z-40"
            >
              <span className="text-[9px] md:text-[11px] font-bold tracking-[2px] md:tracking-[3px] text-center leading-tight text-gray-900 group-hover:text-white uppercase">SHOP<br/>NOW</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};