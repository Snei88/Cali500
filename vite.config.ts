
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/Cali500/', // Requerido para GitHub Pages
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Definimos la variable para que esté disponible en el cliente
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Aseguramos que Rollup no trate a @google/genai como externa si queremos empaquetarla
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'lucide-react', 'recharts'],
            ai: ['@google/genai']
          }
        }
      }
    }
  };
});
