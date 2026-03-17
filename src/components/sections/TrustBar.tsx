import React from "react";
import { Diamond, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface TrustItem {
  icon: React.ReactNode;
  text: string;
  subtext?: string;
}

const TrustBar: React.FC = () => {
  const trustItems: TrustItem[] = [
    {
      icon: <Diamond className="w-5 h-5" />,
      text: "Certified Jewellery",
      subtext: "100% Authentic",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "Lifetime Warranty",
      subtext: "Against Defects",
    },
    {
      icon: <Truck className="w-5 h-5" />,
      text: "Free Shipping",
      subtext: "Worldwide Delivery",
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      text: "Easy Returns",
      subtext: "30-Day Policy",
    },
  ];

  return (
    <div className="w-full bg-primary/95 backdrop-blur-sm border-t border-white/10 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10">

          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center md:justify-start space-x-3 group relative cursor-pointer"
            >

              {/* Divider */}
              {index !== 0 && (
                <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-px bg-white/15" />
              )}

              {/* Icon */}
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white backdrop-blur-sm transition-all duration-300 ">
                <div className="text-primary  transition">
                  {item.icon}
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white tracking-wide">
                  {item.text}
                </span>

                {item.subtext && (
                  <span className="text-xs text-white/70">
                    {item.subtext}
                  </span>
                )}
              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default TrustBar;