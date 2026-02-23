import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InnerPageBanner } from "@/components/InnerPageBanner";
import { 
  Eye, 
  Target, 
  Award, 
  Gem, 
  Sparkles, 
  Users, 
  Calendar, 
  Diamond,
  Heart,
  Shield,
  Clock
} from "lucide-react";
import exploreIcon from '../assets/logoicon.png';
import aboutStoryImage from '../assets/about-banner.jpg'; // Yahan image import kiya

const CounterItem = ({ end, label, suffix = "", icon }: { end: number; label: string; suffix?: string; icon: React.ReactNode }) => {
  return (
    <div className="text-center group">
      <div className="text-primary mb-3 flex justify-center">
        <div className="p-3 bg-white rounded-full group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-4xl md:text-5xl font-display text-white mb-3 transition-transform duration-300 group-hover:scale-110">
        {end}{suffix}
      </h3>
      <p className="text-white/80 uppercase tracking-[0.2em] text-sm">
        {label}
      </p>
    </div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <Header />

      <main className="pt-20 lg:pt-24">

        {/* Banner Section */}
        <InnerPageBanner
          title="About Us"
          subtitle="Our Legacy"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "About Us" }]}
        />

        {/* ================= Story Section with Image ================= */}
        <section className="py-24 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
               <span className="inline-flex items-center bg-primary text-white px-4 py-1 font-body text-sm tracking-luxury uppercase rounded-full">
                  <img src={exploreIcon} alt="Limited Edition" className="w-6 h-6 mr-2" />
                  Our Journey Since 1990
                </span>

                <h2 className="font-display text-3xl md:text-5xl mt-6 mb-8">
                  A Legacy of <span className="text-primary">Trust & Beauty</span>
                </h2>

                <div className="w-24 h-[2px] bg-primary mb-12"></div>

                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  Our brand was born in 1990, but its roots run far deeper.
                  Jewellery has always been more than a business — it is a legacy
                  passed down through generations, carrying stories of love, 
                  celebration, and timeless elegance.
                </p>

                <p className="text-muted-foreground leading-relaxed text-lg">
                  Today, we blend heritage craftsmanship with contemporary elegance,
                  continuing a legacy built on integrity while evolving with changing times.
                  What began as a family tradition is now a trusted name creating jewellery
                  that celebrates generations of love, milestones, and timeless beauty.
                </p>
              </motion.div>

              {/* Right Image - Imported image use ki gayi hai */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative z-10">
                  <img 
                    src={aboutStoryImage} 
                    alt="Our Jewellery Legacy - Traditional craftsmanship"
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                  
                  {/* Overlay decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full -z-10"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-full -z-10"></div>
                </div>

                {/* Badge */}
                {/* <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl border border-primary/20">
                  <p className="text-primary font-display text-2xl font-bold">36+</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Years of Excellence</p>
                </div> */}
              </motion.div>

            </div>
          </div>
        </section>

        {/* ================= Stats Section with Primary Background ================= */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <CounterItem 
                end={36} 
                label="Years of Experience" 
                suffix="+" 
                icon={<Clock className="w-6 h-6 text-primary" />}
              />
              <CounterItem 
                end={1990} 
                label="Established Since" 
                icon={<Calendar className="w-6 h-6 text-primary" />}
              />
              <CounterItem 
                end={50000} 
                label="Happy Customers" 
                suffix="+" 
                icon={<Users className="w-6 h-6 text-primary" />}
              />
              <CounterItem 
                end={100} 
                label="Custom Designs" 
                suffix="+" 
                icon={<Diamond className="w-6 h-6 text-primary" />}
              />
            </div>
          </div>
        </section>

        {/* ================= Vision & Mission with Icons ================= */}
       <section className="py-24 bg-white">
  <div className="container mx-auto px-4">

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="inline-flex items-center bg-primary text-white px-4 py-1 font-body text-sm tracking-luxury uppercase rounded-full">
        <img src={exploreIcon} alt="Foundation" className="w-6 h-6 mr-2" />
        Our Foundation
      </span>

      <h2 className="font-display text-3xl md:text-5xl mt-6">
        Built on Trust & Craftsmanship
      </h2>

      <div className="w-24 h-[2px] bg-primary mx-auto mt-6"></div>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-10">

      {/* Vision Card */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white p-10 border-2 border-primary shadow-xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-primary rounded-full">
            <Eye className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-display text-primary">
            Our Vision
          </h3>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          To become a timeless symbol of trust, elegance, and craftsmanship
          in the world of fine jewellery enriching lives with precious
          creations that celebrate beauty, heritage, and prosperity.
        </p>
      </motion.div>

      {/* Mission Card */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white p-10 border-2 border-primary shadow-xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-primary rounded-full">
            <Target className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-display text-primary">
            Our Mission
          </h3>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          To passionately craft and curate exceptional jewellery using
          the finest precious stones and diamonds, while upholding
          integrity, quality, and customer satisfaction built over
          generations since 1990.
        </p>
      </motion.div>

    </div>
  </div>
</section>

        {/* ================= Founder Section ================= */}
        <section className="py-24 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                 <span className="inline-flex items-center bg-primary text-white px-4 py-1 font-body text-sm tracking-luxury uppercase rounded-full">
  <img src={exploreIcon} alt="Limited Edition" className="w-6 h-6 mr-2" />
                  Founder
                </span>

                <h2 className="font-bold text-3xl md:text-5xl mt-4 mb-6">
                  Hasmukh Ramesh Solanki
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-6 flex items-start gap-2 text-lg">
                  <span>With over 36 years of experience in the jewellery industry, he carries a vision of delivering purity, craftsmanship, and trust.</span>
                </p>

                <p className="text-muted-foreground leading-relaxed flex items-start gap-2 text-lg">
                  <span>Born into a jewellery legacy, he officially established the brand in 1990 to preserve family values of trust and purity, while introducing modern innovation and refined customer experience.</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-10 border border-primary/20 shadow-lg"
              >
                <h4 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Diamond className="w-5 h-5" />
                  Expertise & Specialisation
                </h4>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Gem className="w-4 h-4 text-primary" /> Diamond Selection
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Precious Stones (Gemmology)
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> Custom Jewellery Design
                  </li>
                </ul>

                <h4 className="text-2xl font-bold text-primary mt-10 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Business Philosophy
                </h4>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" /> Commitment to Purity & Authenticity
                  </li>
                  <li className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" /> Transparent Pricing
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Customer Relationships Built Over Generations
                  </li>
                </ul>
              </motion.div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;