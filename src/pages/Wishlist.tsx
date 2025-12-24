import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-32">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <h1 className="font-display text-3xl text-foreground mb-8">My Wishlist</h1>
          
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
              <Link to="/shop" className="btn-gold">Discover Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <motion.div key={product.id} className="bg-card border border-border/30 rounded-sm overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full aspect-product object-cover" />
                  <div className="p-4">
                    <h3 className="font-display text-lg text-foreground">{product.name}</h3>
                    <p className="text-primary">${product.price.toLocaleString()}</p>
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
