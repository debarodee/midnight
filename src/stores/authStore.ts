import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserSettings } from '../types';

export interface AuthState {
  user: User | null;
  settings: UserSettings | null; // Convenience accessor
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  signOut: () => void;
  setLoading: (loading: boolean) => void;
}

const defaultSettings: UserSettings = {
  theme: 'light',
  notifications: true,
  reminderTime: '09:00',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      settings: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        settings: user?.settings || null,
        isAuthenticated: !!user,
        isLoading: false,
      }),

      updateSettings: (settings) => set((state) => {
        if (!state.user) return {};
        const newSettings = { ...state.user.settings, ...settings };
        return {
          user: { ...state.user, settings: newSettings },
          settings: newSettings,
        };
      }),

      signOut: () => set({ 
        user: null, 
        settings: null,
        isAuthenticated: false,
      }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'midnight-auth',
      partialize: (state) => ({ 
        user: state.user,
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
