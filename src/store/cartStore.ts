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
  ringOption?: string; // e.g. "Women’s Ring" | "Men’s Ring" | "Both Rings (Couple Set)"
  images?: string[];
  stock?: number;
  gst?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;  // ✅ Size stored here
  material?: string; // ✅ Gold / Rose Gold option stored here
  ringOption?: string; // ✅ Couple Ring option stored here
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size?: string, material?: string, ringOption?: string) => void;
  removeItem: (productId: string, size?: string, material?: string, ringOption?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, material?: string, ringOption?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, size, material, ringOption) => {
        set((state) => {
          const itemMaterial = material || product.material;
          const itemRingOption = ringOption || product.ringOption;

          // Find existing item with same product, same size, same material AND same ring option
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id &&
                      item.size === size &&
                      (item.material === itemMaterial || (!item.material && !itemMaterial)) &&
                      (item.ringOption === itemRingOption || (!item.ringOption && !itemRingOption))
          );
          
          const details = [
            itemRingOption,
            itemMaterial,
            size ? `Size ${size}` : null
          ].filter(Boolean).join(' • ');

          if (existingIndex >= 0) {
            // Increase quantity if exists
            const newItems = [...state.items];
            newItems[existingIndex].quantity += 1;
            if (details) {
              toast.success(`Added another ${product.name} (${details}) to cart`);
            } else {
              toast.success(`Added another ${product.name} to cart`);
            }
            return { items: newItems };
          }
          
          // Add new item
          if (details) {
            toast.success(`${product.name} (${details}) added to cart`);
          } else {
            toast.success(`${product.name} added to cart`);
          }
          
          return { 
            items: [...state.items, {
              product: { ...product, material: itemMaterial, ringOption: itemRingOption },
              quantity: 1,
              size,
              material: itemMaterial,
              ringOption: itemRingOption
            }] 
          };
        });
      },
      
      removeItem: (productId, size, material, ringOption) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(
              item.product.id === productId &&
              item.size === size &&
              (material === undefined || item.material === material) &&
              (ringOption === undefined || item.ringOption === ringOption)
            )
          ),
        }));
        toast.success('Item removed from cart');
      },
      
      updateQuantity: (productId, quantity, size, material, ringOption) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, material, ringOption);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            item.size === size &&
            (material === undefined || item.material === material) &&
            (ringOption === undefined || item.ringOption === ringOption)
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