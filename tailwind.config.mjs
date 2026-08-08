/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'delta-navy': 'var(--c-primary)',
        /* the alias name is historical; it resolves to the semantic highlight role
           (see main.css) so every text-/border-/bg-delta-red in the markup follows
           whichever palette colour the active livery assigns to that role */
        'delta-red': 'var(--c-highlight)',
        'delta-sky': 'var(--c-sky)',
        'delta-slate': '#F4F5F7',
      },
    },
  },
  plugins: [],
};
