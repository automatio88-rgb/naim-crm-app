/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#8b6914', hover: '#6b520f', light: '#d7a42a' },
        secondary: { DEFAULT: '#b8860b', hover: '#9a7009' },
        gold: { light: '#d7a42a', warm: '#e6be8a' },
        cream: { DEFAULT: '#f0e4cc', warm: '#f5f0e0', light: '#fbf7f0' },
        beige: '#f5f5dc',
        'warm-white': '#fffde7',
        surface: '#ffffff',
        'text-primary': '#1a1a1a',
        'text-secondary': '#6b7280',
        'text-muted': '#9ca3af',
        border: '#e5e7eb',
        danger: { DEFAULT: '#dc2626', hover: '#b91c1c' },
        success: { DEFAULT: '#16a34a', hover: '#15803d' },
        warning: '#f59e0b',
        info: '#2563eb',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
