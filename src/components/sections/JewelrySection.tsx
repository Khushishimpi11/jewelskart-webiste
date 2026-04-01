import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye } from "lucide-react";

import ringHand from "@/assets/mring.jpg";
import ringBox from "@/assets/mock.png";
import necklace from "@/assets/Chain/Chain/c1.1.jpg";
import ring from "@/assets/Pendant/Pendant/p12.jpg";
import model from "@/assets/mchain.jpg";
import exploreIcon from "../../assets/logoicon.png"; 

export const JewelrySection = () => {
  const navigate = useNavigate();


  // Product data for bottom section
  const bottomProducts = [
    {
      id: "diamond-chain-1",
      name: "Delicate Diamond Chain",
      price: "₹10,000 – ₹15,000",
      minPrice: 10000,
      maxPrice: 15000,
      image: necklace,
      description: "Elegant diamond chain for special occasions"
    },
    {
      id: "delicate-pendant-1",
      name: "Delicate Pendant",
      price: "₹15,000 – ₹21,000",
      minPrice: 15000,
      maxPrice: 21000,
      image: ring,
      description: "Beautiful pendant with intricate design"
    }
  ];

  // Handle Add to Cart
  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const productToAdd = {
      ...product,
      price: product.minPrice, // Using min price for cart
    };
    addToCart(productToAdd);
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  // Handle Wishlist
  const handleWishlist = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToWishlist(product);
    toast.success(`${product.name} added to wishlist!`, {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  // Handle Quick View
  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Quick view:", product);
    toast.info(`Quick view: ${product.name}`, {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  return (
    <section className="w-full bg-[#fff] py-16 px-6 overflow-hidden">
      
      {/* --- TOP SECTION --- */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[580px] aspect-[10/13] group">
            <div className="w-full h-full rounded-t-full overflow-hidden relative">
              <img src={ringHand} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Ring Hand" />
              <div className="absolute bottom-10 left-10 right-10 h-[50%] border-l border-r border-b border-white/60 pointer-events-none z-20"></div>
            </div>
            <svg viewBox="0 0 580 300" className="absolute top-[20px] left-0 w-full overflow-visible pointer-events-none z-30">
              <defs><path id="archPathTop" d="M 40,280 A 250,250 0 0 1 540,280" /></defs>
              <text fill="white" fontSize="36" className="font-serif italic" letterSpacing="1">
                <textPath href="#archPathTop" startOffset="50%" textAnchor="middle">Where Beauty And Love Intertwine Perfectly</textPath>
              </text>
            </svg>
            <button 
              onClick={() => navigate("/shop")}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full bg-[#FBF5F6] backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:bg-primary border border-white shadow-2xl cursor-pointer z-40"
            >
              <span className="text-[12px] font-bold tracking-[4px] text-center leading-tight text-gray-900 group-hover:text-white uppercase">SHOP<br/>NOW</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 text-center lg:text-left z-10 lg:pl-8">
          <div className="mb-6 flex justify-center lg:justify-start">
            <span className="inline-flex items-center bg-primary text-white px-4 py-2 font-body text-[10px] tracking-[3px] uppercase rounded-full shadow-md">
              <img 
                src={exploreIcon} 
                alt="Explore" 
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 object-contain" 
                onError={(e) => console.log("Icon load error", e)}
              />
              Timeless Jewelry Collections
            </span>
          </div>

          <h2 className="text-5xl lg:text-5xl font-serif leading-[1.05] mb-8 text-gray-900">Unleash Your Style <br /> With Our Unique <br />Masterpieces</h2>
          <p className="text-gray-500 mb-10 text-base lg:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">Discover our hand-picked selection of elegant pendants, exquisite rings, and premium chains designed to complement your unique personality.</p>
          <button 
            onClick={() => navigate("/shop")}
            className="bg-primary text-white px-10 py-5 flex items-center gap-4 mx-auto lg:mx-0 hover:bg-black transition-all uppercase text-[12px] tracking-[3px] font-bold"
          >
            Shop Now <span className="text-xl">→</span>
          </button>
        </div>

        <div className="lg:col-span-3 flex justify-center lg:justify-end relative">
          <div className="relative -top-12 -right-10 lg:-right-16 transition-transform duration-700 hover:scale-105">
            <img src={ringBox} className="w-[300px] lg:w-[350px] object-contain drop-shadow-2xl -ml-8" alt="Ring Box" />
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION WITH HOVER ICONS --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-8">
          {bottomProducts.map((product) => (
            <div 
              key={product.id}
              className="flex-1 group cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative bg-white aspect-[4/5] overflow-hidden mb-4 border border-gray-50">
                <img 
                  src={product.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={product.name} 
                />
                
                {/* HOVER OVERLAY WITH ICONS */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                  {/* Add to Cart - Blue on hover */}
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    className="bg-white p-2.5 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-md transform hover:scale-110"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={18} />
                  </button>
                  
                  {/* Quick View - Green on hover */}
                  <button 
                    onClick={(e) => handleQuickView(product, e)}
                    className="bg-white p-2.5 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md transform hover:scale-110"
                    aria-label="Quick view"
                  >
                    <Eye size={18} />
                  </button>
                  
                  {/* Wishlist - Red on hover */}
                  <button 
                    onClick={(e) => handleWishlist(product, e)}
                    className="bg-white p-2.5 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md transform hover:scale-110"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-serif text-gray-800">{product.name}</h3>
              <p className="text-gray-400 text-md mt-1 uppercase tracking-wider">{product.price}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end lg:-mt-32 z-20">
          <div className="relative w-full max-w-[500px] aspect-[10/13] group">
            <div className="w-full h-full rounded-t-full overflow-hidden relative shadow-md">
              <img src={model} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Model" />
              <div className="absolute bottom-10 left-8 right-8 h-[50%] border-l border-r border-b border-white/60 pointer-events-none z-20"></div>
            </div> 

            <svg viewBox="0 0 500 300" className="absolute top-[20px] left-0 w-full overflow-visible pointer-events-none z-30">
              <defs><path id="archPathBottomFixed" d="M 30,280 A 220,220 0 0 1 470,280" /></defs>
              <text fill="white" fontSize="28" className="font-serif italic" letterSpacing="1">
                <textPath href="#archPathBottomFixed" startOffset="50%" textAnchor="middle">
                  Elegance In Every Detail
                </textPath>
              </text>
            </svg>
            
            <button 
              onClick={() => navigate("/shop")}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] rounded-full bg-[#FBF5F6] backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-primary border border-white shadow-lg cursor-pointer z-40"
            >
              <span className="text-[11px] font-bold tracking-[3px] text-center leading-tight text-gray-900 group-hover:text-white uppercase">SHOP<br/>NOW</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};