import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: 5174, // Specify the development server port
    },
    base: '/', // Base public path
    define: {
      'process.env': env, // Use the loaded environment variables
    },
  };
});
