import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { brands } from '@/data/brands';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/swiper-bundle.css';

const TrendingBrandsSection = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Double the brands array for seamless infinite loop
  const loopBrands = [...brands, ...brands, ...brands];

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  // Autoplay video on leftmost visible card
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      // realIndex maps to the first visible slide
      const brandIndex = i % brands.length;
      if (brandIndex === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  return (
    <section className="py-10 md:py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8">
          #Trending at <span className="text-primary">Jewelskart</span>
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1.3}
          loop
          speed={800}
          breakpoints={{
            375: { slidesPerView: 1.5, spaceBetween: 16 },
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 3.5, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          onSlideChange={handleSlideChange}
        >
          {loopBrands.map((brand, index) => {
            const brandIdx = index % brands.length;
            return (
              <SwiperSlide key={`${brand.id}-${index}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 4) * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/shop?brand=${brand.slug}`)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group/card aspect-[3/4] min-h-[280px] md:min-h-[360px]"
                >
                  {/* Video for active leftmost card, image for others */}
                  {brand.video ? (
                    <>
                      <video
                        ref={(el) => { videoRefs.current[index] = el; }}
                        src={brand.video}
                        muted
                        loop
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                          brandIdx === activeIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <img
                        src={brand.image}
                        alt={brand.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-all duration-700 group-hover/card:scale-110 ${
                          brandIdx === activeIndex ? 'opacity-0' : 'opacity-100'
                        }`}
                      />
                    </>
                  ) : (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                  )}

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Brand name + CTA */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-white font-serif text-lg md:text-xl font-semibold mb-1">
                      {brand.name}
                    </h3>
                    <p className="text-white/70 text-xs md:text-sm mb-3">{brand.tagline}</p>
                    <span className="inline-flex items-center gap-1 text-white text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full group-hover/card:bg-white/20 transition-all">
                      Shop Now
                    </span>
                  </div>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default TrendingBrandsSection;
