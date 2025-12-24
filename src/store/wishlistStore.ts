import { create } from 'zustand';
import { Product } from '@/data/products';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  
  addItem: (product) => {
    set((state) => {
      if (state.items.some((item) => item.id === product.id)) {
        return state;
      }
      return { items: [...state.items, product] };
    });
  },
  
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },
  
  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },
  
  clearWishlist: () => set({ items: [] }),
}));
