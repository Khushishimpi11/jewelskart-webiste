import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import promoBanner from "../../assets/banner1.png";
import exploreIcon from "../../assets/logoicon.png";

export const PromoBanner = () => {
  return (
    <section className="relative w-full h-[450px] sm:h-[520px] lg:h-[600px] overflow-hidden">

      {/* Background Image */}
      <img
        src={promoBanner}
        alt="JewelsKart Collection"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black/30"></div> */}

      {/* Content */}
      
      <div className="relative z-10 flex items-center h-full px-6 sm:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-left"
        >

   {/* Heading */}
<h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight font-semibold">
  <span className="block font-light text-white/90 italic">
    Our Signature Brand
  </span>

  <span className="block mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
    <span className="font-semibold">JEWELS</span>
  <span className="font-extralight tracking-tight">KART</span>
  </span>
</h2>
{/* Description */}
          <p className="text-white/80 text-lg mt-4 mb-8 leading-relaxed">
            Discover our exclusive in-house jewellery collection crafted with
            precision, elegance, and timeless beauty.
          </p>

          {/* Button */}
          <Link
            to="/shop?brand=jewelskart"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3  shadow-lg hover:scale-105 transition"
          >
            <Sparkles className="w-4 h-4" />
            Shop JewelsKart
          </Link>

        </motion.div>
      </div>
    </section>
  );
};