import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, ShoppingBag, Loader2, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { ProductCard } from '@/components/ProductCard';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = "http://localhost:5000/api";
const PRODUCTS_PER_PAGE = 9;

type SortOption = 'default' | 'price-low-high' | 'price-high-low' | 'name-a-z' | 'name-z-a';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  purchasePrice: number;
  category: string;
  brand?: string;
  stock: number;
  description: string;
  images: string[];
  sku: string;
  tags: string[];
  status: "Published" | "Draft" | "Archived";
  goldDetails?: {
    weight: number;
    purity: string;
    makingCharge: number;
  };
  specifications?: {
    material?: string;
    finish?: string;
    hallmark?: string;
    certification?: string;
    ringSizes?: string[];
    gender?: string;
    occasion?: string;
    stoneType?: string;
    stoneWeight?: number;
    warranty?: string;
  };
  reviews?: {
    rating: number;
    count: number;
  };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  featured: boolean;
  productCount: number;
}

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryMapping, setCategoryMapping] = useState<Record<string, string>>({});

  const categoryFromUrl = searchParams.get('category');
  const brandFromUrl = searchParams.get('brand');

  // Fetch ONLY FEATURED categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      
      if (data.success && data.categories) {
        const featuredCategories = data.categories.filter(
          (cat: Category) => cat.isActive === true && cat.featured === true
        );
        setCategories(featuredCategories);
        
        const mapping: Record<string, string> = {};
        featuredCategories.forEach((cat: Category) => {
          mapping[cat.slug] = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
        });
        setCategoryMapping(mapping);
        
        console.log("⭐ Featured categories:", featuredCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const checkBackendConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://localhost:5000/api/health', {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ Backend connected');
        return true;
      }
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return false;
    }
    return false;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const isConnected = await checkBackendConnection();
      if (!isConnected) {
        toast({ 
          title: "Connection Error", 
          description: "Cannot connect to backend server. Please make sure it's running on port 5000.", 
          variant: "destructive" 
        });
        setProducts([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let productsArray = [];
      if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (Array.isArray(data)) {
        productsArray = data;
      } else {
        productsArray = [];
      }
      
      const normalizedProducts = productsArray
        .filter((p: Product) => p.status === "Published")
        .map((p: Product) => ({
          ...p,
          price: Number(p.price),
          purchasePrice: Number(p.purchasePrice),
          images: p.images && p.images.length > 0 ? p.images : ['/placeholder-image.jpg']
        }));
      
      setProducts(normalizedProducts);
      
      const tags = new Set<string>();
      normalizedProducts.forEach((p: Product) => {
        if (p.tags && Array.isArray(p.tags)) {
          p.tags.forEach((t: string) => tags.add(t));
        }
      });
      setAllTags(Array.from(tags));
     
      
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to load products. Please try again later.", 
        variant: "destructive" 
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handlePageChange = (page: number) => { 
    setCurrentPage(page); 
    scrollToTop(); 
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    if (categoryFromUrl && categoryMapping[categoryFromUrl]) {
      const categoryDisplayName = categoryMapping[categoryFromUrl];
      filtered = filtered.filter((product) => 
        product.category?.toLowerCase() === categoryDisplayName?.toLowerCase()
      );
    }
    
    if (brandFromUrl && brandFromUrl.toLowerCase() === 'jewelskart') {
      filtered = filtered.filter((product) => 
        product.brand?.toLowerCase() === 'jewelskart original'
      );
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => 
        selectedCategories.some(cat => 
          product.category?.toLowerCase() === cat.toLowerCase()
        )
      );
    }
    
    filtered = filtered.filter((product) => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) => 
        product.tags && product.tags.some((t) => selectedTags.includes(t))
      );
    }
    
    return filtered;
  }, [products, categoryFromUrl, brandFromUrl, selectedCategories, priceRange, selectedTags, categoryMapping]);

  const sortedProducts = useMemo(() => {
    const p = [...filteredProducts];
    switch (sortBy) {
      case 'price-low-high': return p.sort((a, b) => a.price - b.price);
      case 'price-high-low': return p.sort((a, b) => b.price - a.price);
      case 'name-a-z': return p.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-z-a': return p.sort((a, b) => b.name.localeCompare(a.name));
      default: return p;
    }
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const toggleTag = (tag: string) => { 
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]); 
    setCurrentPage(1); 
    scrollToTop(); 
  };

  const clearFilters = () => { 
    setSelectedCategories([]); 
    setSelectedTags([]); 
    setPriceRange([0, 100000]); 
    setSortBy('default'); 
    setCurrentPage(1); 
    scrollToTop(); 
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const getPageTitle = () => {
    if (brandFromUrl) {
      return brandFromUrl.charAt(0).toUpperCase() + brandFromUrl.slice(1);
    }
    if (categoryFromUrl && categoryMapping[categoryFromUrl]) {
      return categoryMapping[categoryFromUrl];
    }
    return 'Shop All';
  };

// ✅ FIXED: Priority to Category, then Brand
const getBreadcrumbs = () => {
  const breadcrumbs = [{ label: 'Home', path: '/' }];
  
  // ✅ Priority 1: Category (if exists)
  if (categoryFromUrl && categoryMapping[categoryFromUrl]) {
    breadcrumbs.push({ 
      label: categoryMapping[categoryFromUrl], 
      path: `/shop?category=${categoryFromUrl}` 
    });
  } 
  // ✅ Priority 2: Brand (only if no category)
  else if (brandFromUrl) {
    breadcrumbs.push({ 
      label: brandFromUrl.charAt(0).toUpperCase() + brandFromUrl.slice(1), 
      path: '/shop' 
    });
  } 
  // ✅ Priority 3: Default
  else {
    breadcrumbs.push({ label: 'Shop All', path: '/shop' });
  }
  
  return breadcrumbs;
};

  const getCategoryDisplayName = (categorySlug: string) => {
    return categoryMapping[categorySlug] || categorySlug;
  };

  if (loading || loadingCategories) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-24">
          <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-12 lg:py-20">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner 
          title={getPageTitle()} 
          subtitle="Our Collection" 
          breadcrumbs={getBreadcrumbs()} 
        />

        <section className="relative py-8 lg:py-12 overflow-hidden">
          <div className="container mx-auto px-3 sm:px-4 lg:px-8">
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className="lg:hidden flex items-center justify-between gap-2 mb-4 text-foreground min-h-[44px] w-full bg-card px-4 py-3 border border-border/30 rounded-sm"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                <span className="text-sm font-medium">Filters</span>
                {selectedTags.length > 0 && (
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {selectedTags.length}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Main Grid */}
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
              
              {/* Filters Sidebar */}
              <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'} mb-6 lg:mb-0`}>
                <div className="bg-card p-4 sm:p-6 rounded-sm border border-border/30 sticky top-28">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-base lg:text-lg text-foreground">Filters</h3>
                    <button 
                      onClick={clearFilters} 
                      className="text-primary text-sm hover:underline min-h-[44px] flex items-center"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Categories Section - ONLY FEATURED CATEGORIES */}
                  <div className="mb-6 lg:mb-8">
                    <h4 className="font-body text-xs sm:text-sm text-foreground mb-4 uppercase tracking-wider">Categories</h4>
                    <div className="space-y-2">
                      <a href="/shop" className="block py-2 text-sm font-semibold text-primary hover:underline">
                        All Products
                      </a>
                      <div className="pt-2">
                        <div className="text-sm font-medium text-foreground mb-2">
                          <span className="font-bold">JEWELS</span>
                          <span className="font-thin tracking-wider">KART</span>
                        </div>
                        <div className="space-y-1 ml-2">
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <a 
                                key={cat._id} 
                                href={`/shop?brand=jewelskart&category=${cat.slug}`}
                                className={`block py-1.5 text-sm transition-colors font-medium tracking-wide ${
                                  brandFromUrl === 'jewelskart' && categoryFromUrl === cat.slug 
                                    ? 'text-primary font-semibold' 
                                    : 'text-muted-foreground hover:text-primary'
                                }`}
                              >
                                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                              </a>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No featured categories available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Range Section */}
                  <div className="mb-6 lg:mb-8">
                    <h4 className="font-body text-xs sm:text-sm text-foreground mb-4 uppercase tracking-wider">Price Range</h4>
                    <Slider 
                      value={priceRange} 
                      onValueChange={(val) => { setPriceRange(val); setCurrentPage(1); }} 
                      min={0} 
                      max={100000} 
                      step={500} 
                      className="mb-4" 
                    />
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Tags Section */}
                  {allTags.length > 0 && (
                    <div>
                      <h4 className="font-body text-xs sm:text-sm text-foreground mb-4 uppercase tracking-wider">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <button 
                            key={tag} 
                            onClick={() => toggleTag(tag)} 
                            className={`px-3 py-1.5 text-xs border transition-colors min-h-[32px] ${
                              selectedTags.includes(tag) 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'border-border/50 text-muted-foreground hover:border-primary hover:text-primary'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                {/* Sort and Count Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Showing {paginatedProducts.length} of {sortedProducts.length} products
                  </p>
                  <select 
                    value={sortBy} 
                    onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }} 
                    className="bg-background border border-border/50 px-3 py-2 text-sm text-foreground rounded-sm focus:outline-none focus:border-primary w-full sm:w-auto min-h-[44px]"
                  >
                    <option value="default">Default sorting</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-a-z">Name: A to Z</option>
                    <option value="name-z-a">Name: Z to A</option>
                  </select>
                </div>

                {/* Products Display */}
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-12 lg:py-20 flex-1 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                      <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2">No products found</h3>
                    <p className="text-muted-foreground text-sm max-w-md">No products found matching your criteria.</p>
                    <button 
                      onClick={clearFilters}
                      className="mt-6 px-6 py-3 bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity min-h-[44px] inline-flex items-center rounded-sm"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
                      {paginatedProducts.map((product, index) => (
                        <motion.div 
                          key={product._id || product.id || `product-${index}`} 
                          initial={{ opacity: 0, y: 20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: Math.min(index * 0.05, 0.5) }}
                        >
                          <ProductCard 
                            product={{
                              id: product._id || product.id || `product-${index}`,
                              name: product.name,
                              price: Number(product.price),
                              originalPrice: Number(product.purchasePrice) || undefined,
                              image: product.images?.[0] || '/placeholder-image.jpg',
                              category: product.category,
                              sku: product.sku,
                              tags: product.tags || [],
                              rating: product.reviews?.rating || 4.5,
                              reviewCount: product.reviews?.count || 0,
                              inStock: product.stock > 0
                            }} 
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12">
                        <button 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                          disabled={currentPage === 1} 
                          className="w-10 h-10 min-h-[44px] min-w-[44px] border border-border/50 flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button 
                              key={pageNum} 
                              onClick={() => handlePageChange(pageNum)} 
                              className={`w-10 h-10 min-h-[44px] min-w-[44px] border flex items-center justify-center text-sm transition-colors rounded-sm ${
                                currentPage === pageNum 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'border-border/50 text-foreground hover:border-primary hover:text-primary'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                          disabled={currentPage === totalPages} 
                          className="w-10 h-10 min-h-[44px] min-w-[44px] border border-border/50 flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;