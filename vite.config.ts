import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Custom sitemap generator plugin
const generateSitemap = () => {
  return {
    name: 'generate-sitemap',
    writeBundle() {
      const hostname = 'https://megatrex4.netlify.app'
      const routes = [
        '/',
        '/portfolio',
      ]
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${hostname}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`

      writeFileSync(resolve(__dirname, 'dist/sitemap.xml'), sitemap)
      console.log('✅ Sitemap generated at dist/sitemap.xml')
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
