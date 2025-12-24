import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, undefined);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      className="group product-card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative aspect-product overflow-hidden bg-card rounded-sm">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Sale Badge */}
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-body tracking-wider px-3 py-1">
            SALE
          </span>
        )}

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleWishlistToggle}
            className={`icon-btn ${inWishlist ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button onClick={handleAddToCart} className="icon-btn">
            <ShoppingBag className="w-4 h-4" />
          </button>
          <Link to={`/product/${product.id}`} className="icon-btn">
            <Eye className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="pt-4 space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-body text-primary font-medium">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="font-body text-muted-foreground line-through text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-2 btn-gold-outline py-2 text-xs"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
};
