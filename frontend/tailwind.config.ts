import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          50: '#F5F0EB',
          100: '#E6DFD5',
          200: '#C8B8A6',
          300: '#AA9277',
          400: '#8C6C48',
          500: '#6E4920',
          600: '#523414',
          700: '#3D240C',
          800: '#231306',
          900: '#0D0B0A',
          DEFAULT: '#0D0B0A',
        },
        ikigai: {
          gold: '#C5A059',
          goldHover: '#DFB86C',
          cream: '#F5F0EB',
          charcoal: '#161312',
          surface: '#1E1917',
          border: '#332A26',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        'gold-glow': '0 0 25px rgba(197, 160, 89, 0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
