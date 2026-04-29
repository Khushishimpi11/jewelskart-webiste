import { create } from 'zustand';
import { toast } from 'sonner';

const API_BASE_URL = "http://localhost:5000/api";

export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    sku?: string;
  };
  quantity: number;
  size?: string;  // ✅ ADDED - For ring size
  selectedSize?: string;  // ✅ ADDED - For ring size
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  productName?: string;
  productId?: string;
  productSku?: string;
  total?: number;
  size?: string;  // ✅ ADDED - For ring size
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  street?: string;
  pincode?: string;
  phone?: string;
}

export interface TrackingData {
  _id: string;
  trackingId: string;
  orderId: string;
  orderNumber: string;
  courierPartner: string;
  awbNumber: string;
  currentLocation: string;
  status: string;
  timeline: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequest {
  _id: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  reason: string;
  requestType: 'cancel' | 'return' | 'exchange';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNote?: string;
  refundAmount?: number;
  createdAt: string;
}

export interface SimpleOrder {
  id: string;
  orderNumber: string;
  trackingNumber?: string;
  trackingData?: TrackingData | null;
  date: string;
  status: string;
  total: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  estimatedDelivery: string;
}

interface OrderStore {
  orders: SimpleOrder[];
  isLoading: boolean;
  trackingData: TrackingData | null;
  isTrackingLoading: boolean;
  returnRequests: ReturnRequest[];
  
  placeOrder: (cartItems: CartItem[], shippingData: any, paymentMethod: string, total: number) => Promise<string | null>;
  getOrderById: (id: string) => SimpleOrder | undefined;
  fetchMyOrders: () => Promise<void>;
  getTrackingByTrackingId: (trackingId: string) => Promise<TrackingData | null>;
  getTrackingByOrderId: (orderId: string) => Promise<TrackingData | null>;
  resetLoading: () => void;
  clearTrackingData: () => void;
  
  createReturnRequest: (data: {
    orderId: string;
    productId?: string | null;
    productName: string;
    quantity: number;
    price?: number;
    reason: string;
    description?: string;
    requestType: 'cancel' | 'return' | 'exchange';
    images?: string[];
    video?: string | null;
    refundDetails?: any;
    exchangeDetails?: any;
  }) => Promise<any>;
  
  cancelOrder: (orderId: string, reason: string) => Promise<any>;
  cancelOrderImmediate: (orderId: string, reason: string) => Promise<any>;
  returnOrder: (data: any) => Promise<any>;
  exchangeOrder: (data: any) => Promise<any>;
  fetchReturnRequests: () => Promise<void>;
  updateOrderStatusLocally: (orderId: string, newStatus: string) => void;
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  orders: [],
  isLoading: false,
  trackingData: null,
  isTrackingLoading: false,
  returnRequests: [],

  resetLoading: () => {
    set({ isLoading: false });
  },

  clearTrackingData: () => {
    set({ trackingData: null });
  },

