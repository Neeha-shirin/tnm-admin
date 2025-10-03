import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  })
  // base: '/', // ensures assets resolve correctly when hosted in subfolder
  // build: {
  //   outDir: 'dist', // default output folder
  //   assetsDir: 'assets', // where static assets will be placed
  // },

