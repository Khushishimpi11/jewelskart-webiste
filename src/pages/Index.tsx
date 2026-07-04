import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { BestSellersSection } from '@/components/sections/BestSellersSection';
import { PromoBanner } from '@/components/sections/PromoBanner';
import { FeaturedSection } from '@/components/sections/FeaturedSection';
import { SpecialProducts } from '@/components/sections/SpecialProducts';
import { AboutSection } from '@/components/sections/AboutSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';
// import TrustBar from '@/components/sections/TrustBar';
import Banner from '@/components/sections/Banner';
// import OfferBanners from '@/components/sections/OfferBanners';
import { JewelrySection } from '@/components/sections/JewelrySection';
import Jewellery from '@/components/sections/Jewellery';
// import { PartnerSection } from '@/components/sections/PartnerSection';

const Index = () => {
  // Add this code for auto-refresh when images are updated from admin panel
  useEffect(() => {
    const handleImageUpdate = (event: MessageEvent) => {
      if (event.data?.type === 'IMAGE_UPDATED') {
        console.log('Images updated, refreshing page...');
        window.location.reload();
      }
    };
    
    window.addEventListener('message', handleImageUpdate);
    return () => window.removeEventListener('message', handleImageUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        {/* <TrustBar /> */}
        <Banner />
         <FeaturedSection />
          <JewelrySection />
        <Jewellery />
          <PromoBanner />
        {/* <PartnerSection /> */}
        <BestSellersSection />
        <MarqueeSection />
        {/* <OfferBanners /> */}
        <SpecialProducts />
        <AboutSection />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;