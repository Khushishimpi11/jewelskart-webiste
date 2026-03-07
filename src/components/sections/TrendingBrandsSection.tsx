import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { brands } from '@/data/brands';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

const TrendingBrandsSection = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-10 md:py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8">
          #Trending at <span className="text-primary">Jewelskart</span>
        </h2>

        <div className="relative group">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            slidesPerView={1.3}
            breakpoints={{
              375: { slidesPerView: 1.5, spaceBetween: 16 },
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 3.5, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            className="!overflow-visible"
          >
            {brands.map((brand, index) => (
              <SwiperSlide key={brand.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/brand/${brand.slug}`)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group/card aspect-[3/4] min-h-[280px] md:min-h-[360px]"
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Brand name + CTA */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-white font-serif text-lg md:text-xl font-semibold mb-1">
                      {brand.name}
                    </h3>
                    <p className="text-white/70 text-xs md:text-sm mb-3">{brand.tagline}</p>
                    <span className="inline-flex items-center text-white text-sm font-medium gap-1 group-hover/card:gap-2 transition-all">
                      Shop Now <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Nav buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 hidden md:flex w-10 h-10 rounded-full bg-background shadow-lg items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 hidden md:flex w-10 h-10 rounded-full bg-background shadow-lg items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingBrandsSection;
