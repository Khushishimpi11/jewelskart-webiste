import { useEffect, useState } from 'react';
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
import ComingSoonSection from '@/components/ComingSoonSection';

// import { PartnerSection } from '@/components/sections/PartnerSection';

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();

        let productsArray = [];
        if (data.products && Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (Array.isArray(data)) {
          productsArray = data;
        }

        // Normalize products (same helper as in Shop.tsx to resolve images etc.)
        const normalized = productsArray
          .filter((p: any) => p.status === "Published")
          .map((p: any) => {
            const images: string[] = [];
            if (p.mainImage?.url) images.push(p.mainImage.url);
            if (p.galleryImages) {
              p.galleryImages.forEach((img: any) => {
                if (img.url) images.push(img.url);
              });
            }
            if (p.images && p.images.length > 0) {
              images.push(...p.images);
            }
            const uniqueImages = [...new Set(images)];

            return {
              ...p,
              id: p._id || p.id,
              price: Number(p.price),
              purchasePrice: Number(p.purchasePrice),
              images: uniqueImages.length > 0 ? uniqueImages : ['/placeholder-image.jpg'],
              image: uniqueImages[0] || '/placeholder-image.jpg', // fallback for featured display
            };
          });

        setProducts(normalized);
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const signatureProducts = products.filter(p => p.tags && p.tags.includes('signature'));
  const jewelleryProducts = products.filter(p => p.tags && p.tags.includes('jewellery'));
  const limitedProducts = products.filter(p => p.tags && p.tags.includes('limited-edition'));
  const bestsellerProducts = products.filter(p => p.tags && p.tags.includes('bestseller'));
  const premiumProducts = products.filter(p => p.tags && p.tags.includes('premium-pick'));

  return (
    <>
      <ComingSoonSection />
      {/* 
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <Banner />
          <FeaturedSection products={signatureProducts} isLoading={loading} />
          <JewelrySection products={jewelleryProducts} isLoading={loading} />
          <Jewellery products={limitedProducts} isLoading={loading} />
          <PromoBanner />
          <BestSellersSection products={bestsellerProducts} isLoading={loading} />
          <MarqueeSection />
          <SpecialProducts products={premiumProducts} isLoading={loading} />
          <AboutSection />
          <TestimonialSection />
        </main>
        <Footer />
      </div>
      */}
    </>
  );
};

export default Index;