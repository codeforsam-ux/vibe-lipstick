/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          neon: '#FF0099',
        },
        lime: {
          cyber: '#BFFF00',
        },
        onyx: {
          DEFAULT: '#0A0A0A',
          surface: '#111111',
          mid: '#1A1A1A',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        impact: ['Anton', 'sans-serif'],
      },
      zIndex: {
        nav: '50',
        overlay: '30',
        card: '20',
        base: '10',
      },
      aspectRatio: {
        hero: '1280 / 720',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'neon-pulse': {
          '0%, 100%': { textShadow: '0 0 8px #FF0099, 0 0 20px #FF0099' },
          '50%': { textShadow: '0 0 20px #FF0099, 0 0 60px #FF0099, 0 0 100px #FF0099' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        bounce: 'bounce 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
