import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// If running in development with root .env, look in parent directory
const rootEnvDir = fs.existsSync(path.resolve(__dirname, '../.env'))
  ? path.resolve(__dirname, '..')
  : __dirname;

export default defineConfig({
  plugins: [react()],
  envDir: rootEnvDir,
  server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } },
  preview: { port: 5173 },
});
