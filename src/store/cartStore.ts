import { create } from 'zustand';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (product, size) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += 1;
        return { items: newItems };
      }
      
      return { items: [...state.items, { product, quantity: 1, size }] };
    });
  },
  
  removeItem: (productId, size) => {
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.product.id === productId && item.size === size)
      ),
    }));
  },
  
  updateQuantity: (productId, quantity, size) => {
    if (quantity <= 0) {
      get().removeItem(productId, size);
      return;
    }
    
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ),
    }));
  },
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },
  
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
