import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),nodePolyfills({
    // Polyfill Node.js core modules
    globals: {
      Buffer: true,
      global: true,
      process: true,
    },
    // Additional included modules
    include: [
      'buffer', 
      'process', 
      'util',
      'stream',
      'events',
    ],
    // Whether to polyfill specific Node.js core modules
    protocolImports: true,
  }),],
  resolve: {
    alias: {
      // Ensure these modules are properly handled
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
  // Define these as globals to avoid reference errors
  define: {
    'process.env': process.env,
    'global': 'window',
  },
})
