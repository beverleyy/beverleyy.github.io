/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      /*
       * Every colour here resolves to a CSS variable that the active livery
       * sets (see main.css). Two consequences worth knowing:
       *
       *  - the variables already flip between light and dark, so these need no
       *    `dark:` variant in the markup;
       *  - naming the *role* rather than a slate step means the markup no
       *    longer has to be re-mapped per livery, which is what the old
       *    airlines.css `!important` layer existed to do.
       */
      colors: {
        panel: {
          DEFAULT: 'var(--panel-bg)',   // page / card surface
          alt: 'var(--panel-alt)',      // raised surface (switches, insets)
          border: 'var(--panel-border)',
          fg: 'var(--panel-fg)',        // primary text
          muted: 'var(--panel-muted)',  // secondary text, tick marks
        },
        highlight: {
          DEFAULT: 'var(--c-highlight)',
          on: 'var(--c-on-highlight)',  // text sitting on a highlight fill
        },
        emphasis: 'var(--c-emphasis)',
        display: 'var(--c-display)',
        chrome: 'var(--c-chrome)',
        /* No `sky` key here on purpose: it would shadow Tailwind's built-in sky
           palette, and the attitude indicator's horizon uses `to-sky-400`. */
      },
    },
  },
  plugins: [],
};
