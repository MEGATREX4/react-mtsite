import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Smart sitemap generator plugin that reads React Router routes
const generateSitemap = () => {
  return {
    name: 'generate-sitemap',
    closeBundle() {
      try {
        // Run the sitemap generation script with proper path quoting
        const scriptPath = resolve(__dirname, 'scripts/generate-sitemap.js');
        execSync(`node "${scriptPath}"`, { 
          stdio: 'inherit',
          cwd: __dirname 
        });
      } catch (error) {
        console.error('❌ Failed to generate sitemap:', error instanceof Error ? error.message : String(error));
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generateSitemap()
  ],
})
