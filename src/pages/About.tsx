import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InnerPageBanner } from "@/components/InnerPageBanner";
import {
  Eye,
  Target,
  Gem,
  Sparkles,
  Users,
  Calendar,
  Diamond,
  Heart,
  Shield,
  Clock,
  ArrowRight,
  Check,
  Quote,
} from "lucide-react";

import exploreIcon from "../assets/logoicon.png";
import aboutStoryImage from "../assets/about-banner.jpeg";
import aboutStoryImage2 from "../assets/about-banner1.png";
import founderImage from "../assets/founder.jpeg";


const CounterItem = ({
  end,
  label,
  suffix = "",
  icon,
}: {
  end: number;
  label: string;
  suffix?: string;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="flex justify-center mb-3 md:mb-5">
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500">
          <span className="text-white group-hover:text-primary transition-colors duration-500">
            {icon}
          </span>
        </div>
      </div>

      <h3 className="text-xl md:text-3xl lg:text-4xl font-display text-white mb-1 md:mb-2">
        {end.toLocaleString()}
        {suffix}
      </h3>

      <p className="text-white/70 uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[11px] lg:text-xs">
        {label}
      </p>
    </motion.div>
  );
};


const About = () => {
  return (
    <div className="min-h-screen bg-white text-foreground overflow-hidden">
      <Header />

      <main className="pt-16 lg:pt-24">

        {/* =====================================================
            HERO / BANNER
        ====================================================== */}

        <InnerPageBanner
          title="About Us"
          subtitle="Our Legacy"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "About Us" },
          ]}
        />


        {/* =====================================================
            INTRO / STORY SECTION
        ====================================================== */}

        <section className="relative py-12 md:py-20 lg:py-28 bg-gradient-to-b from-primary/[0.06] via-white to-white">
          <div className="absolute top-20 left-0 w-72 h-72 bg-primary/[0.05] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">

              {/* TEXT */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <span className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.18em] uppercase">
                  <img
                    src={exploreIcon}
                    alt=""
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Our Journey Since 1990
                </span>

                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.08] mt-4 md:mt-6 lg:mt-7 mb-4 md:mb-6 lg:mb-7">
                  A Legacy of
                  <span className="block text-primary italic">
                    Trust & Beauty
                  </span>
                </h2>

                <div className="flex items-center gap-3 mb-5 md:mb-8">
                  <div className="w-12 md:w-16 h-[1px] bg-primary" />
                  <Diamond className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  <div className="w-6 md:w-8 h-[1px] bg-primary/40" />
                </div>

                <p className="text-muted-foreground leading-7 md:leading-8 text-sm md:text-base lg:text-lg mb-4 md:mb-6">
                  Our brand was born in 1990, but its roots run far deeper.
                  Jewellery has always been more than a business — it is a
                  legacy passed down through generations, carrying stories of
                  love, celebration, and timeless elegance.
                </p>

                <p className="text-muted-foreground leading-7 md:leading-8 text-sm md:text-base lg:text-lg">
                  Today, we blend heritage craftsmanship with contemporary
                  elegance, continuing a legacy built on integrity while
                  evolving with changing times. What began as a family
                  tradition is now a trusted name creating jewellery that
                  celebrates generations of love, milestones, and timeless
                  beauty.
                </p>

                <div className="mt-6 md:mt-9 flex items-center gap-3 md:gap-4">
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-semibold text-foreground text-sm md:text-base">
                      Crafted With Love
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Jewellery that becomes part of your story.
                    </p>
                  </div>
                </div>
              </motion.div>


              {/* IMAGES */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative min-h-[350px] md:min-h-[500px] lg:min-h-[600px] order-1 lg:order-2"
              >
                <div className="absolute top-0 right-0 w-[78%] h-[85%] border border-primary/30 rounded-[1.5rem] md:rounded-[2rem]" />

                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-3 md:top-5 left-0 w-[65%] md:w-[68%] h-[70%] md:h-[75%] rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-xl md:shadow-2xl"
                >
                  <img
                    src={aboutStoryImage}
                    alt="Our Jewellery Legacy"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-0 right-0 w-[55%] md:w-[58%] h-[55%] md:h-[58%] rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-xl md:shadow-2xl border-4 md:border-8 border-white"
                >
                  <img
                    src={aboutStoryImage2}
                    alt="Our Jewellery Craftsmanship"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="absolute bottom-[6%] md:bottom-[8%] left-[3%] md:left-[5%] z-20">
                  <div className="w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 rounded-full bg-primary text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                    <span className="font-display text-lg md:text-2xl">
                      36+
                    </span>
                    <span className="text-[7px] md:text-[9px] uppercase tracking-widest">
                      Years
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>


        {/* =====================================================
            STATS
        ====================================================== */}

        <section className="relative py-12 md:py-16 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full border-[40px] border-white" />
            <div className="absolute -bottom-40 right-20 w-96 h-96 rounded-full border-[50px] border-white" />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-12 lg:gap-y-0 gap-x-4 md:gap-8">
              <CounterItem
                end={36}
                suffix="+"
                label="Years of Experience"
                icon={<Clock className="w-4 h-4 md:w-5 md:h-5" />}
              />

              <CounterItem
                end={1990}
                label="Established Since"
                icon={<Calendar className="w-4 h-4 md:w-5 md:h-5" />}
              />

              <CounterItem
                end={50000}
                suffix="+"
                label="Happy Customers"
                icon={<Users className="w-4 h-4 md:w-5 md:h-5" />}
              />

              <CounterItem
                end={100}
                suffix="+"
                label="Custom Designs"
                icon={<Diamond className="w-4 h-4 md:w-5 md:h-5" />}
              />
            </div>
          </div>
        </section>


        {/* =====================================================
            FOUNDATION
        ====================================================== */}

        <section className="py-14 md:py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-10 md:mb-16"
            >
              <span className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.18em] uppercase">
                <img
                  src={exploreIcon}
                  alt=""
                  className="w-4 h-4 md:w-5 md:h-5 object-contain"
                />
                Our Foundation
              </span>

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-4 md:mt-6">
                Built on
                <span className="text-primary italic"> Trust & Craftsmanship</span>
              </h2>

              <div className="flex items-center justify-center gap-3 mt-4 md:mt-6">
                <div className="w-10 md:w-14 h-[1px] bg-primary" />
                <Diamond className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <div className="w-10 md:w-14 h-[1px] bg-primary" />
              </div>

              <p className="text-muted-foreground mt-4 md:mt-6 leading-6 md:leading-7 text-sm md:text-base">
                Every creation reflects our commitment to timeless design,
                exceptional craftsmanship and relationships built over generations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5 md:gap-7">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group relative p-6 md:p-8 lg:p-10 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.05] to-white shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-primary/[0.05] group-hover:scale-150 transition-transform duration-700" />

                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 md:mb-6 lg:mb-7 shadow-lg">
                    <Eye className="w-5 h-5 md:w-6 md:h-7 text-white" />
                  </div>

                  <p className="text-primary text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase mb-1 md:mb-2">
                    What We Believe
                  </p>

                  <h3 className="font-display text-2xl md:text-3xl mb-3 md:mb-4 lg:mb-5">
                    Our Vision
                  </h3>

                  <p className="text-muted-foreground leading-6 md:leading-8 text-sm md:text-base">
                    To become a timeless symbol of trust, elegance, and
                    craftsmanship in the world of fine jewellery enriching
                    lives with precious creations that celebrate beauty,
                    heritage, and prosperity.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group relative p-6 md:p-8 lg:p-10 rounded-2xl bg-primary text-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full border-[30px] border-white/10 group-hover:scale-125 transition-transform duration-700" />

                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-16 rounded-2xl bg-white flex items-center justify-center mb-4 md:mb-6 lg:mb-7 shadow-lg">
                    <Target className="w-5 h-5 md:w-6 md:h-7 text-primary" />
                  </div>

                  <p className="text-white/60 text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase mb-1 md:mb-2">
                    What Drives Us
                  </p>

                  <h3 className="font-display text-2xl md:text-3xl mb-3 md:mb-4 lg:mb-5">
                    Our Mission
                  </h3>

                  <p className="text-white/80 leading-6 md:leading-8 text-sm md:text-base">
                    To passionately craft and curate exceptional jewellery
                    using the finest precious stones and diamonds, while
                    upholding integrity, quality, and customer satisfaction
                    built over generations since 1990.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>


        {/* =====================================================
            FOUNDER SECTION
        ====================================================== */}

        <section className="relative py-14 md:py-20 lg:py-28 bg-[#faf9f7] overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative max-w-xs md:max-w-sm mx-auto lg:max-w-none w-full"
              >
                <div className="absolute -inset-3 md:-inset-4 border border-primary/30 rounded-[1.5rem] md:rounded-[2rem]" />
                <div className="absolute -inset-5 md:-inset-8 border border-primary/10 rounded-[2rem] md:rounded-[2.5rem]" />

                <div className="relative rounded-[1rem] md:rounded-[1.5rem] overflow-hidden bg-white shadow-xl md:shadow-2xl">
                  <img
                    src={founderImage}
                    alt="Hasmukh Ramesh Solanki - Founder"
                    className="w-full aspect-[4/5] object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent h-1/3" />

                  <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white">
                    <p className="text-[8px] md:text-xs tracking-[0.2em] md:tracking-[0.25em] uppercase text-white/70 mb-1">
                      Founder
                    </p>
                    <h3 className="font-display text-lg md:text-2xl">
                      Hasmukh Ramesh Solanki
                    </h3>
                  </div>
                </div>

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -right-3 md:-right-5 top-8 md:top-10 w-10 h-10 md:w-14 md:h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#faf9f7]"
                >
                  <Diamond className="w-4 h-4 md:w-6 md:h-6" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  The Founder
                </span>

                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-4 md:mt-6 leading-tight">
                  A Vision Built on
                  <span className="block text-primary italic">
                    Trust & Purity
                  </span>
                </h2>

                <div className="flex items-center gap-3 my-4 md:my-6 lg:my-7">
                  <div className="w-16 md:w-20 h-[1px] bg-primary" />
                  <Diamond className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-1 md:mb-2">
                  Hasmukh Ramesh Solanki
                </h3>

                <p className="text-primary text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase mb-4 md:mb-6 lg:mb-7">
                  Founder & Visionary
                </p>

                <div className="relative">
                  <Quote className="absolute -left-3 md:-left-5 -top-2 md:-top-3 w-6 h-6 md:w-8 md:h-10 text-primary/10" />

                  <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-7 md:leading-8 mb-4 md:mb-6 pl-4 md:pl-6">
                    With over 36 years of experience in the jewellery industry,
                    he carries a vision of delivering purity, craftsmanship,
                    and trust.
                  </p>
                </div>

                <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-7 md:leading-8">
                  Born into a jewellery legacy, he officially established the
                  brand in 1990 to preserve family values of trust and purity,
                  while introducing modern innovation and refined customer
                  experience.
                </p>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-9">
                  <div className="p-3 md:p-5 bg-white rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-shadow">
                    <Gem className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2 md:mb-3" />
                    <h4 className="font-semibold text-sm md:text-base mb-0.5 md:mb-1">
                      Diamond Selection
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Curated with precision
                    </p>
                  </div>

                  <div className="p-3 md:p-5 bg-white rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-shadow">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2 md:mb-3" />
                    <h4 className="font-semibold text-sm md:text-base mb-0.5 md:mb-1">
                      Precious Stones
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Expertise in gemstones
                    </p>
                  </div>

                  <div className="p-3 md:p-5 bg-white rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-shadow">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2 md:mb-3" />
                    <h4 className="font-semibold text-sm md:text-base mb-0.5 md:mb-1">
                      Custom Jewellery
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Designs around your story
                    </p>
                  </div>

                  <div className="p-3 md:p-5 bg-white rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-shadow">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2 md:mb-3" />
                    <h4 className="font-semibold text-sm md:text-base mb-0.5 md:mb-1">
                      Purity & Trust
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Values across generations
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>


        {/* =====================================================
            VALUES SECTION - FIXED CARD NUMBERS
        ====================================================== */}

        <section className="relative py-14 md:py-20 lg:py-28 bg-[#fbfaf8] overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-primary/[0.035] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-24 w-[460px] h-[460px] rounded-full bg-primary/[0.04] blur-3xl pointer-events-none" />

          <div className="absolute left-[7%] top-24 bottom-24 w-[1px] bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden xl:block" />
          <div className="absolute right-[7%] top-24 bottom-24 w-[1px] bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden xl:block" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-10 md:mb-14 lg:mb-18"
            >
              <div className="inline-flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                <span className="w-6 md:w-8 h-[1px] bg-primary/40" />
                <span className="text-primary text-[10px] md:text-[11px] lg:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase font-medium">
                  What Defines Us
                </span>
                <span className="w-6 md:w-8 h-[1px] bg-primary/40" />
              </div>

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                Values That Shape
                <span className="block text-primary italic mt-1">
                  Every Creation
                </span>
              </h2>

              <p className="text-muted-foreground leading-6 md:leading-7 max-w-2xl mx-auto mt-4 md:mt-6 text-sm md:text-base">
                From the purity of our materials to the relationships we build,
                every detail reflects values carried forward through generations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-5 lg:gap-7 max-w-6xl mx-auto">
              {[
                {
                  number: "01",
                  icon: <Heart className="w-5 h-5 md:w-6 md:h-6" />,
                  title: "Purity",
                  text: "Every creation reflects our unwavering commitment to authenticity, transparency and exceptional quality.",
                },
                {
                  number: "02",
                  icon: <Shield className="w-5 h-5 md:w-6 md:h-6" />,
                  title: "Trust",
                  text: "Relationships nurtured over generations through honesty, integrity and promises that stand the test of time.",
                },
                {
                  number: "03",
                  icon: <Gem className="w-5 h-5 md:w-6 md:h-6" />,
                  title: "Craftsmanship",
                  text: "Fine detailing, skilled artistry and thoughtful design come together to create jewellery made to be treasured.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.12,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -9 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 border border-primary/10 rounded-[20px] md:rounded-[26px] group-hover:border-primary/25 transition-colors duration-500" />

                  <div className="relative min-h-[280px] md:min-h-[310px] lg:min-h-[330px] p-6 md:p-7 lg:p-8 xl:p-9 rounded-[20px] md:rounded-[26px] bg-white overflow-hidden shadow-[0_10px_45px_rgba(0,0,0,0.035)] group-hover:shadow-[0_22px_60px_rgba(60,10,20,0.10)] transition-all duration-500">
                    {/* Fixed Number - Now properly contained */}
                    <span className="absolute -right-1 -top-4 font-display text-[70px] md:text-[90px] lg:text-[100px] leading-none text-primary/[0.06] group-hover:text-primary/[1] transition-colors duration-500 select-none pointer-events-none">
                      {item.number}
                    </span>

                    <div className="absolute left-0 top-8 md:top-10 w-[2px] md:w-[3px] h-10 md:h-12 rounded-r-full bg-primary scale-y-50 group-hover:scale-y-100 transition-transform duration-500 origin-center" />

                    <div className="relative w-10 h-10 md:w-12 md:h-14 rounded-full border border-primary/15 bg-primary/[0.06] text-primary flex items-center justify-center mb-5 md:mb-6 lg:mb-8 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500">
                      {item.icon}
                    </div>

                    <span className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.28em] uppercase text-primary/60">
                      Our Principle
                    </span>

                    <h3 className="font-display text-2xl md:text-3xl mt-1 md:mt-2 mb-2 md:mb-3 lg:mb-4">
                      {item.title}
                    </h3>

                    <p className="text-muted-foreground leading-6 md:leading-7 text-xs md:text-sm lg:text-base">
                      {item.text}
                    </p>

                    <div className="flex items-center gap-3 mt-5 md:mt-6 lg:mt-8">
                      <div className="w-6 md:w-8 h-[1px] bg-primary/40 group-hover:w-10 md:group-hover:w-14 transition-all duration-500" />
                      <Diamond className="w-2.5 h-2.5 md:w-3 md:h-3.5 text-primary/50" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* =====================================================
            CTA SECTION - IMPROVED MOBILE WIDTH
        ====================================================== */}

        <section className="relative bg-white px-0 md:px-4 pt-4 md:pt-6 pb-14 md:pb-20 lg:pb-28 overflow-hidden">
          <div className="container mx-auto px-0 md:px-4">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative max-w-full md:max-w-7xl mx-auto rounded-none md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f7f2ef] via-[#fcfaf8] to-[#f3e9e6]" />

              <div className="absolute -left-40 -top-44 w-[430px] h-[430px] rounded-full border border-primary/[0.08]" />
              <div className="absolute -left-28 -top-32 w-[320px] h-[320px] rounded-full border border-primary/[0.10]" />
              <div className="absolute -right-44 -bottom-56 w-[520px] h-[520px] rounded-full bg-primary/[0.045]" />
              <div className="absolute -right-20 -bottom-36 w-[330px] h-[330px] rounded-full border border-primary/[0.10]" />

              <div className="absolute inset-[0px] md:inset-[12px] lg:inset-[14px] rounded-none md:rounded-[1.6rem] lg:rounded-[2rem] border border-primary/10 pointer-events-none" />

              <div className="relative z-10 py-10 md:py-14 lg:py-20 px-4 md:px-8 lg:px-12">
                <div className="max-w-3xl mx-auto text-center">
                  <p className="text-primary text-[9px] md:text-[10px] lg:text-xs tracking-[0.25em] md:tracking-[0.32em] uppercase font-medium mb-3 md:mb-5">
                    Discover The Jewelskart Experience
                  </p>

                  <h2 className="font-display text-2xl md:text-4xl lg:text-5xl xl:text-[3.6rem] leading-[1.12] text-foreground">
                    Jewellery Made to Become
                    <span className="block text-primary italic mt-1">
                      Part of Your Story
                    </span>
                  </h2>

                  <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-6 md:leading-7 lg:leading-8 max-w-2xl mx-auto mt-4 md:mt-6">
                    Celebrate life's unforgettable moments with jewellery shaped by
                    generations of craftsmanship, trust and timeless elegance.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-6 md:mt-9">
                    <motion.a
                      href="/collections"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      className="group inline-flex w-full sm:w-auto min-w-[200px] md:min-w-[215px] items-center justify-center gap-2 md:gap-3 bg-primary text-white px-6 md:px-7 py-3.5 md:py-4 rounded-full text-sm md:text-sm font-semibold tracking-wide shadow-[0_12px_30px_rgba(90,20,35,0.18)] hover:shadow-[0_16px_40px_rgba(90,20,35,0.28)] transition-all duration-300"
                    >
                      Explore Collection
                      <ArrowRight className="w-4 h-4 md:w-4 md:h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </motion.a>

                    <motion.a
                      href="/contact"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex w-full sm:w-auto min-w-[180px] md:min-w-[190px] items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border border-primary/20 text-primary px-6 md:px-7 py-3.5 md:py-4 rounded-full text-sm md:text-sm font-semibold tracking-wide hover:bg-white hover:border-primary/35 transition-all duration-300"
                    >
                      Get In Touch
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;