/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' permite publicar la carpeta dist en cualquier dirección (Netlify, GitHub Pages…).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // Compatible con celulares y navegadores de hace varios años.
    target: ['es2019', 'chrome80', 'safari13', 'firefox78', 'edge80'],
  },
  test: {
    environment: 'jsdom',
  },
});