  getTrackingByOrderId: async (orderId: string) => {
    const token = localStorage.getItem('customer_token') || localStorage.getItem('admin_token');
    
    if (!token) {
      return null;
    }

    set({ isTrackingLoading: true });

    try {
      const response = await fetch(`${API_BASE_URL}/orders/tracking/order/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        set({ trackingData: data.tracking, isTrackingLoading: false });
        return data.tracking;
      } else {
        set({ trackingData: null, isTrackingLoading: false });
        return null;
      }
    } catch (error: any) {
      console.error('Get tracking error:', error);
      set({ trackingData: null, isTrackingLoading: false });
      return null;
    }
  },

  getTrackingByTrackingId: async (trackingId: string) => {
    const token = localStorage.getItem('customer_token') || localStorage.getItem('admin_token');
    
    if (!token) {
      toast.error('Please login to track order');
      return null;
    }

    set({ isTrackingLoading: true });

    try {
      const response = await fetch(`${API_BASE_URL}/orders/tracking/${trackingId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        set({ trackingData: data.tracking, isTrackingLoading: false });
        return data.tracking;
      } else {
        set({ trackingData: null, isTrackingLoading: false });
        return null;
      }
    } catch (error: any) {
      console.error('Get tracking error:', error);
      set({ trackingData: null, isTrackingLoading: false });
      return null;
    }
  },

  createReturnRequest: async (data) => {
    const token = localStorage.getItem('customer_token');
    
    if (!token) {
      toast.error('Please login');
      return null;
    }

    const requestBody: any = {
      orderId: data.orderId,
      productId: data.productId,
      productName: data.productName,
      quantity: data.quantity,
      price: data.price,
      reason: data.reason,
      description: data.description || '',
      requestType: data.requestType,
      images: data.images || []
    };
    
    if (data.requestType === 'return' || data.requestType === 'cancel') {
      requestBody.refundDetails = data.refundDetails || { method: 'original' };
    }
    
    if (data.requestType === 'exchange' && data.exchangeDetails) {
      requestBody.exchangeDetails = {
        exchangeProductId: data.exchangeDetails.exchangeProductId,
        exchangeProductName: data.exchangeDetails.exchangeProductName,
        exchangeProductPrice: data.exchangeDetails.exchangeProductPrice,
        differencePaymentMethod: data.exchangeDetails.differencePaymentMethod,
        differencePaymentDetails: data.exchangeDetails.differencePaymentDetails
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/returns/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        await get().fetchReturnRequests();
        
        if (data.requestType === 'cancel') {
          get().updateOrderStatusLocally(data.orderId, 'Cancelled');
          await get().fetchMyOrders();
        }
        
        return result.request;
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error: any) {
      console.error('Return request error:', error);
      toast.error(error.message || 'Something went wrong');
      return null;
    }
  },

  cancelOrder: async (orderId, reason) => {
    return await get().createReturnRequest({
      orderId,
      productId: null,
      productName: "Full Order",
      quantity: 1,
      reason,
      description: "Order cancellation request",
      requestType: "cancel",
      images: []
    });
  },

  cancelOrderImmediate: async (orderId, reason) => {
    get().updateOrderStatusLocally(orderId, 'Cancelled');
    toast.success('Order cancelled successfully!');
    return await get().cancelOrder(orderId, reason);
  },

  returnOrder: async (data) => {
    return await get().createReturnRequest({
      ...data,
      requestType: "return"
    });
  },

  exchangeOrder: async (data) => {
    return await get().createReturnRequest({
      ...data,
      requestType: "exchange"
    });
  },

  updateOrderStatusLocally: (orderId, newStatus) => {
    set((state) => ({
      orders: state.orders.map(order =>
        order.id === orderId || order.orderNumber === orderId
          ? { ...order, status: newStatus }
          : order
      )
    }));
  },

  fetchReturnRequests: async () => {
    const token = localStorage.getItem('customer_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/returns/my-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        set({ returnRequests: data.requests });
      }
    } catch (error) {
      console.error('Error fetching return requests:', error);
    }
  },

  placeOrder: async (cartItems, shippingData, paymentMethod, total) => {
    set({ isLoading: true });
    
    const token = localStorage.getItem('customer_token');
    
    if (!token) {
      toast.error('Please login to place order');
      set({ isLoading: false });
      return null;
    }

    let userData = null;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        userData = JSON.parse(userStr);
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }

    try {
      // ✅ Get size from cart item
      const orderItems = cartItems.map(item => {
        const itemSize = item.size || item.selectedSize || '';
        console.log(`📦 Cart item: ${item.product.name}, Size: "${itemSize}"`);
        
        return {
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          productName: item.product.name,
          productSku: item.product.sku || '',
          productImage: item.product.image || '',
          size: itemSize  // ✅ Send size to backend
        };
      });

      const orderData = {
        items: orderItems,
        shippingAddress: {
          street: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.zip,
          country: 'India',
        },
        paymentMethod: paymentMethod === 'cod' ? 'COD' : paymentMethod.toUpperCase(),
        customerPhone: shippingData.phone || '',
        notes: '',
        customerId: userData?.id || userData?._id,
        userId: userData?.id || userData?._id,
        customerName: userData?.name || `${shippingData.firstName} ${shippingData.lastName}`,
        customerEmail: userData?.email || shippingData.email,
      };

      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Order failed');
      }

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      
      const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const trackingId = data.tracking?.trackingId || data.order?.trackingNumber || '';

      // ✅ Store size in local order
      const newOrder: SimpleOrder = {
        id: data.order?._id || data.order?.id,
        orderNumber: data.order?.orderNumber,
        trackingNumber: trackingId,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        status: data.order?.orderStatus || 'Confirmed',
        total: total || 0,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: shippingData.phone,
        items: cartItems.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image,
          productId: item.product.id,
          productSku: item.product.sku,
          size: item.size || item.selectedSize || '',  // ✅ Store size
          total: item.product.price * item.quantity,
        })),
        shippingAddress: {
          firstName: shippingData.firstName || '',
          lastName: shippingData.lastName || '',
          address: shippingData.address || '',
          city: shippingData.city || '',
          state: shippingData.state || '',
          zip: shippingData.zip || '',
        },
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase(),
        estimatedDelivery: formattedDeliveryDate,
      };

      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false
      }));
      
      toast.success(`Order confirmed! Order ID: ${data.order?.orderNumber}`);
      
      return data.order?._id || data.order?.id;
      
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || 'Failed to place order');
      set({ isLoading: false });
      return null;
    }
  },

  getOrderById: (id) => {
    const { orders } = get();
    return orders.find(order => 
      order.id === id || 
      order.orderNumber === id ||
      order.orderNumber?.includes(id) ||
      id?.includes(order.orderNumber)
    );
  },

  fetchMyOrders: async () => {
    const token = localStorage.getItem('customer_token');
    
    if (!token) {
      console.log('No token found');
      return;
    }

    set({ isLoading: true });
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok && data.orders && data.orders.length > 0) {
        const formattedOrders: SimpleOrder[] = data.orders.map((order: any) => ({
          id: order._id,
          orderNumber: order.orderNumber,
          trackingNumber: order.trackingNumber || '',
          date: new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          status: order.orderStatus || 'Confirmed',
          total: Number(order.totalAmount) || Number(order.total) || 0,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          items: (order.items || []).map((item: any) => ({
            name: item.productName || item.name || 'Product',
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
            image: item.productImage || item.image || '/placeholder-image.jpg',
            productId: item.productId,
            productSku: item.productSku,
            size: item.size || '',  // ✅ Get size from backend
            total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
          })),
          shippingAddress: {
            firstName: order.shippingAddress?.firstName || order.customerName?.split(' ')[0] || '',
            lastName: order.shippingAddress?.lastName || order.customerName?.split(' ')[1] || '',
            address: order.shippingAddress?.street || order.shippingAddress?.address || '',
            city: order.shippingAddress?.city || '',
            state: order.shippingAddress?.state || '',
            zip: order.shippingAddress?.pincode || order.shippingAddress?.zip || '',
            street: order.shippingAddress?.street,
            pincode: order.shippingAddress?.pincode,
          },
          paymentMethod: order.paymentMethod || 'COD',
          estimatedDelivery: order.estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        }));
        
        set({ orders: formattedOrders, isLoading: false });
      } else {
        set({ orders: [], isLoading: false });
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      set({ isLoading: false });
    }
  },
}));