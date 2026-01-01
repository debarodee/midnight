import React from 'react'
import ReactDOM from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard'
import App from './App'
import './index.css'
import { useThemeStore } from './stores/themeStore'

// Initialize theme before React renders to prevent flash
useThemeStore.getState().initializeTheme()

// Initialize native plugins
const initializeApp = async () => {
  if (Capacitor.isNativePlatform()) {
    // Configure status bar for iOS - adapt based on theme
    const resolvedTheme = useThemeStore.getState().resolvedTheme
    try {
      await StatusBar.setStyle({ style: resolvedTheme === 'dark' ? Style.Dark : Style.Light })
      await StatusBar.setBackgroundColor({ color: resolvedTheme === 'dark' ? '#050505' : '#FFFFFF' })
    } catch (e) {
      // Status bar not available on all platforms
    }

    // Configure keyboard behavior
    try {
      await Keyboard.setScroll({ isDisabled: false })
    } catch (e) {
      // Keyboard plugin not available
    }
  }
}

initializeApp()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
