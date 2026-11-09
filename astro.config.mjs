// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jacobwinickdesigns.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: { syntaxHighlight: false },
});
