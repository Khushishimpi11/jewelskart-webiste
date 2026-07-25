import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  checkUserExists: () => Promise<boolean>;
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
          if (!email || !password) {
            toast.error('Please enter email and password');
            set({ isLoading: false });
            return false;
          }

          const response = await fetch(`${API_BASE_URL}/auth/customer/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
          });

          const data = await response.json();

          if (!response.ok) {
            toast.error(data.message || 'Login failed');
            set({ isLoading: false });
            return false;
          }

          console.log('🔍 Login response:', data);

          if (!data.user || !data.token) {
            console.error('❌ Invalid login response structure:', data);
            toast.error('Invalid server response');
            set({ isLoading: false });
            return false;
          }

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
          localStorage.setItem('customer_user', JSON.stringify(user));

          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Login successful! Welcome back!');
          console.log('✅ Customer ID:', user.customerId);

          return true;
        } catch (error) {
          console.error('Login error:', error);
          toast.error('Network error. Please check your connection.');
          set({ isLoading: false });
          return false;
        }
      },

      register: async (email: string, password: string, name: string, phone?: string) => {
        set({ isLoading: true });
        try {
          if (!name || !email || !password) {
            toast.error('Please fill in all required fields');
            set({ isLoading: false });
            return false;
          }

          if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            set({ isLoading: false });
            return false;
          }

          const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
          if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            set({ isLoading: false });
            return false;
          }

          if (phone && !/^\d{10}$/.test(phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            set({ isLoading: false });
            return false;
          }

          const requestBody = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            phone: phone || '',
          };

          console.log('📝 Registration request:', {
            ...requestBody,
            password: '***HIDDEN***'
          });

          const response = await fetch(`${API_BASE_URL}/auth/customer/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error('❌ Registration failed:', data);

            if (data.message && data.message.includes('duplicate')) {
              toast.error('Email already registered. Please login instead.');
            } else if (data.message && data.message.includes('validation')) {
              toast.error('Invalid data provided. Please check your information.');
            } else {
              toast.error(data.message || 'Registration failed. Please try again.');
            }

            set({ isLoading: false });
            return false;
          }

          console.log('✅ Registration successful:', data);

          if (!data.user || !data.token) {
            console.error('❌ Invalid registration response:', data);
            toast.error('Invalid server response');
            set({ isLoading: false });
            return false;
          }

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
            isGoogleUser: false,
          };

          localStorage.setItem('customer_token', data.token);
          localStorage.setItem('customer_user', JSON.stringify(user));

          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Account created successfully! Welcome!');
          console.log('✅ Customer ID:', user.customerId);

          return true;

        } catch (error) {
          console.error('❌ Register network error:', error);
          toast.error('Network error. Please check your connection.');
          set({ isLoading: false });
          return false;
        }
      },

      googleLogin: async (accessToken: string) => {
        set({ isLoading: true });
        try {
          if (!accessToken) {
            toast.error('Google authentication failed');
            set({ isLoading: false });
            return false;
          }

          const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: accessToken }),
          });

          const data = await response.json();

          console.log('🔍 Google login response:', data);

          if (!response.ok) {
            toast.error(data.message || 'Google login failed');
            set({ isLoading: false });
            return false;
          }

          if (!data.user || !data.token) {
            console.error('❌ Invalid Google login response:', data);
            toast.error('Invalid server response');
            set({ isLoading: false });
            return false;
          }

          let fullName = '';
          let firstName = '';
          let lastName = '';

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

          console.log('✅ Processed Google user:', user);

          localStorage.setItem('customer_token', data.token);
          localStorage.setItem('customer_user', JSON.stringify(user));

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
        localStorage.removeItem('customer_user');

        set({ user: null, isAuthenticated: false, isLoading: false });
        toast.success('Logged out successfully');

        window.location.href = '/';
      },

      updateProfile: async (data: Partial<User>) => {
        const token = localStorage.getItem('customer_token');
        if (!token) {
          toast.error('Please login first');
          return false;
        }

        set({ isLoading: true });
        try {
          const updateData: any = {};

          if (data.firstName || data.lastName) {
            const currentUser = get().user;
            const firstName = data.firstName || currentUser?.firstName || '';
            const lastName = data.lastName || currentUser?.lastName || '';
            updateData.name = `${firstName} ${lastName}`.trim();
          }

          if (data.phone !== undefined) {
            if (data.phone && !/^\d{10}$/.test(data.phone)) {
              toast.error('Please enter a valid 10-digit phone number');
              set({ isLoading: false });
              return false;
            }
            updateData.phone = data.phone;
          }

          if (Object.keys(updateData).length === 0) {
            toast.info('No changes to update');
            set({ isLoading: false });
            return true;
          }

          const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
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

          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              ...data,
              name: updateData.name || currentUser.name,
            };
            set({ user: updatedUser, isLoading: false });
            localStorage.setItem('customer_user', JSON.stringify(updatedUser));
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

      // ✅ NEW: Change Password Method
      changePassword: async (currentPassword: string, newPassword: string) => {
        const token = localStorage.getItem('customer_token');
        if (!token) {
          toast.error('Please login first');
          return false;
        }

        set({ isLoading: true });
        try {
          // Validate inputs
          if (!currentPassword || !newPassword) {
            toast.error('Please fill in all fields');
            set({ isLoading: false });
            return false;
          }

          if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long');
            set({ isLoading: false });
            return false;
          }

          if (currentPassword === newPassword) {
            toast.error('New password must be different from current password');
            set({ isLoading: false });
            return false;
          }

          const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 401) {
              toast.error('Current password is incorrect');
            } else {
              toast.error(data.message || 'Failed to change password');
            }
            set({ isLoading: false });
            return false;
          }

          toast.success('Password changed successfully!');
          set({ isLoading: false });
          return true;

        } catch (error: any) {
          console.error('Change password error:', error);
          toast.error(error.message || 'Network error. Please try again.');
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
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
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
              localStorage.setItem('customer_user', JSON.stringify(updatedUser));
              console.log('🔄 User refreshed:', updatedUser);
            }
          } else if (response.status === 401) {
            console.log('🔄 Token expired, logging out...');
            get().logout();
          }
        } catch (error) {
          console.error('Refresh user error:', error);
        }
      },

      clearError: () => {
        set({ isLoading: false });
      },

      checkUserExists: async () => {
        const currentUser = get().user;
        if (!currentUser?.email) return true;

        try {
          const response = await fetch(`${API_BASE_URL}/auth/check-user-exists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email })
          });

          const data = await response.json();

          if (!data.exists) {
            console.log("🔴 User deleted from database, logging out...");
            toast.error("Your account has been deleted by admin");

            localStorage.removeItem('customer_token');
            localStorage.removeItem('customer_storage');
            localStorage.removeItem('customer_user');

            set({ user: null, isAuthenticated: false, isLoading: false });

            window.location.href = '/';
            return false;
          }
          return true;
        } catch (error) {
          console.error('Check user exists error:', error);
          return true;
        }
      },
    }),
    {
      name: 'customer_storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);