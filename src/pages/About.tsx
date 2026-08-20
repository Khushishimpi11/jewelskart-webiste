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
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500">
          <span className="text-white group-hover:text-primary transition-colors duration-500">
            {icon}
          </span>
        </div>
      </div>

      <h3 className="text-3xl md:text-4xl font-display text-white mb-2">
        {end.toLocaleString()}
        {suffix}
      </h3>

      <p className="text-white/70 uppercase tracking-[0.2em] text-[11px] md:text-xs">
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

        <section className="relative py-20 md:py-28 bg-gradient-to-b from-primary/[0.06] via-white to-white">
          <div className="absolute top-20 left-0 w-72 h-72 bg-primary/[0.05] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* TEXT */}

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs tracking-[0.18em] uppercase">
                  <img
                    src={exploreIcon}
                    alt=""
                    className="w-5 h-5 object-contain"
                  />
                  Our Journey Since 1990
                </span>

                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.08] mt-7 mb-7">
                  A Legacy of
                  <span className="block text-primary italic">
                    Trust & Beauty
                  </span>
                </h2>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-16 h-[1px] bg-primary" />
                  <Diamond className="w-4 h-4 text-primary" />
                  <div className="w-8 h-[1px] bg-primary/40" />
                </div>

                <p className="text-muted-foreground leading-8 text-base md:text-lg mb-6">
                  Our brand was born in 1990, but its roots run far deeper.
                  Jewellery has always been more than a business — it is a
                  legacy passed down through generations, carrying stories of
                  love, celebration, and timeless elegance.
                </p>

                <p className="text-muted-foreground leading-8 text-base md:text-lg">
                  Today, we blend heritage craftsmanship with contemporary
                  elegance, continuing a legacy built on integrity while
                  evolving with changing times. What began as a family
                  tradition is now a trusted name creating jewellery that
                  celebrates generations of love, milestones, and timeless
                  beauty.
                </p>

                <div className="mt-9 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      Crafted With Love
                    </p>
                    <p className="text-sm text-muted-foreground">
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
                className="relative min-h-[500px] md:min-h-[600px]"
              >
                {/* Decorative border */}

                <div className="absolute top-0 right-0 w-[78%] h-[85%] border border-primary/30 rounded-[2rem]" />

                {/* Main Image */}

                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-5 left-0 w-[68%] h-[75%] rounded-[1.5rem] overflow-hidden shadow-2xl"
                >
                  <img
                    src={aboutStoryImage}
                    alt="Our Jewellery Legacy"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Second Image */}

                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-0 right-0 w-[58%] h-[58%] rounded-[1.5rem] overflow-hidden shadow-2xl border-8 border-white"
                >
                  <img
                    src={aboutStoryImage2}
                    alt="Our Jewellery Craftsmanship"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Floating Badge */}

                <div className="absolute bottom-[8%] left-[5%] z-20">
                  <div className="w-24 h-24 rounded-full bg-primary text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                    <span className="font-display text-2xl">
                      36+
                    </span>

                    <span className="text-[9px] uppercase tracking-widest">
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

        <section className="relative py-16 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full border-[40px] border-white" />
            <div className="absolute -bottom-40 right-20 w-96 h-96 rounded-full border-[50px] border-white" />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-8">

              <CounterItem
                end={36}
                suffix="+"
                label="Years of Experience"
                icon={<Clock className="w-5 h-5" />}
              />

              <CounterItem
                end={1990}
                label="Established Since"
                icon={<Calendar className="w-5 h-5" />}
              />

              <CounterItem
                end={50000}
                suffix="+"
                label="Happy Customers"
                icon={<Users className="w-5 h-5" />}
              />

              <CounterItem
                end={100}
                suffix="+"
                label="Custom Designs"
                icon={<Diamond className="w-5 h-5" />}
              />

            </div>
          </div>
        </section>


        {/* =====================================================
            FOUNDATION
        ====================================================== */}

        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs tracking-[0.18em] uppercase">
                <img
                  src={exploreIcon}
                  alt=""
                  className="w-5 h-5 object-contain"
                />
                Our Foundation
              </span>

              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-6">
                Built on
                <span className="text-primary italic"> Trust & Craftsmanship</span>
              </h2>

              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="w-14 h-[1px] bg-primary" />
                <Diamond className="w-4 h-4 text-primary" />
                <div className="w-14 h-[1px] bg-primary" />
              </div>

              <p className="text-muted-foreground mt-6 leading-7">
                Every creation reflects our commitment to timeless design,
                exceptional craftsmanship and relationships built over generations.
              </p>
            </motion.div>


            <div className="grid md:grid-cols-2 gap-7">

              {/* VISION */}

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group relative p-8 md:p-10 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.05] to-white shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-primary/[0.05] group-hover:scale-150 transition-transform duration-700" />

                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-7 shadow-lg">
                    <Eye className="w-7 h-7 text-white" />
                  </div>

                  <p className="text-primary text-xs tracking-[0.2em] uppercase mb-2">
                    What We Believe
                  </p>

                  <h3 className="font-display text-3xl mb-5">
                    Our Vision
                  </h3>

                  <p className="text-muted-foreground leading-8">
                    To become a timeless symbol of trust, elegance, and
                    craftsmanship in the world of fine jewellery enriching
                    lives with precious creations that celebrate beauty,
                    heritage, and prosperity.
                  </p>
                </div>
              </motion.div>


              {/* MISSION */}

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group relative p-8 md:p-10 rounded-2xl bg-primary text-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full border-[30px] border-white/10 group-hover:scale-125 transition-transform duration-700" />

                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-7 shadow-lg">
                    <Target className="w-7 h-7 text-primary" />
                  </div>

                  <p className="text-white/60 text-xs tracking-[0.2em] uppercase mb-2">
                    What Drives Us
                  </p>

                  <h3 className="font-display text-3xl mb-5">
                    Our Mission
                  </h3>

                  <p className="text-white/80 leading-8">
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

        <section className="relative py-20 md:py-28 bg-[#faf9f7] overflow-hidden">

          {/* Background Decoration */}

          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-3xl" />

          <div className="container mx-auto px-4 relative">

            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">

              {/* FOUNDER IMAGE */}

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative max-w-md mx-auto lg:max-w-none w-full"
              >

                {/* Gold Frame */}

                <div className="absolute -inset-4 border border-primary/30 rounded-[2rem]" />

                <div className="absolute -inset-8 border border-primary/10 rounded-[2.5rem]" />

                <div className="relative rounded-[1.5rem] overflow-hidden bg-white shadow-2xl">

                  <img
                    src={founderImage}
                    alt="Hasmukh Ramesh Solanki - Founder"
                    className="w-full aspect-[4/5] object-cover"
                  />

                  {/* Image Overlay */}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent h-1/3" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-xs tracking-[0.25em] uppercase text-white/70 mb-1">
                      Founder
                    </p>

                    <h3 className="font-display text-2xl">
                      Hasmukh Ramesh Solanki
                    </h3>
                  </div>

                </div>

                {/* Floating Diamond */}

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
                  className="absolute -right-5 top-10 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#faf9f7]"
                >
                  <Diamond className="w-6 h-6" />
                </motion.div>

              </motion.div>


              {/* FOUNDER CONTENT */}

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >

                <span className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs tracking-[0.2em] uppercase">
                  <Sparkles className="w-4 h-4" />
                  The Founder
                </span>

                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-6 leading-tight">
                  A Vision Built on
                  <span className="block text-primary italic">
                    Trust & Purity
                  </span>
                </h2>

                <div className="flex items-center gap-3 my-7">
                  <div className="w-20 h-[1px] bg-primary" />
                  <Diamond className="w-4 h-4 text-primary" />
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                  Hasmukh Ramesh Solanki
                </h3>

                <p className="text-primary text-sm tracking-[0.2em] uppercase mb-7">
                  Founder & Visionary
                </p>

                <div className="relative">
                  <Quote className="absolute -left-2 -top-3 w-10 h-10 text-primary/10" />

                  <p className="text-muted-foreground text-base md:text-lg leading-8 mb-6 pl-6">
                    With over 36 years of experience in the jewellery industry,
                    he carries a vision of delivering purity, craftsmanship,
                    and trust.
                  </p>
                </div>

                <p className="text-muted-foreground text-base md:text-lg leading-8">
                  Born into a jewellery legacy, he officially established the
                  brand in 1990 to preserve family values of trust and purity,
                  while introducing modern innovation and refined customer
                  experience.
                </p>


                {/* Expertise */}

                <div className="grid sm:grid-cols-2 gap-4 mt-9">

                  <div className="p-5 bg-white rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-shadow">
                    <Gem className="w-6 h-6 text-primary mb-3" />

                    <h4 className="font-semibold mb-1">
                      Diamond Selection
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      Curated with precision and expertise.
                    </p>
                  </div>


                  <div className="p-5 bg-white rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-shadow">
                    <Sparkles className="w-6 h-6 text-primary mb-3" />

                    <h4 className="font-semibold mb-1">
                      Precious Stones
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      Expertise in fine gemstones.
                    </p>
                  </div>


                  <div className="p-5 bg-white rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-shadow">
                    <Target className="w-6 h-6 text-primary mb-3" />

                    <h4 className="font-semibold mb-1">
                      Custom Jewellery
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      Designs created around your story.
                    </p>
                  </div>


                  <div className="p-5 bg-white rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-shadow">
                    <Shield className="w-6 h-6 text-primary mb-3" />

                    <h4 className="font-semibold mb-1">
                      Purity & Trust
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      Values carried across generations.
                    </p>
                  </div>

                </div>

              </motion.div>

            </div>
          </div>
        </section>


        {/* =====================================================
            VALUES SECTION
        ====================================================== */}

        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-primary text-xs tracking-[0.25em] uppercase">
                What Defines Us
              </span>

              <h2 className="font-display text-4xl md:text-5xl mt-4">
                Our Core Values
              </h2>

              <div className="flex items-center justify-center gap-3 mt-5">
                <div className="w-14 h-[1px] bg-primary" />
                <Diamond className="w-4 h-4 text-primary" />
                <div className="w-14 h-[1px] bg-primary" />
              </div>
            </motion.div>


            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {[
                {
                  icon: <Heart />,
                  title: "Purity",
                  text: "Every creation reflects our commitment to authenticity and quality.",
                },
                {
                  icon: <Shield />,
                  title: "Trust",
                  text: "Relationships built through transparency, honesty and generations of trust.",
                },
                {
                  icon: <Gem />,
                  title: "Craftsmanship",
                  text: "Exceptional detailing and skilled craftsmanship in every creation.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group p-8 rounded-2xl border border-primary/10 bg-white hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>

                  <h3 className="font-display text-2xl mb-3">
                    {item.title}
                  </h3>

                  <p className="text-muted-foreground leading-7">
                    {item.text}
                  </p>

                  <div className="flex items-center gap-2 mt-6 text-primary text-sm">
                    <span>Discover more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
        </section>


        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="relative py-20 bg-primary overflow-hidden">

          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-80 h-80 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="container mx-auto px-4 relative text-center">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >

              <Diamond className="w-8 h-8 text-white/80 mx-auto mb-5" />

              <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
                Jewellery That Carries Your Story
              </h2>

              <p className="text-white/70 leading-7 max-w-2xl mx-auto mb-8">
                From timeless classics to contemporary creations,
                discover jewellery crafted with generations of trust,
                passion and precision.
              </p>

              <motion.a
                href="/collections"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 bg-white text-primary px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide shadow-xl hover:shadow-2xl transition-all"
              >
                Explore Our Collection
                <ArrowRight className="w-4 h-4" />
              </motion.a>

            </motion.div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;