/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00bcd4',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        atlas: ['AtlasGrotesk', 'system-ui', 'sans-serif'],
        organization: ['var(--font-organization)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        marquee: 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
        'dcc-pilot-heading-shimmer': 'dccPilotHeadingShimmer 7s ease-in-out infinite',
        'dcc-engagement-grid': 'dccEngagementGrid 22s linear infinite',
        'dcc-engagement-shine': 'dccEngagementShine 3.5s ease-in-out infinite',
        /** Footer digital ticker — RGB split / jitter on phrase hover */
        'dcc-ticker-glitch': 'dccTickerGlitch 0.38s steps(1, end) infinite',
        /** Symbol swap pulse on ticker hover */
        'dcc-ticker-mark-pulse': 'dccTickerMarkPulse 0.55s ease-in-out infinite',
      },
      keyframes: {
        dccTickerGlitch: {
          '0%, 100%': {
            transform: 'translate(0, 0)',
            textShadow: 'none',
          },
          '12.5%': {
            transform: 'translate(-2px, 1px)',
            textShadow:
              '2px 0 0 rgba(255, 0, 136, 0.75), -2px 0 0 rgba(0, 212, 170, 0.65)',
          },
          '25%': {
            transform: 'translate(2px, -1px)',
            textShadow:
              '-2px 0 0 rgba(0, 212, 170, 0.8), 2px 0 0 rgba(255, 0, 136, 0.55)',
          },
          '37.5%': { transform: 'translate(-1px, -2px)', textShadow: '1px 0 0 rgba(255, 107, 53, 0.7)' },
          '50%': { transform: 'translate(1px, 2px)', textShadow: '-1px 0 0 rgba(0, 212, 170, 0.6)' },
          '62.5%': { transform: 'translate(-2px, 0)', textShadow: 'none' },
          '75%': { transform: 'translate(2px, 1px)', textShadow: '0 0 12px rgba(0, 212, 170, 0.45)' },
          '87.5%': { transform: 'translate(0, -1px)', textShadow: '0 0 10px rgba(255, 0, 136, 0.35)' },
        },
        dccTickerMarkPulse: {
          '0%, 100%': {
            filter: 'brightness(1.12) saturate(1.2) drop-shadow(0 0 10px rgba(0, 212, 170, 0.4))',
          },
          '50%': {
            filter: 'brightness(1.38) saturate(1.55) drop-shadow(0 0 18px rgba(255, 0, 136, 0.4))',
          },
        },
        dccPilotHeadingShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        dccEngagementGrid: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(22px, 22px, 0)' },
        },
        dccEngagementShine: {
          '0%': { backgroundPosition: '0% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
        },
      },
    },
  },
  plugins: [],
}














