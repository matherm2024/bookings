import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Specify the development server port
  },
  base: '/', // Base public path
  define: {
    'process.env': process.env, // Explicitly use process.env in case Vite defaults fail
  },
});
