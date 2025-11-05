import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Proper Tailwind integration and dark mode support
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  css: {
    postcss: './postcss.config.js',
  },
});
