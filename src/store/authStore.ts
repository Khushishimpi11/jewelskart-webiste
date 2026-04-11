import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

const API_BASE_URL = "http://localhost:5000/api";

export interface User {
  id: string;
  customerId?: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;  // ✅ ADD THIS
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/customer/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            toast.error(data.message || 'Login failed');
            set({ isLoading: false });
            return false;
          }

          console.log('🔍 Login response:', data);

          const user: User = {
            id: data.user.id,
            customerId: data.user.customerId,
            email: data.user.email,
            firstName: data.user.name?.split(' ')[0] || '',
            lastName: data.user.name?.split(' ')[1] || '',
            name: data.user.name,
            phone: data.user.phone,
          };

          localStorage.setItem('customer_token', data.token);
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Login successful!');
          console.log('✅ Customer ID from backend:', user.customerId);
          console.log('✅ Full user object:', user);
          return true;
        } catch (error) {
          console.error('Login error:', error);
          toast.error('Network error. Please try again.');
          set({ isLoading: false });
          return false;
        }
      },

      register: async (email: string, password: string, firstName: string, lastName: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/customer/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: `${firstName} ${lastName}`.trim(),
              email,
              password,
              phone: '',
              address: {
                street: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
              }
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            toast.error(data.message || 'Registration failed');
            set({ isLoading: false });
            return false;
          }

          console.log('🔍 Register response:', data);

          const user: User = {
            id: data.user.id,
            customerId: data.user.customerId,
            email: data.user.email,
            firstName: firstName,
            lastName: lastName,
            name: data.user.name,
            phone: data.user.phone,
          };

          localStorage.setItem('customer_token', data.token);
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Account created successfully!');
          console.log('✅ Customer ID from backend:', user.customerId);
          console.log('✅ Full user object:', user);
          return true;
        } catch (error) {
          console.error('Register error:', error);
          toast.error('Network error. Please try again.');
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_storage');
        set({ user: null, isAuthenticated: false, isLoading: false });
        toast.success('Logged out successfully');
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data } });
          toast.success('Profile updated successfully');
        }
      },

      // ✅ Add refreshUser function to fetch latest user data
      refreshUser: async () => {
        const token = localStorage.getItem('customer_token');
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok && data.user) {
            const currentUser = get().user;
            if (currentUser) {
              const updatedUser: User = {
                ...currentUser,
                customerId: data.user.customerId || currentUser.customerId,
                name: data.user.name || currentUser.name,
                phone: data.user.phone || currentUser.phone,
              };
              set({ user: updatedUser });
              console.log('🔄 User refreshed:', updatedUser);
            }
          }
        } catch (error) {
          console.error('Refresh user error:', error);
        }
      },
    }),
    {
      name: 'customer_storage',
      getStorage: () => localStorage,
    }
  )
);