import React from "react";
import offer from "../../assets/offer.png";
import offer1 from "../../assets/offer1.png";

const OfferBanners: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-8 md:px-6 py-6 md:py-10 bg-primary">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Banner 1 */}
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-start text-center px-6 
                     h-[150px]           /* Mobile Very Small */
                     xs:h-[180px]        /* Mobile Regular */
                     sm:h-[240px]        /* Small Tablet (Portrait) */
                     md:h-[200px]        /* Tablet (Landscape) */
                     lg:h-[300px]"       
          style={{
            backgroundImage: `url(${offer1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Content */}
          <div className="relative z-10 text-left md:text-center">
            <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm tracking-widest text-gray-500 mb-1">
              JEWELSKART
            </p>

            <h1 className="font-serif text-primary leading-tight mb-1 md:mb-3
                           text-xl
                           sm:text-3xl
                           md:text-4xl">      
              RINGS
            </h1>

            <p className="hidden xs:block text-[10px] sm:text-xs text-gray-400 mb-2 md:mb-4">
              EXCLUSIVE OFFER
            </p>

            <button className="bg-primary text-white rounded-lg font-semibold transition-transform active:scale-95
                               px-3 py-1 text-xs
                               sm:px-5 sm:py-2 sm:text-base
                               md:px-6 md:py-2 md:text-lg"> 
              20% OFF
            </button>

            <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-400 mt-2 md:mt-4">
              WWW.JEWELSKART.COM
            </p>
          </div>
        </div>

        {/* Banner 2 */}
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-start text-center px-6 
                     h-[150px] 
                     xs:h-[180px] 
                     sm:h-[240px] 
                     md:h-[200px] 
                     lg:h-[300px]"
          style={{
            backgroundImage: `url(${offer})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Content */}
          <div className="relative z-10 text-left md:text-center">
            <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm tracking-widest text-gray-500 mb-1">
              JEWELSKART
            </p>

            <h1 className="font-serif text-primary leading-tight mb-1 md:mb-3
                           text-xl 
                           sm:text-3xl 
                           md:text-4xl">
              PENDANTS
            </h1>

            <p className="hidden xs:block text-[10px] sm:text-xs text-gray-400 mb-2 md:mb-4">
              EXCLUSIVE OFFER
            </p>

            <button className="bg-primary text-white rounded-lg font-semibold transition-transform active:scale-95
                               px-3 py-1 text-xs 
                               sm:px-5 sm:py-2 sm:text-base 
                               md:px-6 md:py-2 md:text-lg">
              25% OFF
            </button>

            <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-400 mt-2 md:mt-4">
              WWW.JEWELSKART.COM
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfferBanners;