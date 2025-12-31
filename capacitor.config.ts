import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.harollc.midnight',
  appName: 'Midnight',
  webDir: 'dist',
  server: {
    // Enable for live reload during development
    // url: 'http://YOUR_IP:5173',
    // cleartext: true,
  },
  ios: {
    // iOS-specific configuration
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scrollEnabled: true,
    backgroundColor: '#0F172A',
    // Handle status bar
    overrideUserAgent: undefined,
  },
  plugins: {
    // Status bar configuration
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F172A',
    },
    // Keyboard configuration for better form handling
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
