import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/store/cartStore';

export interface Order {
  id: string;
  date: string;
  status: 'Order Placed' | 'Processing' | 'Shipped' | 'In Transit' | 'Delivered';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
  estimatedDelivery: string;
}

interface OrderStore {
  orders: Order[];
  placeOrder: (cartItems: CartItem[], shippingData: any, paymentMethod: string, total: number) => string;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      placeOrder: (cartItems, shippingData, paymentMethod, total) => {
        const orderId = `EV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const now = new Date();
        const delivery = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
        
        const order: Order = {
          id: orderId,
          date: now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
          status: 'Processing',
          total,
          items: cartItems.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            image: item.product.image,
          })),
          shippingAddress: {
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            zip: shippingData.zip,
          },
          paymentMethod,
          estimatedDelivery: delivery.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        };

        set((state) => ({ orders: [order, ...state.orders] }));
        return orderId;
      },
      getOrderById: (id) => {
        return get().orders.find(o => o.id === id);
      },
    }),
    { name: 'evimeria-orders' }
  )
);
