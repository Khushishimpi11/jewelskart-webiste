const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============ TYPES ============
export interface HeroSlide {
  _id: string;
  bgImage: string;
  leftModelImage: string;
  rightModelImage: string;
  brandText: string;
  title: string;
  subtitle: string;
  buttonLink: string;
  displayOrder: number;
}

export interface BannerCategory {
  _id: string;
  category: string;
  imageUrl: string;
  title: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
}

export interface OfferBanner {
  _id: string;
  imageUrl: string;
  brandText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  footerText: string;
  buttonLink: string;
  displayOrder: number;
}

export interface AboutSection {
  badgeText: string;
  title: string;
  description: string;
  stats: { branches: number; designs: number; clients: number };
  statsLabels: { branches: string; designs: string; clients: string };
  buttonText: string;
  buttonLink: string;
  bigImageUrl: string;
  smallImageUrl: string;
}

export interface PartnerSection {
  imageUrl: string;
  badgeText: string;
  title: string;
  description: string;
  benefits: string[];
  buttonText: string;
  buttonLink: string;
}

export interface PromoBanner {
  imageUrl: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface JewellerySection {
  leftImageUrl: string;
  badgeText: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface TestimonialSection {
  rightImageUrl: string;
  badgeText: string;
  title: string;
  testimonials: Array<{ name: string; location: string; text: string; avatar: string }>;
}

// ============ API FUNCTIONS ============

// Hero Slides
export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  try {
    const response = await fetch(`${API_URL}/cms/hero-slides`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
};

// Banner Categories (Shop by Category)
export const getBannerCategories = async (): Promise<BannerCategory[]> => {
  try {
    const response = await fetch(`${API_URL}/cms/banner-categories`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching banner categories:', error);
    return [];
  }
};

// Offer Banners
export const getOfferBanners = async (): Promise<OfferBanner[]> => {
  try {
    const response = await fetch(`${API_URL}/cms/offer-banners`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching offer banners:', error);
    return [];
  }
};

// About Section
export const getAboutSection = async (): Promise<AboutSection | null> => {
  try {
    const response = await fetch(`${API_URL}/cms/about-section`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching about section:', error);
    return null;
  }
};

// Partner Section
export const getPartnerSection = async (): Promise<PartnerSection | null> => {
  try {
    const response = await fetch(`${API_URL}/cms/partner-section`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching partner section:', error);
    return null;
  }
};

// Promo Banner
export const getPromoBanner = async (): Promise<PromoBanner | null> => {
  try {
    const response = await fetch(`${API_URL}/cms/promo-banner`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching promo banner:', error);
    return null;
  }
};

// Jewellery Section (Stylish Design)
export const getJewellerySection = async (): Promise<JewellerySection | null> => {
  try {
    const response = await fetch(`${API_URL}/cms/jewellery-section`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching jewellery section:', error);
    return null;
  }
};

// Testimonial Section
export const getTestimonialSection = async (): Promise<TestimonialSection | null> => {
  try {
    const response = await fetch(`${API_URL}/cms/testimonial-section`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching testimonial section:', error);
    return null;
  }
};