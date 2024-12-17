import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Local development port
  },
  base: '/', // Azure URL
  build: {
    outDir: 'dist', 
  },
});

