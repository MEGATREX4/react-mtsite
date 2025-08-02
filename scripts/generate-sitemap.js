import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read App.tsx and extract routes
function extractRoutesFromApp() {
  const appPath = resolve(__dirname, '../src/App.tsx');
  const appContent = readFileSync(appPath, 'utf-8');
  
  const routes = [];
  
  // Extract static routes
  const routeMatches = appContent.match(/<Route\s+path="([^"]*)"[^>]*>/g);
  
  if (routeMatches) {
    routeMatches.forEach(match => {
      const pathMatch = match.match(/path="([^"]*)"/);
      if (pathMatch) {
        const path = pathMatch[1];
        
        // Skip dynamic routes, redirects, and wildcards
        if (!path.includes(':') && !path.includes('*') && path !== '/home' && path !== '/about') {
          routes.push({
            path: path,
            priority: path === '/' ? '1.0' : path === '/portfolio' ? '0.8' : path === '/completed_games' ? '0.7' : '0.6',
            changefreq: path === '/' || path === '/portfolio' ? 'weekly' : 'monthly'
          });
        }
      }
    });
  }
  
  // Add specific tag routes that are commonly accessed
  const tagRoutes = [
    '/tag/Portfolio',
    '/tag/7tv', 
    '/tag/OBS2Track'
  ];
  
  tagRoutes.forEach(tagRoute => {
    routes.push({
      path: tagRoute,
      priority: '0.5',
      changefreq: 'monthly'
    });
  });
  
  return routes;
}

// Generate sitemap
function generateSitemap() {
  try {
    const hostname = 'https://megatrex4.netlify.app';
    const routes = extractRoutesFromApp();
    const currentDate = new Date().toISOString().split('T')[0];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${hostname}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const distPath = resolve(__dirname, '../dist/sitemap.xml');
    const distDir = dirname(distPath);
    
    // Ensure dist directory exists
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }
    
    writeFileSync(distPath, sitemap);
    
    console.log('✅ Sitemap generated from React Router routes:');
    routes.forEach(route => {
      console.log(`   ${route.path} (priority: ${route.priority})`);
    });
    console.log(`📍 Saved to: ${distPath}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

generateSitemap();
