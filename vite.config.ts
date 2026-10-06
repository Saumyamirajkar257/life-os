import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/recharts')) {
              return 'vendor-recharts';
            }
            if (id.includes('node_modules/@tiptap') || id.includes('node_modules/prosemirror')) {
              return 'vendor-editor';
            }
            if (id.includes('firestore')) {
              return 'vendor-firestore';
            }
            if (id.includes('node_modules/@firebase') || id.includes('node_modules/firebase')) {
              return 'vendor-firebase-auth';
            }
            if (id.includes('node_modules/@google/genai')) {
              return 'vendor-genai';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
