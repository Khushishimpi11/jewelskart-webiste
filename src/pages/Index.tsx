import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
// import { CategorySection } from '@/components/sections/CategorySection';
import { BestSellersSection } from '@/components/sections/BestSellersSection';
import { PromoBanner } from '@/components/sections/PromoBanner';
import { FeaturedSection } from '@/components/sections/FeaturedSection';
import { SpecialProducts } from '@/components/sections/SpecialProducts';
import { AboutSection } from '@/components/sections/AboutSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
// import GlamorousLifeMarquee from '@/components/sections/GlamorousLifeMarquee';
// import TrendingBrandsSection from '@/components/sections/TrendingBrandsSection';
// import PremiumBrandsGrid from '@/components/sections/PremiumBrandsGrid';
// import CollaborationBanner from '@/components/sections/CollaborationBanner';
// import BrandTrustSection from '@/components/sections/BrandTrustSection';
import TrustBar from '@/components/sections/TrustBar';
import Banner from '@/components/sections/Banner';
import OfferBanners from '@/components/sections/OfferBanners';
import { JewelrySection } from '@/components/sections/JewelrySection';
import Jewellery from '@/components/sections/jewellery';


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustBar/>
           <Banner/>
           <Jewellery/>
              <BestSellersSection />
                     <MarqueeSection />
               <JewelrySection/>
        {/* <BrandTrustSection /> */}
        {/* <GlamorousLifeMarquee /> */}
         <PromoBanner />
            <FeaturedSection />
        {/* <TrendingBrandsSection /> */}
        {/* <CategorySection /> */}
   
        <OfferBanners/>
     
  
        {/* <PremiumBrandsGrid /> */}
        <SpecialProducts />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
