import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { brands } from '@/data/brands';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/swiper-bundle.css';
import exploreIcon from '../../assets/logoicon.png'; // Adjust path as needed

const TrendingBrandsSection = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);

  // Sirf original brands (no need to triple for videos)
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  // Initialize all videos
  useEffect(() => {
    const playAllVideos = async () => {
      const playPromises = videoRefs.current.map(async (video) => {
        if (!video) return;
        
        try {
          // Ensure video is loaded
          await video.load();
          
          // Play video
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        } catch (error) {
          console.log('Video play failed:', error);
        }
      });

      await Promise.allSettled(playPromises);
      setVideosLoaded(true);
    };

    playAllVideos();

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
          video.removeAttribute('src');
          video.load();
        }
      });
    };
  }, []);

  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header - Matching BestSellersSection style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="inline-flex items-center bg-primary text-white px-3 sm:px-4 py-1 font-body text-xs sm:text-sm tracking-luxury uppercase rounded-full">
            <img src={exploreIcon} alt="Explore" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Trending Now
          </span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-foreground mt-3 sm:mt-4 mb-2">
            Shop by Brands
          </h2>
          <p className="text-foreground/60 text-sm sm:text-lg max-w-2xl mx-auto mb-3">
            Explore our most sought-after brands, setting trends in the world of fine jewellery.
          </p>
          <div className="section-divider" />
        </motion.div>

        {/* Swiper Slider */}
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Swiper
            modules={[Autoplay]}
              spaceBetween={18}
            slidesPerView={1.2}
            loop={true}
            speed={1200} // Thoda slow transition
            breakpoints={{
              375: { slidesPerView: 1.5, spaceBetween: 16 },
              480: { slidesPerView: 2, spaceBetween: 16 },
              640: { slidesPerView: 2.2, spaceBetween: 18 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 3.5, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            autoplay={{ 
              delay: 3000, // 5 seconds - increased time
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              stopOnLastSlide: false,
              reverseDirection: false,
              waitForTransition: true
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            onInit={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
          >
            {brands.map((brand, index) => {
              const isActiveSlide = index === activeIndex;
              
              return (
                <SwiperSlide key={brand.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 4) * 0.1, duration: 0.2 }}
                    viewport={{ once: true }}
                    onClick={() => navigate(`/shop?brand=${brand.slug}`)}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group/card aspect-[3/4] min-h-[350px] md:min-h-[450px] lg:min-h-[520px] w-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
                    style={{ border: '1px solid transparent' }}
                    whileHover={{ scale: 1.02, borderColor: 'hsl(46, 67%, 52%, 0.3)' }}
                  >
                    {/* Video - Sirf video dikhega */}
                    {brand.video && (
                      <video
                        ref={(el) => { 
                          videoRefs.current[index] = el;
                        }}
                        src={brand.video}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover z-10"
                      />
                    )}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

                    {/* Brand name + CTA */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 z-30">
                      <h3 className="text-white font-serif text-lg md:text-xl lg:text-2xl font-semibold mb-1">
                        {brand.name}
                      </h3>
                      <p className="text-white/70 text-xs md:text-sm lg:text-base mb-3 md:mb-4">
                        {brand.tagline}
                      </p>
                      <span className="inline-flex items-center gap-1 text-white text-sm md:text-base font-medium bg-white/10 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full group-hover/card:bg-white/20 transition-all">
                        Shop Now
                      </span>
                    </div>

                    {/* Video Status Indicator */}
                    {isActiveSlide && (
                      <div className="absolute top-4 left-4 z-30 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Playing
                      </div>
                    )}
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {brands.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                swiperRef.current?.slideToLoop(index, 800);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index 
                  ? 'w-8 bg-primary' 
                  : 'w-4 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingBrandsSection;