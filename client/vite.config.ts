import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), TanStackRouterVite()],
  server: {
    proxy: {
      '/testy': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
    },
  },
})
