import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  originalPrice?: number;
  selectedSize?: string;  // ✅ Size field for ring products
  stock?: number;
  isRingProduct?: boolean;  // ✅ Check if product is ring
  availableSizes?: string[];  // ✅ Available sizes for ring
  sku?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: WishlistItem, selectedSize?: string) => void;
  removeItem: (productId: string) => void;
  updateItemSize: (productId: string, selectedSize: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemSize: (productId: string) => string | undefined;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, selectedSize) => {
        const existingItem = get().items.find(item => item.id === product.id);
        
        if (existingItem) {
          toast.success(`${product.name} is already in wishlist`);
          return;
        }
        
        set((state) => ({
          items: [...state.items, { 
            ...product, 
            selectedSize: selectedSize || product.selectedSize 
          }],
        }));
        
        if (selectedSize && selectedSize !== 'Free Size') {
          toast.success(`${product.name} (Size ${selectedSize}) added to wishlist`);
        } else {
          toast.success(`${product.name} added to wishlist`);
        }
      },

      removeItem: (productId) => {
        const product = get().items.find(item => item.id === productId);
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
        if (product) {
          toast.success(`${product.name} removed from wishlist`);
        }
      },

      updateItemSize: (productId, selectedSize) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, selectedSize } : item
          ),
        }));
        toast.success(`Size updated to ${selectedSize}`);
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
        toast.success('Wishlist cleared');
      },

      getItemSize: (productId) => {
        const item = get().items.find(item => item.id === productId);
        return item?.selectedSize;
      },
    }),
    {
      name: 'customer_wishlist',
      getStorage: () => localStorage,
    }
  )
);