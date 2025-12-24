import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, firstName: string, lastName: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,
      login: (email: string, password: string) => {
        const { users } = get();
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
          set({ user: existingUser, isAuthenticated: true });
          return true;
        }
        return false;
      },
      register: (email: string, password: string, firstName: string, lastName: string) => {
        const { users } = get();
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
          return false;
        }
        const newUser: User = { email, firstName, lastName };
        set({
          users: [...users, newUser],
          user: newUser,
          isAuthenticated: true,
        });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: (data: Partial<User>) => {
        const { user, users } = get();
        if (user) {
          const updatedUser = { ...user, ...data };
          const updatedUsers = users.map((u) =>
            u.email === user.email ? updatedUser : u
          );
          set({ user: updatedUser, users: updatedUsers });
        }
      },
    }),
    {
      name: 'evimeria-auth',
    }
  )
);
