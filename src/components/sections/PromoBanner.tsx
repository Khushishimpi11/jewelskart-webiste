import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import promoBanner from "../../assets/banner3.jpeg";

export const PromoBanner = () => {
  return (
    // Height: 250px on mobile, but matches your desktop code (450px+) on larger screens
    <section className="relative w-full h-[250px] sm:h-[450px] lg:h-[600px] overflow-hidden">

      {/* Background Image */}
      <img
        src={promoBanner}
        alt="JewelsKart Collection"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content Container */}
      <div className="relative z-10 flex items-center h-full px-6 sm:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[200px] sm:max-w-xl text-left"
        >
          {/* Heading */}
          <h2 className="leading-tight font-semibold text-white">
            {/* Signature Brand Text: Mobile 12px -> Desktop 4xl/3xl */}
            <span className="block font-light text-white/90 italic text-[12px] sm:text-4xl lg:text-6xl">
              Our Signature Brand
            </span>

            {/* Brand Name: Mobile text-xl -> Desktop 6xl */}
            <span
              className="block mt-0.5 sm:mt-4 text-xl sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <span className="font-semibold">JEWELS</span>
              <span className="font-extralight ">KART</span>
            </span>
          </h2>

          {/* Description: Mobile text-[10px] -> Desktop text-lg */}
          <p className="text-white/80 text-[10px] sm:text-lg mt-1 sm:mt-4 mb-4 sm:mb-8 leading-relaxed">
            Discover our exclusive in-house jewellery collection crafted with
            precision, elegance, and timeless beauty.
          </p>

          {/* Button: Mobile small -> Desktop large */}
          <Link
            to="/shop?brand=jewelskart"
            className="inline-flex items-center gap-1 sm:gap-2 bg-white text-primary px-3 py-1.5 sm:px-6 sm:py-3 text-[10px] sm:text-base shadow-lg hover:scale-105 transition"
          >
            <Sparkles className="w-3 h-3 sm:w-4 h-4" />

            <span>
              Shop{" "}
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                <span className="font-bold">JEWELS</span>
                <span className="font-thin tracking-wider">KART</span>
              </span>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};