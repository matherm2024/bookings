import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Local development port
  },
  base: 'https://<your-app-name>.azurewebsites.net/', // Replace with your Azure URL
  build: {
    outDir: 'dist', // Ensure this matches your workflow configuration
  },
});

