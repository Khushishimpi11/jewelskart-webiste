import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { ProductCard } from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const PRODUCTS_PER_PAGE = 6;

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const categoryFromUrl = searchParams.get('category');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (categoryFromUrl && product.category !== categoryFromUrl) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category))
        return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (selectedTags.length > 0 && !product.tags.some((t) => selectedTags.includes(t)))
        return false;
      return true;
    });
  }, [categoryFromUrl, selectedCategories, priceRange, selectedTags]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, 100000]);
    setCurrentPage(1);
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        <InnerPageBanner
          title={categoryFromUrl
            ? categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)
            : 'Shop All'}
          subtitle="Our Collection"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: categoryFromUrl
              ? categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)
              : 'Shop' },
          ]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 mb-6 text-foreground"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Filters Sidebar */}
            <motion.aside
              initial={false}
              animate={{ height: showFilters ? 'auto' : 0 }}
              className={`lg:col-span-1 overflow-hidden lg:overflow-visible lg:h-auto ${
                showFilters ? 'mb-8' : ''
              }`}
            >
              <div className="bg-card p-6 rounded-sm border border-border/30 sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg text-foreground">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-primary text-sm hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-body text-sm text-foreground mb-4 uppercase tracking-wider">
                    Categories
                  </h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <span className="text-muted-foreground text-sm">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="font-body text-sm text-foreground mb-4 uppercase tracking-wider">
                    Price Range
                  </h4>
                  <Slider
                    value={priceRange}
                    onValueChange={(val) => { setPriceRange(val); setCurrentPage(1); }}
                    min={0}
                    max={100000}
                    step={500}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-body text-sm text-foreground mb-4 uppercase tracking-wider">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 text-xs border transition-colors ${
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

            {/* Products Grid */}
            <div className="lg:col-span-3 min-h-[600px] flex flex-col">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground text-sm">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                </p>
                {(selectedCategories.length > 0 ||
                  selectedTags.length > 0 ||
                  priceRange[0] > 0 ||
                  priceRange[1] < 100000) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-primary text-sm"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                )}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
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

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    No products found matching your criteria.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 btn-gold-outline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 border border-border/50 flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 border flex items-center justify-center text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border/50 text-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 border border-border/50 flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
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
