import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Local development port
  },
  base: 'https://clsgcounsellorbookings-afg2a3dga9dkdeg7.uksouth-01.azurewebsites.net', // Azure URL
  build: {
    outDir: 'build', // Ensure this matches your workflow configuration
  },
});

