import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  initializeTheme: () => void;
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const applyTheme = (theme: ResolvedTheme) => {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolvedTheme: getSystemTheme(),

      setMode: (mode: ThemeMode) => {
        const resolvedTheme = mode === 'system' ? getSystemTheme() : mode;
        applyTheme(resolvedTheme);
        set({ mode, resolvedTheme });
      },

      initializeTheme: () => {
        const { mode } = get();
        const resolvedTheme = mode === 'system' ? getSystemTheme() : mode;
        applyTheme(resolvedTheme);
        set({ resolvedTheme });

        // Listen for system theme changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => {
            const currentMode = get().mode;
            if (currentMode === 'system') {
              const newResolvedTheme = getSystemTheme();
              applyTheme(newResolvedTheme);
              set({ resolvedTheme: newResolvedTheme });
            }
          };
          mediaQuery.addEventListener('change', handleChange);
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
