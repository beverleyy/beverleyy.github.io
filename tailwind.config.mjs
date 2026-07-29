/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'delta-navy': 'var(--c-primary)',
        'delta-red': 'var(--c-accent)',
        'delta-sky': 'var(--c-sky)',
        'delta-slate': '#F4F5F7',
      },
    },
  },
  plugins: [],
};
