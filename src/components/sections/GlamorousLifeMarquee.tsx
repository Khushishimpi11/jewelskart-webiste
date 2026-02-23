import React, { useState } from 'react';
import exploreIcon from '../../assets/logoicon.png';
import { motion } from "framer-motion";

interface MarqueeItem {
  name: string;
  image: string;
}

const GlamorousLifeMarquee: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<MarqueeItem | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Sample data - you can replace these with your actual image paths
   const topMarqueeItems: MarqueeItem[] = [
    { name: "Pearl Jewellery", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop" },
    { name: "Chunky Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop" },
    { name: "Bridal Jewellery", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&h=200&fit=crop" },
    { name: "Gemstone Jewellery", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop" },
    { name: "Layered Necklaces", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" },
    { name: "Off-Shoulder", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&h=200&fit=crop" },
    { name: "Navratna Stones", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=200&fit=crop" },
    { name: "Enamel Jewellery", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=200&h=200&fit=crop" },
  ];

  const bottomMarqueeItems: MarqueeItem[] = [
    { name: "Bridal Jewellery", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&h=200&fit=crop" },
    { name: "Gemstone Jewellery", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop" },
    { name: "Pearl Jewellery", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop" },
    { name: "Chunky Necklace", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop" },
    { name: "Layered Necklaces", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" },
    { name: "Off-Shoulder", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&h=200&fit=crop" },
    { name: "Navratna Stones", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=200&fit=crop" },
    { name: "Enamel Jewellery", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=200&h=200&fit=crop" },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (item: MarqueeItem) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // Sparkle SVG component with the same color as Glam Collection badge
 // Sparkle SVG component with explicit primary color
// Sparkle SVG component with explicit color
const SparkleIcon = () => (
  <svg 
    className="sparkle-icon" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: '#7A002C' }}  // Direct hex color added
  >
    <path 
      d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" 
      fill="currentColor"
    />
  </svg>
);

  return (
<div className="w-full bg-gradient-to-r from-[#F6E6EC] to-[#EED3DC] py-16 overflow-hidden relative">    <div className="absolute inset-0 opacity-10">
  <div className="absolute top-10 left-10 w-40 h-40 bg-[#E8C7D3] rounded-full blur-3xl"></div>
  <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#DFA8BB] rounded-full blur-3xl"></div>
</div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Heading */}
       <div className="container mx-auto px-4 lg:px-8">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mb-10"
  >
    {/* Top Badge */}
    <span className="inline-flex items-center bg-primary text-white px-4 py-1 font-body text-sm tracking-luxury uppercase rounded-full">
      <img src={exploreIcon} alt="Glamorous" className="w-6 h-6 mr-2" />
      Glam Collection
    </span>

    {/* Main Heading */}
    <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-2">
      Glamorous Life
    </h2>

    {/* Subtitle */}
    <p className="text-foreground/60 text-lg max-w-2xl mx-auto mb-3">
      Elevate your everyday elegance with statement pieces that shine with timeless beauty.
    </p>

    {/* Divider */}
    <div className="section-divider" />
  </motion.div>
</div>

        {/* Top Marquee - Left to Right */}
        <div className="mb-8 relative">
          <div className="marquee-container-top ">
            <div className="marquee-content-top ">
              {/* First set */}
              {topMarqueeItems.map((item, index) => (
                <React.Fragment key={`top-${index}`}>
                  <div
                    className="marquee-item "
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="text-lg font-medium whitespace-nowrap ">
                      {item.name}
                    </span>
                  </div>
                  {index < topMarqueeItems.length - 1 && (
                    <div className="sparkle-wrapper">
                      <SparkleIcon />
                    </div>
                  )}
                </React.Fragment>
              ))}
              {/* Add sparkle after last item before duplicate */}
              <div className="sparkle-wrapper ">
                <SparkleIcon />
              </div>
              {/* Duplicate set for seamless loop */}
              {topMarqueeItems.map((item, index) => (
                <React.Fragment key={`top-duplicate-${index}`}>
                  <div
                    className="marquee-item"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="text-lg font-medium whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                  {index < topMarqueeItems.length - 1 && (
                    <div className="sparkle-wrapper">
                      <SparkleIcon />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Marquee - Right to Left */}
        <div className="relative">
          <div className="marquee-container-bottom">
            <div className="marquee-content-bottom">
              {/* First set */}
              {bottomMarqueeItems.map((item, index) => (
                <React.Fragment key={`bottom-${index}`}>
                  <div
                    className="marquee-item"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="text-lg font-medium whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                  {index < bottomMarqueeItems.length - 1 && (
                    <div className="sparkle-wrapper">
                      <SparkleIcon />
                    </div>
                  )}
                </React.Fragment>
              ))}
              {/* Add sparkle after last item before duplicate */}
              <div className="sparkle-wrapper">
                <SparkleIcon />
              </div>
              {/* Duplicate set for seamless loop */}
              {bottomMarqueeItems.map((item, index) => (
                <React.Fragment key={`bottom-duplicate-${index}`}>
                  <div
                    className="marquee-item"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="text-lg font-medium whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                  {index < bottomMarqueeItems.length - 1 && (
                    <div className="sparkle-wrapper">
                      <SparkleIcon />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Image Popup */}
        {hoveredItem && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: mousePosition.x + 20,
              top: mousePosition.y - 100,
              transform: 'translate(0, -50%)'
            }}
          >
            <div className="relative">
              {/* Image container */}
              <div className="w-48 h-48 rounded-lg overflow-hidden shadow-2xl border-4 border-primary">
                <img
                  src={hoveredItem.image}
                  alt={hoveredItem.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback for demo purposes
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/200x200?text=${hoveredItem.name}`;
                  }}
                />
              </div>
              {/* Name label */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                <span className="text-sm font-semibold text-white">
                  {hoveredItem.name}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .marquee-container-top {
          width: 100%;
          overflow: hidden;
          background: var(--primary);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          border-top: 1px solid rgba(255, 192, 203, 0.3);
          border-bottom: 1px solid rgba(255, 192, 203, 0.3);
        }

        .marquee-content-top {
          display: inline-flex;
          align-items: center;
          animation: scrollLeft 30s linear infinite;
          gap: 2rem;
        }

        .marquee-container-bottom {
          width: 100%;
          overflow: hidden;
          background: var(--primary);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          border-top: 1px solid rgba(255, 192, 203, 0.3);
          border-bottom: 1px solid rgba(255, 192, 203, 0.3);
        }

        .marquee-content-bottom {
          display: inline-flex;
          align-items: center;
          animation: scrollRight 30s linear infinite;
          gap: 2rem;
        }

       .marquee-item {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  background: white;
  color: var(--primary);
  font-weight: 500;
}
       .marquee-item:hover {
  transform: scale(1.08);
  background: white;
  color: var(--primary);
}

        .sparkle-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          animation: rotateAndScale 2s ease-in-out infinite;
        }

      .sparkle-icon {
  width: 24px;
  height: 24px;
  color: var(--primary);
  animation: sparklePulse 1.2s ease-in-out infinite;
}

        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes rotateAndScale {
          0% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(90deg) scale(1.2);
          }
          50% {
            transform: rotate(180deg) scale(1);
          }
          75% {
            transform: rotate(270deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

      @keyframes sparklePulse {
  0% {
    transform: scale(0.5);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.4);
    opacity: 1;
  }
  100% {
    transform: scale(0.5);
    opacity: 0.7;
  }
}

        /* Pause animation on hover */
        .marquee-container-top:hover .marquee-content-top,
        .marquee-container-bottom:hover .marquee-content-bottom {
          animation-play-state: paused;
        }

        /* Individual sparkle animation variations */
        .marquee-content-top .sparkle-wrapper:nth-child(4n) .sparkle-icon,
        .marquee-content-bottom .sparkle-wrapper:nth-child(4n) .sparkle-icon {
          animation-delay: -0.5s;
        }

        .marquee-content-top .sparkle-wrapper:nth-child(4n+1) .sparkle-icon,
        .marquee-content-bottom .sparkle-wrapper:nth-child(4n+1) .sparkle-icon {
          animation-delay: -1s;
        }

        .marquee-content-top .sparkle-wrapper:nth-child(4n+2) .sparkle-icon,
        .marquee-content-bottom .sparkle-wrapper:nth-child(4n+2) .sparkle-icon {
          animation-delay: -1.5s;
        }
      `}</style>
    </div>
  );
};

export default GlamorousLifeMarquee;