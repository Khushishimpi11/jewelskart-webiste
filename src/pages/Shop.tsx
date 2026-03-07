import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { ProductCard } from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import { brands } from '@/data/brands';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const PRODUCTS_PER_PAGE = 9;
const shopCategories = ['rings', 'chains', 'pendants'];

type SortOption = 'default' | 'price-low-high' | 'price-high-low' | 'name-a-z' | 'name-z-a';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);

  const categoryFromUrl = searchParams.get('category');
  const brandFromUrl = searchParams.get('brand');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (categoryFromUrl && product.category !== categoryFromUrl) return false;
      if (brandFromUrl && (!product.brand || product.brand.toLowerCase().replace(/[^a-z0-9]/g, '') !== brandFromUrl.toLowerCase().replace(/[^a-z0-9]/g, ''))) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category))
        return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (selectedTags.length > 0 && !product.tags.some((t) => selectedTags.includes(t)))
        return false;
      return true;
    });
  }, [categoryFromUrl, brandFromUrl, selectedCategories, priceRange, selectedTags]);

  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];
    switch (sortBy) {
      case 'price-low-high': return productsToSort.sort((a, b) => a.price - b.price);
      case 'price-high-low': return productsToSort.sort((a, b) => b.price - a.price);
      case 'name-a-z': return productsToSort.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-z-a': return productsToSort.sort((a, b) => b.name.localeCompare(a.name));
      default: return productsToSort;
    }
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
    scrollToTop();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setCurrentPage(1);
    scrollToTop();
  };

  const toggleBrandExpand = (brandId: string) => {
    setExpandedBrands(prev =>
      prev.includes(brandId) ? prev.filter(b => b !== brandId) : [...prev, brandId]
    );
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const pageTitle = brandFromUrl
    ? brandFromUrl.charAt(0).toUpperCase() + brandFromUrl.slice(1)
    : categoryFromUrl
      ? categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)
      : 'Shop All';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title={pageTitle}
          subtitle="Our Collection"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: pageTitle },
          ]}
        />

        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 lg:py-12">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 mb-4 text-foreground min-h-[44px] w-full justify-between bg-card px-4 py-3 border border-border/30 rounded-sm"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                <span className="text-sm font-medium">Filters</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Filters Sidebar */}
            <AnimatePresence>
              {(showFilters || typeof window !== 'undefined') && (
                <motion.aside
                  initial={false}
                  animate={{ height: showFilters ? 'auto' : 0 }}
                  className={`lg:col-span-1 overflow-hidden lg:overflow-visible lg:!h-auto ${showFilters ? 'mb-6' : ''}`}
                >
                  <div className="bg-card p-4 sm:p-6 rounded-sm border border-border/30 sticky top-28">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display text-base lg:text-lg text-foreground">Filters</h3>
                      <button onClick={clearFilters} className="text-primary text-sm hover:underline min-h-[44px] flex items-center">
                        Clear All
                      </button>
                    </div>

                    {/* Brand → Category Hierarchy */}
                    <div className="mb-6 lg:mb-8">
                      <h4 className="font-body text-xs sm:text-sm text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
                        Categories
                      </h4>
                      <div className="space-y-1">
                        {/* Top-level: All */}
                        <a
                          href="/shop"
                          className="block py-2 text-sm font-semibold text-primary hover:underline"
                        >
                          All
                        </a>

                        {brands.map((brand) => (
                          <div key={brand.id}>
                            <button
                              onClick={() => toggleBrandExpand(brand.id)}
                              className="w-full flex items-center justify-between py-2 text-sm text-foreground hover:text-primary transition-colors"
                            >
                              <span className="font-medium">{brand.name}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedBrands.includes(brand.id) ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {expandedBrands.includes(brand.id) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  {shopCategories.map((cat) => (
                                    <a
                                      key={cat}
                                      href={`/shop?brand=${brand.slug}&category=${cat}`}
                                      className={`block py-1.5 pl-4 text-xs transition-colors ${
                                        brandFromUrl === brand.slug && categoryFromUrl === cat
                                          ? 'text-primary font-semibold'
                                          : 'text-muted-foreground hover:text-primary'
                                      }`}
                                    >
                                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </a>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6 lg:mb-8">
                      <h4 className="font-body text-xs sm:text-sm text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
                        Price Range
                      </h4>
                      <Slider
                        value={priceRange}
                        onValueChange={(val) => {
                          setPriceRange(val);
                          setCurrentPage(1);
                          scrollToTop();
                        }}
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

                    {/* Tags */}
                    <div>
                      <h4 className="font-body text-xs sm:text-sm text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
                        Tags
                      </h4>
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
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="lg:col-span-3 flex flex-col min-h-[700px] lg:min-h-[900px]">
              {/* Results Count and Sort */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Showing {paginatedProducts.length} of {sortedProducts.length} products
                </p>

                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="bg-background border border-border/50 px-3 py-2 text-sm text-foreground rounded-sm focus:outline-none focus:border-primary w-full sm:w-auto min-h-[44px]"
                >
                  <option value="default">Default sorting</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="name-a-z">Name: A to Z</option>
                  <option value="name-z-a">Name: Z to A</option>
                </select>
              </div>

              {/* Product Not Found message */}
              {sortedProducts.length === 0 ? (
                <div className="text-center py-12 lg:py-20 flex-1 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-2">Product Not Found</h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    {brandFromUrl && brandFromUrl !== 'jewelskart'
                      ? `Products for ${brandFromUrl.charAt(0).toUpperCase() + brandFromUrl.slice(1)} are coming soon. Stay tuned!`
                      : 'No products found matching your criteria.'}
                  </p>
                  <a href="/shop" className="mt-6 px-6 py-3 bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity min-h-[44px] inline-flex items-center">
                    Browse All Products
                  </a>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
                    {paginatedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 min-h-[44px] min-w-[44px] border border-border/50 flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 min-h-[44px] min-w-[44px] border flex items-center justify-center text-sm transition-colors ${
                            currentPage === page
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border/50 text-foreground hover:border-primary hover:text-primary'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 min-h-[44px] min-w-[44px] border border-border/50 flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
