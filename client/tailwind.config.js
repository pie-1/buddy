/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The Deep Dark Canvas
        bg: '#09090b',
        surface: '#14121f',
        'surface-hover': '#1c1a28',
        
        // Text
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa',
        'text-muted': '#52525b',

        // Brand Accents 
        brand: {
          orange: '#fb923c', // Primary Action
          red: '#f5060a',    // Alerts / Danger
          violet: '#6366f1', // Ambient Glow
          cyan: '#22d3ee',   // Highlights
        },
        border: 'rgba(255, 255, 255, 0.14)',
      },
      fontFamily: {
        // Your Logo Font (Assuming Playfair Display - change if different)
        serif: ['"Playfair Display"', 'serif'], 
        // UI Body Font
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        // The Glow Effects
        'glow-sm': 'rgba(99, 102, 241, 0.25) 0px 0px 15px 0px',
        'glow-md': 'rgba(139, 92, 246, 0.35) 0px 0px 30px 0px',
        'glow-orange': 'rgba(251, 146, 60, 0.25) 0px 0px 20px 0px',
        // The Glass Card Drop Shadow
        'card': 'rgba(0, 0, 0, 0.25) 0px 20px 50px 0px',
      },
      borderRadius: {
        'card': '24px',
        'btn': '12px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}