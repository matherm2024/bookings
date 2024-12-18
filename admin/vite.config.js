import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import express from 'express'

const app = express();

app.get('/', (req, res) => {
  res.redirect('/login');
});


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
 
  server:{port:5174},
  base: '/'

}

)
