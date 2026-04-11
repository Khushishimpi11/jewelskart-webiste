import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import partnerImg from '@/assets/partnerimg.jpg';
import exploreIcon from "../../assets/logoicon.png";

const benefits = [
  'Reach a wider audience',
  'Increase brand visibility',
  'Trusted platform',
];

export const PartnerSection = () => {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-primary flex justify-center px-4 sm:px-6">
      
      {/* MAIN CARD */}
      <div className="w-full max-w-7xl min-h-[400px] sm:min-h-[450px] lg:min-h-[470px] shadow-2xl flex flex-col lg:flex-row overflow-hidden">
        
        {/* RIGHT - CONTENT (Now on LEFT side for mobile, but will be on RIGHT for desktop) */}
        <div className="lg:w-1/2 w-full bg-[#FBF5F6] flex items-center justify-center p-3 sm:p-4 md:p-6 order-1 lg:order-1">
          
          <div className="w-full h-full border border-primary p-1 sm:p-2">
            
            <div className="w-full h-full border border-primary p-6 sm:p-8 md:p-10 lg:p-14">
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full mx-auto text-center"
              >
                {/* Badge */}
                <span className="inline-flex items-center bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 
                text-[10px] sm:text-[11px] tracking-[2px] uppercase rounded-full mb-4 sm:mb-5 whitespace-nowrap">
                  <img src={exploreIcon} alt="Explore" className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Become a Partner
                </span>

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4 leading-tight">
                  Partner With{' '}
                  <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="font-bold">Jewels</span>
                    <span className="font-thin tracking-wider">kart</span>
                  </span>
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 px-2 sm:px-0">
                  Showcase your jewelry brand to thousands of customers and grow your business with us
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                  {benefits.map((b) => (
                    <div
                      key={b}
                      className="flex items-center gap-1 sm:gap-1.5 border border-black/10 px-2 sm:px-3 py-1 rounded-full"
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs whitespace-nowrap">{b}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to="/contact?partner=true"
                  className="inline-block bg-primary text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm tracking-[2px] uppercase hover:bg-black transition duration-300 w-full sm:w-auto"
                >
                  Apply Now
                </Link>

              </motion.div>
              
            </div>
          </div>
          
        </div>

        {/* LEFT - IMAGE (Now on RIGHT side for desktop) */}
        <div className="lg:w-1/2 w-full h-64 sm:h-80 md:h-96 lg:h-auto order-2 lg:order-2">
          <img
            src={partnerImg}
            alt="Jewelry"
            className="w-full h-full object-cover"
          />
        </div>
        
      </div>
    </section>
  );
};