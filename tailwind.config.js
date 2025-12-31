/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#0F172A',
          50: '#E2E8F0',
          100: '#CBD5E1',
          200: '#94A3B8',
          300: '#64748B',
          400: '#475569',
          500: '#334155',
          600: '#1E293B',
          700: '#0F172A',
          800: '#0B1120',
          900: '#060912',
        },
        champagne: {
          DEFAULT: '#D4AF37',
          50: '#FBF7E8',
          100: '#F5ECCC',
          200: '#EADB9F',
          300: '#DFC973',
          400: '#D4AF37',
          500: '#B8952B',
          600: '#8B7020',
          700: '#5E4C16',
          800: '#31280B',
          900: '#1A1506',
        },
        sage: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        violet: {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'medium': '0 4px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)',
        'glow': '0 0 40px -10px rgba(212, 175, 55, 0.4)',
      }
    },
  },
  plugins: [],
}
