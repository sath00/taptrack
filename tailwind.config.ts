import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom brand colors
        primary: {
          DEFAULT: '#F59E0B', // Amber 500
          50: '#FEF3C7',
          100: '#FFF7ED', 
          300: '#FCD34D',
          500: '#F59E0B',
          600: '#D97706',
          900: '#111827',
        },
        // Custom semantic colors
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        // Custom text colors
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
          disabled: '#D1D5DB',
        },
        // Custom background colors
        bg: {
          primary: '#FFFFFF',
          secondary: '#FEF3C7',
          tertiary: '#FFF7ED',
          disabled: '#F9FAFB',
        },
        // Custom border colors
        border: {
          primary: '#E5E7EB',
          secondary: '#FCD34D',
          focus: '#F59E0B',
          disabled: '#F3F4F6',
        },
        // Custom icon colors
        icon: {
          primary: '#D97706',
          secondary: '#6B7280',
          active: '#F59E0B',
          disabled: '#D1D5DB',
        }
      },
      boxShadow: {
        'amber': '0 4px 14px 0 rgba(245, 158, 11, 0.25)',
      }
    },
  },
  plugins: [],
} satisfies Config;