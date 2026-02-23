import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { CategorySection } from '@/components/sections/CategorySection';
import { BestSellersSection } from '@/components/sections/BestSellersSection';
import { PromoBanner } from '@/components/sections/PromoBanner';
import { FeaturedSection } from '@/components/sections/FeaturedSection';
import { SpecialProducts } from '@/components/sections/SpecialProducts';
import { AboutSection } from '@/components/sections/AboutSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import GlamorousLifeMarquee from '@/components/sections/GlamorousLifeMarquee';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
      <GlamorousLifeMarquee/>
        <CategorySection />
        <BestSellersSection />
        <PromoBanner />
        <FeaturedSection />
        <MarqueeSection />
        <SpecialProducts />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
