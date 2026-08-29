/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a9f6',
          500: '#0e8ce4',
          600: '#0270c3',
          700: '#03599e',
          800: '#074c82',
          900: '#0c406d',
          950: '#082949',
        },
        dark: {
          bg: '#0B0F17',
          card: '#111726',
          cardBorder: '#1F293D',
          hover: '#1B2438',
          text: '#F1F5F9',
          muted: '#94A3B8'
        },
        amber: {
          accent: '#F59E0B',
          glow: '#D97706'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-brand': '0 0 25px -5px rgba(14, 140, 228, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
