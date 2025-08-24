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
        // // Brand
        // 'brand': '#F59E0B',
        // 'brand-hover': '#D97706',
        // 'brand-light': '#FCD34D',

        // // // Semantic
        // // 'success': '#10B981',
        // // 'success-hover': '#059669',
        // // 'error': '#EF4444',
        // // 'error-hover': '#DC2626',
        // // 'warning': '#F59E0B',

        // // Text
        // 'text-primary': '#111827',
        // 'text-secondary': '#6B7280',
        // 'text-tertiary': '#9CA3AF',
        // 'text-disabled': '#D1D5DB',

        // // Background
        // 'primary': '#FFFFFF',
        // 'secondary': '#FEF3C7',
        // 'secondary-hover': '#FCD34D',
        // 'tertiary': '#FFF7ED',
        // 'disabled': '#F9FAFB',

        // // Borders
        // 'border-primary': '#E5E7EB',
        // 'border-secondary': '#FCD34D',
        // 'border-disabled': '#F3F4F6',
      },
      boxShadow: {
        'amber': '0 4px 14px 0 rgba(245, 158, 11, 0.25)',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'disabled'],
      borderColor: ['hover', 'disabled'],
      textColor: ['hover', 'disabled'],
    },
  },
  safelist: [
    'bg-brand', 'hover:bg-brand-hover', 'disabled:bg-brand',
    'bg-primary', 'hover:bg-secondary-hover', 'disabled:bg-disabled',
    'border-border-secondary', 'hover:border-border-secondary', 'disabled:border-disabled',
    'text-primary', 'text-secondary', 'hover:text-primary', 'disabled:text-secondary',
  ],
  plugins: [],
} satisfies Config;
