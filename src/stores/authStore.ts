import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserSettings } from '../types';

export interface AuthState {
  user: User | null;
  settings: UserSettings | null; // Convenience accessor
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean; // Track demo vs real auth
  
  // Actions
  setUser: (user: User | null, isDemo?: boolean) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  signOut: () => void;
  setLoading: (loading: boolean) => void;
  setDemoMode: (isDemo: boolean) => void;
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
      isDemoMode: false,

      setUser: (user, isDemo = false) => set({ 
        user, 
        settings: user?.settings || null,
        isAuthenticated: !!user,
        isLoading: false,
        isDemoMode: isDemo,
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
        isDemoMode: false,
      }),

      setLoading: (isLoading) => set({ isLoading }),
      
      setDemoMode: (isDemoMode) => set({ isDemoMode }),
    }),
    {
      name: 'midnight-auth',
      partialize: (state) => ({ 
        user: state.user,
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
);

// Demo user for testing without Firebase
export const createDemoUser = (): User => ({
  id: 'demo-user-' + Date.now(),
  email: 'demo@midnight.app',
  displayName: 'Demo User',
  createdAt: new Date(),
  settings: defaultSettings,
});

// Guard helper to check if we should skip Firestore operations
export const shouldSkipFirestore = (): boolean => {
  return useAuthStore.getState().isDemoMode;
};
