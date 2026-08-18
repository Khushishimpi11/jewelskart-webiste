import React, { useEffect, useRef, useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ringBg from "../../assets/ring.png";
import braceletBg from "../../assets/bracelet.png";
import earringBg from "../../assets/earring.png";
import pendantBg from "../../assets/pendant.png";
import necklaceBg from "../../assets/necklace.png";
import exploreIcon from "../../assets/logoicon.png";

const categories = [
  {
    id: "pendants",
    title: "PENDANTS",
    image: pendantBg,
    category: "pendants",
  },
  {
    id: "rings",
    title: "RINGS",
    image: ringBg,
    category: "rings",
  },
  {
    id: "earrings",
    title: "EARRINGS",
    image: earringBg,
    category: "earrings",
  },
  {
    id: "bracelets",
    title: "BRACELETS",
    image: braceletBg,
    category: "bracelets",
  },
  {
    id: "necklaces",
    title: "NECKLACES",
    image: necklaceBg,
    category: "necklaces",
  },
];

const Banner: React.FC = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);

  const [screenType, setScreenType] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  const isSnapping = useRef(false);

  // ----------------------------------------
  // Detect Screen Size
  // ----------------------------------------
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setScreenType("mobile");
      } else if (width < 1024) {
        setScreenType("tablet");
      } else {
        setScreenType("desktop");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ----------------------------------------
  // Visible Cards
  // ----------------------------------------
  const visibleCards =
    screenType === "mobile"
      ? 1
      : screenType === "tablet"
        ? 2
        : 4;

  /*
    Original cards ke baad cloned cards.
    Isliye last card ke baad naturally first card
    right side se continue hota hua aayega.
  */
  const displayItems = [
    ...categories,
    ...categories.slice(0, visibleCards),
  ];

  // ----------------------------------------
  // Reset on responsive change
  // ----------------------------------------
  useEffect(() => {
    setEnableTransition(false);
    setCurrentIndex(0);

    const timer = setTimeout(() => {
      setEnableTransition(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [screenType]);

  // ----------------------------------------
  // Auto Slide
  // ----------------------------------------
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (isSnapping.current) return;

      setEnableTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // ----------------------------------------
  // Infinite Loop Snap
  // ----------------------------------------
  useEffect(() => {
    if (currentIndex < categories.length) return;

    isSnapping.current = true;

    /*
      Pehle cloned first card tak normal animation hoti hai.
      Animation complete hone ke baad instantly original
      first card par snap hota hai.

      User ko snap visible nahi hota because dono
      cards exactly same hain.
    */
    const timer = setTimeout(() => {
      setEnableTransition(false);
      setCurrentIndex(0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          isSnapping.current = false;
        });
      });
    }, 620);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // ----------------------------------------
  // Next Slide
  // ----------------------------------------
  const slideRight = () => {
    if (isSnapping.current) return;

    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // ----------------------------------------
  // Previous Slide
  // ----------------------------------------
  const slideLeft = () => {
    if (isSnapping.current) return;

    /*
      First card par left click hone par
      directly last card position set karenge.
    */
    if (currentIndex === 0) {
      setEnableTransition(false);

      setCurrentIndex(categories.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          setCurrentIndex(categories.length - 1);
        });
      });

      return;
    }

    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // ----------------------------------------
  // Mobile Swipe
  // ----------------------------------------
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (screenType !== "mobile") return;

    const swipeThreshold = 50;

    if (info.offset.x < -swipeThreshold) {
      slideRight();
    } else if (info.offset.x > swipeThreshold) {
      slideLeft();
    }
  };

  // ----------------------------------------
  // Shop Navigation
  // ----------------------------------------
  const handleShopNavigation = (category: string) => {
    navigate(
      `/shop?brand=jewelskart&category=${category.toLowerCase()}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ----------------------------------------
  // Translate Calculation
  // ----------------------------------------
  const getTranslateX = () => {
    if (screenType === "mobile") {
      return `-${currentIndex * 100}%`;
    }

    if (screenType === "tablet") {
      return `calc(-${currentIndex} * (50% + 8px))`;
    }

    return `calc(-${currentIndex} * (25% + 6px))`;
  };

  return (
    <section className="w-full overflow-hidden bg-[#FBF5F6] py-10 sm:py-14 lg:py-20 xl:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================
            HEADER
        ========================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-8 text-center sm:mb-10"
        >
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 font-body text-[10px] uppercase tracking-widest text-white shadow-sm sm:text-xs">
              <img
                src={exploreIcon}
                alt="Explore"
                className="mr-2 h-4 w-4 object-contain sm:h-5 sm:w-5"
              />

              Top Categories
            </span>
          </div>

          <h2 className="mt-3 font-display text-[28px] leading-tight text-foreground sm:mt-4 sm:text-4xl md:text-5xl">
            Shop by Category
          </h2>

          <p className="mx-auto mt-3 max-w-[340px] text-[13px] leading-5 text-foreground/60 sm:max-w-xl sm:text-base md:max-w-2xl md:text-lg">
            Explore our exquisite collections of diamond jewelry,
            crafted for every special moment.
          </p>

          <div className="section-divider mt-4" />
        </motion.div>

        {/* =========================
            MOBILE
            1 FULL CARD
        ========================== */}

        <div
          className="relative block w-full overflow-hidden sm:hidden"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <motion.div
            className="flex w-full"
            animate={{
              x: `-${currentIndex * 100}%`,
            }}
            transition={
              enableTransition
                ? {
                  type: "tween",
                  duration: 0.6,
                  ease: "easeInOut",
                }
                : {
                  duration: 0,
                }
            }
            drag="x"
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {displayItems.map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="relative aspect-[4/3] w-full min-w-full flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-xl"
                onClick={() =>
                  handleShopNavigation(category.category)
                }
              >
                {/* IMAGE */}

                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${category.image})`,
                  }}
                />

                {/* GRADIENT */}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                {/* CONTENT */}

                <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-white">
                  <h3 className="mb-2 font-serif text-xl font-bold leading-tight tracking-wide drop-shadow-lg">
                    {category.title}
                  </h3>

                  <button
                    type="button"
                    className="border-b border-white pb-0.5 text-[11px] font-medium uppercase tracking-widest drop-shadow-lg transition-opacity hover:opacity-80"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleShopNavigation(
                        category.category
                      );
                    }}
                  >
                    Shop {category.category}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* =========================
            TABLET / DESKTOP
        ========================== */}

        <div
          className="relative hidden overflow-hidden sm:block"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-4 lg:gap-6"
            animate={{
              x: getTranslateX(),
            }}
            transition={
              enableTransition
                ? {
                  type: "tween",
                  duration: 0.6,
                  ease: "easeInOut",
                }
                : {
                  duration: 0,
                }
            }
          >
            {displayItems.map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="group relative aspect-[3/2] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-xl"
                style={{
                  width:
                    screenType === "tablet"
                      ? "calc((100% - 16px) / 2)"
                      : "calc((100% - 72px) / 4)",
                }}
                onClick={() =>
                  handleShopNavigation(category.category)
                }
              >
                {/* IMAGE */}

                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${category.image})`,
                  }}
                />

                {/* GRADIENT */}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                {/* CONTENT */}

                <div className="absolute bottom-0 left-0 right-0 z-10 p-4 text-white xl:p-5">
                  <h3 className="mb-2 font-serif text-lg font-bold leading-tight tracking-wide drop-shadow-lg md:text-xl">
                    {category.title}
                  </h3>

                  <button
                    type="button"
                    className="border-b border-white pb-0.5 text-xs font-medium uppercase tracking-widest drop-shadow-lg transition-opacity hover:opacity-80"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleShopNavigation(
                        category.category
                      );
                    }}
                  >
                    Shop {category.category}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* =========================
            MOBILE DOTS
        ========================== */}

        <div className="mt-5 flex items-center justify-center gap-1.5 sm:hidden">
          {categories.map((_, index) => {
            const activeIndex =
              currentIndex >= categories.length
                ? 0
                : currentIndex;

            return (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => {
                  setEnableTransition(true);
                  setCurrentIndex(index);
                }}
                className={`
                  h-1.5 rounded-full transition-all duration-300
                  ${activeIndex === index
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-primary/25"
                  }
                `}
              />
            );
          })}
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mt-7 flex items-center justify-center gap-3 sm:mt-9 sm:gap-5 lg:mt-10 lg:gap-6"
        >
          <button
            type="button"
            onClick={slideLeft}
            aria-label="Previous category"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              navigate("/shop");

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap px-1 font-body text-[10px] uppercase tracking-[0.14em] text-primary transition-colors hover:text-primary/80 sm:text-xs md:text-sm"
          >
            View All Categories
          </button>

          <button
            type="button"
            onClick={slideRight}
            aria-label="Next category"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;