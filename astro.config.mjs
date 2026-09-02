import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  /* user-pages deploy, so the base stays '/'. `site` is what lets Astro emit
     absolute canonical URLs. */
  site: 'https://beverleyy.github.io',
  integrations: [tailwind({ applyBaseStyles: false })],
});
