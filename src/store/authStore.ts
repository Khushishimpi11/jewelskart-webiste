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
  profilePicture?: string;
  isGoogleUser?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean | string>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  googleLogin: (accessToken: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
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

          // Split name into first and last name
          const fullName = data.user.name || '';
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          const user: User = {
            id: data.user.id,
            customerId: data.user.customerId,
            email: data.user.email,
            firstName: firstName,
            lastName: lastName,
            name: data.user.name,
            phone: data.user.phone || '',
            profilePicture: data.user.profilePicture || '',
            isGoogleUser: data.user.isGoogleUser || false,
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

      register: async (email: string, password: string, name: string, phone?: string) => {
        set({ isLoading: true });
        try {
          const requestBody = {
            name: name.trim(),
            email,
            password,
            phone: phone || '',
            address: {
              street: '',
              city: '',
              state: '',
              pincode: '',
              country: 'India'
            }
          };

          console.log('📝 Registration request:', requestBody);

          const response = await fetch(`${API_BASE_URL}/auth/customer/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });

          const data = await response.json();

          if (!response.ok) {
            toast.error(data.message || 'Registration failed');
            set({ isLoading: false });
            return false;
          }

          console.log('🔍 Register response:', data);

          // Split name into first and last name
          const nameParts = name.trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          const user: User = {
            id: data.user.id,
            customerId: data.user.customerId,
            email: data.user.email,
            firstName: firstName,
            lastName: lastName,
            name: data.user.name,
            phone: data.user.phone || phone || '',
            profilePicture: data.user.profilePicture || '',
            isGoogleUser: data.user.isGoogleUser || false,
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

      googleLogin: async (accessToken: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: accessToken }),
          });

          const data = await response.json();

          console.log('🔍 RAW GOOGLE LOGIN RESPONSE:', JSON.stringify(data, null, 2));

          if (!response.ok) {
            toast.error(data.message || 'Google login failed');
            set({ isLoading: false });
            return false;
          }

          // Get name from response - check different possible field names
          let fullName = '';
          let firstName = '';
          let lastName = '';
          
          // Try to get name from different possible response structures
          if (data.user.name) {
            fullName = data.user.name;
          } else if (data.user.firstName && data.user.lastName) {
            fullName = `${data.user.firstName} ${data.user.lastName}`;
            firstName = data.user.firstName;
            lastName = data.user.lastName;
          } else if (data.user.given_name && data.user.family_name) {
            fullName = `${data.user.given_name} ${data.user.family_name}`;
            firstName = data.user.given_name;
            lastName = data.user.family_name;
          } else if (data.user.email) {
            fullName = data.user.email.split('@')[0];
          }
          
          // If first/last name not set from above, split fullName
          if (!firstName && !lastName && fullName) {
            const nameParts = fullName.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
          }

          const user: User = {
            id: data.user.id || data.user._id,
            customerId: data.user.customerId,
            email: data.user.email,
            firstName: data.user.firstName || firstName,
            lastName: data.user.lastName || lastName,
            name: data.user.name || fullName,
            phone: data.user.phone || '',
            profilePicture: data.user.profilePicture || data.user.picture || '',
            isGoogleUser: true,
          };

          console.log('✅ Processed user object:', user);

          localStorage.setItem('customer_token', data.token);
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Google login successful!');
          return true;
        } catch (error) {
          console.error('Google login error:', error);
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

      updateProfile: async (data: Partial<User>) => {
        const token = localStorage.getItem('customer_token');
        if (!token) {
          toast.error('Please login first');
          return false;
        }

        set({ isLoading: true });
        try {
          // Prepare data for backend
          const updateData: any = {};
          if (data.firstName || data.lastName) {
            updateData.name = `${data.firstName || get().user?.firstName} ${data.lastName || get().user?.lastName}`.trim();
          }
          if (data.phone !== undefined) updateData.phone = data.phone;

          const response = await fetch(`${API_BASE_URL}/auth/customer/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          });

          const result = await response.json();

          if (!response.ok) {
            toast.error(result.message || 'Failed to update profile');
            set({ isLoading: false });
            return false;
          }

          // Update local state
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              ...data,
              name: updateData.name || currentUser.name,
            };
            set({ user: updatedUser, isLoading: false });
          }
          
          toast.success('Profile updated successfully');
          return true;
        } catch (error) {
          console.error('Update profile error:', error);
          toast.error('Network error. Please try again.');
          set({ isLoading: false });
          return false;
        }
      },

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
              const fullName = data.user.name || '';
              const nameParts = fullName.split(' ');
              const firstName = nameParts[0] || '';
              const lastName = nameParts.slice(1).join(' ') || '';

              const updatedUser: User = {
                ...currentUser,
                customerId: data.user.customerId || currentUser.customerId,
                name: data.user.name || currentUser.name,
                firstName: firstName,
                lastName: lastName,
                phone: data.user.phone || currentUser.phone,
                profilePicture: data.user.profilePicture || currentUser.profilePicture,
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