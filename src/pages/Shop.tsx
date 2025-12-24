import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categoryFromUrl = searchParams.get('category');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (categoryFromUrl && product.category !== categoryFromUrl) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category))
        return false;

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

      // Tags filter
      if (selectedTags.length > 0 && !product.tags.some((t) => selectedTags.includes(t)))
        return false;

      return true;
    });
  }, [categoryFromUrl, selectedCategories, priceRange, selectedTags]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, 10000]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 lg:pt-32">
        {/* Page Header */}
        <div className="bg-card py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-primary font-body text-sm tracking-luxury uppercase">
                Our Collection
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mt-4">
                {categoryFromUrl
                  ? categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)
                  : 'Shop All'}
              </h1>
              <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
                Explore our exquisite collection of handcrafted jewellery pieces.
              </p>
            </motion.div>
          </div>
        </div>

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
              <div className="bg-card p-6 rounded-sm border border-border/30">
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
                    onValueChange={setPriceRange}
                    min={0}
                    max={10000}
                    step={100}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0].toLocaleString()}</span>
                    <span>${priceRange[1].toLocaleString()}</span>
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
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground text-sm">
                  Showing {filteredProducts.length} products
                </p>
                {(selectedCategories.length > 0 ||
                  selectedTags.length > 0 ||
                  priceRange[0] > 0 ||
                  priceRange[1] < 10000) && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
