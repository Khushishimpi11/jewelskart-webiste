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
  material?: string;      // ✅ Gold / Rose Gold option
  ringOption?: string;    // ✅ Couple Ring option
  availableMaterials?: string[]; // ✅ Available metals
  stock?: number;
  isRingProduct?: boolean;  // ✅ Check if product is ring
  isCoupleRing?: boolean;   // ✅ Check if couple ring
  availableSizes?: string[];  // ✅ Available sizes for ring
  sku?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: WishlistItem, selectedSize?: string, selectedMaterial?: string, ringOption?: string) => void;
  removeItem: (productId: string) => void;
  updateItemSize: (productId: string, selectedSize: string) => void;
  updateItemMaterial: (productId: string, material: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemSize: (productId: string) => string | undefined;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, selectedSize, selectedMaterial, ringOption) => {
        const existingItem = get().items.find(item => item.id === product.id && item.ringOption === (ringOption || product.ringOption));

        if (existingItem) {
          toast.success(`${product.name} is already in wishlist`);
          return;
        }

        const effectiveMaterial = selectedMaterial || product.material;
        const effectiveRingOption = ringOption || product.ringOption;

        set((state) => ({
          items: [...state.items, {
            ...product,
            selectedSize: selectedSize || product.selectedSize,
            material: effectiveMaterial,
            ringOption: effectiveRingOption
          }],
        }));

        const details = [
          effectiveRingOption,
          effectiveMaterial,
          selectedSize && selectedSize !== 'Free Size' ? `Size ${selectedSize}` : null
        ].filter(Boolean).join(' • ');

        if (details) {
          toast.success(`${product.name} (${details}) added to wishlist`);
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

      updateItemMaterial: (productId, material) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, material } : item
          ),
        }));
        toast.success(`Metal updated to ${material}`);
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