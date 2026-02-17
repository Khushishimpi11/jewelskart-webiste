import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product);
    removeItem(product.id);
    toast.success('Moved to cart');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        <InnerPageBanner
          title="My Wishlist"
          subtitle="Saved Items"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]}
        />
        
        <div className="container mx-auto px-4 lg:px-8 py-12">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
              <Link to="/shop" className="btn-gold">Discover Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <motion.div key={product.id} className="bg-card border border-border/30 rounded-sm overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className="w-full aspect-product object-cover" />
                  </Link>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-foreground">{product.name}</h3>
                    <p className="text-primary">{formatPrice(product.price)}</p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleAddToCart(product)} className="flex-1 btn-gold-outline text-xs py-2 flex items-center justify-center gap-1">
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                      <button onClick={() => removeItem(product.id)} className="p-2 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
