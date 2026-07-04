import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  material?: string;
  images?: string[];
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;  // ✅ Size stored here
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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, size) => {
        set((state) => {
          // Find existing item with same product AND same size
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.size === size
          );
          
          if (existingIndex >= 0) {
            // Increase quantity if exists
            const newItems = [...state.items];
            newItems[existingIndex].quantity += 1;
            if (size) {
              toast.success(`Added another ${product.name} (Size ${size}) to cart`);
            } else {
              toast.success(`Added another ${product.name} to cart`);
            }
            return { items: newItems };
          }
          
          // Add new item
          if (size) {
            toast.success(`${product.name} (Size ${size}) added to cart`);
          } else {
            toast.success(`${product.name} added to cart`);
          }
          
          return { 
            items: [...state.items, { product, quantity: 1, size }] 
          };
        });
      },
      
      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.size === size)
          ),
        }));
        toast.success('Item removed from cart');
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
      
      clearCart: () => {
        set({ items: [] });
        toast.success('Cart cleared');
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'customer_cart',
      getStorage: () => localStorage,
    }
  )
);