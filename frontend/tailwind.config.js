module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'blur-in': {
          '0%': {
            opacity: '0',
            filter: 'blur(10px)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0px)',
          },
        },
        'blur-out': {
          '0%': {
            opacity: '1',
            filter: 'blur(0px)',
          },
          '100%': {
            opacity: '0',
            filter: 'blur(10px)',
          },
        },
        'fade-blur': {
          '0%': {
            opacity: '0',
            filter: 'blur(8px)',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0px)',
            transform: 'translateY(0px)',
          },
        },
        'slide-blur-left': {
          '0%': {
            opacity: '0',
            filter: 'blur(12px)',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0px)',
            transform: 'translateX(0px)',
          },
        },
        'slide-blur-right': {
          '0%': {
            opacity: '0',
            filter: 'blur(12px)',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0px)',
            transform: 'translateX(0px)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'blur-in': 'blur-in 0.6s ease-out',
        'blur-out': 'blur-out 0.6s ease-out',
        'fade-blur': 'fade-blur 0.8s ease-out',
        'slide-blur-left': 'slide-blur-left 0.8s ease-out',
        'slide-blur-right': 'slide-blur-right 0.8s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
