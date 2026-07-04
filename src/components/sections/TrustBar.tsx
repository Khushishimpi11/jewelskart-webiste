import React from "react";
import { Diamond, ShieldCheck, Truck, RefreshCw, Lock, Award, BadgeCheck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface TrustItem {
  icon: React.ReactNode;
  text: string;
  subtext?: string;
  link?: string;
}

const TrustBar: React.FC = () => {
  const trustItems: TrustItem[] = [
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      text: "100% Authentic",
      subtext: "Certified Jewellery",
      link: "/terms",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "Lifetime Warranty",
      subtext: "Against Manufacturing Defects",
      link: "/terms",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      text: "Secure Payments",
      subtext: "100% Safe Checkout",
      link: "/privacy",
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      text: "Easy Returns",
      subtext: "24 Hours Return Window",
      link: "/privacy",
    },
  ];

  return (
    <div className="w-full bg-primary/95 backdrop-blur-sm border-t border-white/10 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
          {trustItems.map((item, index) => (
            <Link
              key={index}
              to={item.link || "#"}
              target="_blank"
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center md:justify-start space-x-3 group relative cursor-pointer"
              >
                {/* Divider */}
                {index !== 0 && (
                  <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-px bg-white/15" />
                )}

                {/* Icon */}
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white backdrop-blur-sm transition-all duration-300">
                  <div className="text-primary transition">
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;