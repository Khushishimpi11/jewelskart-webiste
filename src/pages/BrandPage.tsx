import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import { brands } from '@/data/brands';
import { useMemo } from 'react';

const BrandPage = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();

  const brand = brands.find(b => b.slug === brandSlug);
  const brandName = brand?.name || brandSlug || '';

  // Distribute products across brands deterministically
  const brandProducts = useMemo(() => {
    const brandNames = brands.map(b => b.name);
    return products
      .map((product, index) => ({
        ...product,
        brand: product.brand || brandNames[index % brandNames.length],
      }))
      .filter(p => p.brand === brandName);
  }, [brandName]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <InnerPageBanner
        title={brandName}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Brands', href: '/' },
          { label: brandName },
        ]}
      />

      <section className="py-8 md:py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {brand && (
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              {brand.tagline} — Explore our curated collection of premium jewellery from {brandName}.
            </p>
          )}

          {brandProducts.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {brandProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-16">
              No products found for this brand. Check back soon!
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrandPage;
