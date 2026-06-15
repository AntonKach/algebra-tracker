import { defineConfig } from 'vite';

export default defineConfig({
  // Our static files are served from the public directory
  publicDir: 'public',
  base: './',
  build: {
    // Write build output to dist/
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: 'index.html',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'index') {
            return 'auth.js';
          }
          return '[name].js';
        },
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return '[name].[ext]';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
