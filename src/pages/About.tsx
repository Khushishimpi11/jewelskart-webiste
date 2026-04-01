import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InnerPageBanner } from "@/components/InnerPageBanner";
import { ArrowRight, Eye, Target, Gem, Sparkles, Users, Calendar, Diamond, Heart, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import exploreIcon from '../assets/logoicon.png';
import aboutStoryImage from '../assets/about-banner.jpg';
import aboutModel from '@/assets/about-model.jpg';
import aboutDetail from '@/assets/about-earring-detail.jpg';

const CounterItem = ({ end, label, suffix = "", icon }: { end: number; label: string; suffix?: string; icon: React.ReactNode }) => (
  <div className="text-center group">
    <div className="text-primary mb-3 flex justify-center">
      <div className="p-3 bg-white rounded-full group-hover:scale-110 transition-all duration-300">{icon}</div>
    </div>
    <h3 className="text-4xl md:text-5xl font-display text-white mb-3 transition-transform duration-300 group-hover:scale-110">{end}{suffix}</h3>
    <p className="text-white/80 uppercase tracking-[0.2em] text-sm">{label}</p>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner title="About Us" subtitle="Our Legacy" breadcrumbs={[{ label: "Home", path: "/" }, { label: "About Us" }]} />

        {/* Hero About Section - matching reference layout */}
        <section className="py-20 sm:py-28 relative overflow-hidden" style={{ backgroundColor: '#FBF5F6' }}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Large model image with arch + circular overlay */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative flex justify-center"
              >
                <div className="relative w-full max-w-[420px]">
                  <div className="absolute inset-0 rounded-t-[50%] border-2 translate-x-3 translate-y-3 z-0" style={{ borderColor: 'hsl(36, 60%, 55%)' }} />
                  <div className="relative rounded-t-[50%] overflow-hidden aspect-[3/4] z-10">
                    <img src={aboutModel} alt="Jewelskart craftsmanship" className="w-full h-full object-cover" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-8 right-[-30px] w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl z-20"
                  >
                    <img src={aboutDetail} alt="Detail" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Right: Content */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="inline-flex items-center text-primary font-body text-xs tracking-[0.3em] uppercase mb-4">
                  <img src={exploreIcon} alt="Icon" className="w-5 h-5 mr-2" />
                  About Us
                </span>

                <h2 className="font-display text-3xl md:text-5xl text-foreground leading-[1.1] mb-6">
                  Celebrate Life's Moments With Exquisite Jewelry
                </h2>

                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Our brand was born in 1990, but its roots run far deeper. Jewellery has always been more than a business for our family — it is a legacy passed down through generations, carrying stories of love, celebration, and timeless elegance.
                </p>

                <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                  Today, we blend heritage craftsmanship with contemporary elegance, continuing a legacy built on integrity while evolving with changing times.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-[#f5ebe0] px-4 py-5 text-center border border-border/10">
                    <span className="block font-display text-3xl text-foreground mb-1">20+</span>
                    <span className="text-muted-foreground text-xs">Worldwide Branch</span>
                  </div>
                  <div className="bg-[#f5ebe0] px-4 py-5 text-center border border-border/10">
                    <span className="block font-display text-3xl text-foreground mb-1">300+</span>
                    <span className="text-muted-foreground text-xs">Unique Designs</span>
                  </div>
                  <div className="bg-[#f5ebe0] px-4 py-5 text-center border border-border/10">
                    <span className="block font-display text-3xl text-foreground mb-1">2K</span>
                    <span className="text-muted-foreground text-xs">User Reviews</span>
                  </div>
                </div>

                <Link to="/shop" className="inline-flex items-center gap-3 bg-foreground text-white px-8 py-4 font-body text-sm tracking-wider uppercase hover:bg-primary transition-all duration-300 group">
                  Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <CounterItem end={36} label="Years of Experience" suffix="+" icon={<Clock className="w-6 h-6 text-primary" />} />
              <CounterItem end={1990} label="Established Since" icon={<Calendar className="w-6 h-6 text-primary" />} />
              <CounterItem end={50000} label="Happy Customers" suffix="+" icon={<Users className="w-6 h-6 text-primary" />} />
              <CounterItem end={100} label="Custom Designs" suffix="+" icon={<Diamond className="w-6 h-6 text-primary" />} />
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <span className="inline-flex items-center bg-primary text-white px-4 py-1 font-body text-sm tracking-luxury uppercase rounded-full">
                <img src={exploreIcon} alt="Foundation" className="w-6 h-6 mr-2" />
                Our Foundation
              </span>
              <h2 className="font-display text-3xl md:text-5xl mt-6">Built on Trust & Craftsmanship</h2>
              <div className="w-24 h-[2px] bg-primary mx-auto mt-6"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-10">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-10 border-2 border-primary shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-primary rounded-full"><Eye className="w-8 h-8 text-white" /></div>
                  <h3 className="text-2xl font-display text-primary">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">To become a timeless symbol of trust, elegance, and craftsmanship in the world of fine jewellery enriching lives with precious creations that celebrate beauty, heritage, and prosperity.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-10 border-2 border-primary shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-primary rounded-full"><Target className="w-8 h-8 text-white" /></div>
                  <h3 className="text-2xl font-display text-primary">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">To passionately craft and curate exceptional jewellery using the finest precious stones and diamonds, while upholding integrity, quality, and customer satisfaction built over generations since 1990.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-24 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="inline-flex items-center bg-primary text-white px-4 py-1 font-body text-sm tracking-luxury uppercase rounded-full">
                  <img src={exploreIcon} alt="Founder" className="w-6 h-6 mr-2" />
                  Founder
                </span>
                <h2 className="font-bold text-3xl md:text-5xl mt-4 mb-6">Hasmukh Ramesh Solanki</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">With over 36 years of experience in the jewellery industry, he carries a vision of delivering purity, craftsmanship, and trust.</p>
                <p className="text-muted-foreground leading-relaxed text-lg">Born into a jewellery legacy, he officially established the brand in 1990 to preserve family values of trust and purity, while introducing modern innovation and refined customer experience.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-10 border border-primary/20 shadow-lg">
                <h4 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2"><Diamond className="w-5 h-5" /> Expertise & Specialisation</h4>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2"><Gem className="w-4 h-4 text-primary" /> Diamond Selection</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Precious Stones (Gemmology)</li>
                  <li className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Custom Jewellery Design</li>
                </ul>
                <h4 className="text-2xl font-bold text-primary mt-10 mb-6 flex items-center gap-2"><Shield className="w-5 h-5" /> Business Philosophy</h4>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /> Commitment to Purity & Authenticity</li>
                  <li className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> Transparent Pricing</li>
                  <li className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Customer Relationships Built Over Generations</li>
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
