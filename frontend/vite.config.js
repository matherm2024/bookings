import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{port:5173},
  base: 'https://clsgcounsellorbookings-afg2a3dga9dkdeg7.uksouth-01.azurewebsites.net',
})

