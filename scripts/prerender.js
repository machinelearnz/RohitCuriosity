import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.join(rootDir, 'dist');
const blogsDir = path.join(rootDir, 'src', 'content', 'blogs');
const portfolioDir = path.join(rootDir, 'src', 'content', 'portfolio');

const SITE_ORIGIN = 'https://rohitcuriosity.com';
const DEFAULT_TITLE = 'Rohit Curiosity | rohitcuriosity.com — Market Views, Tech Frontiers & Venture Architecture';
const DEFAULT_DESCRIPTION = 'Personal branding portal, market intelligence, venture projects, and tech insights by Rohit Curiosity (rohitcuriosity.com).';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/img_1788688398193_headerfxborrowing.jpg`;

/**
 * Simple YAML frontmatter parser
 */
function parseFrontmatter(rawContent) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) return { frontmatter: {}, content: rawContent };

  const frontmatter = {};
  const rawLines = match[1].split('\n');

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line || line.startsWith('#')) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();

      // Handle arrays like tags: ["A", "B"]
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          const arrayItems = val
            .slice(1, -1)
            .split(',')
            .map(item => item.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
          frontmatter[key] = arrayItems;
          continue;
        } catch (e) {}
      }

      // Strip quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      frontmatter[key] = val;
    }
  }

  return { frontmatter, content: match[2] ? match[2].trim() : '' };
}

/**
 * Convert relative image path to absolute URL
 */
function toAbsoluteImageUrl(imagePath) {
  if (!imagePath) return DEFAULT_IMAGE;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) {
    return `${SITE_ORIGIN}${imagePath}`;
  }
  return `${SITE_ORIGIN}/${imagePath}`;
}

/**
 * HTML Escape helper
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Injects meta tags into template HTML
 */
function generatePageHtml(baseTemplate, metadata) {
  const {
    title,
    description,
    url,
    imageUrl,
    type = 'website',
    author = 'Rohit Curiosity',
    publishedTime,
    tags = []
  } = metadata;

  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const escapedUrl = escapeHtml(url);
  const escapedImage = escapeHtml(imageUrl);
  const escapedAuthor = escapeHtml(author);

  let html = baseTemplate;

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);

  // Remove existing meta tags & comments cleanly
  html = html.replace(/\s*<!--\s*(?:Open Graph|Twitter|Primary SEO|Schema\.org)[\s\S]*?-->/gi, '');
  html = html.replace(/\s*<meta\s+name="description"[\s\S]*?>/gi, '');
  html = html.replace(/\s*<meta\s+property="og:[^"]+"[\s\S]*?>/gi, '');
  html = html.replace(/\s*<meta\s+name="twitter:[^"]+"[\s\S]*?>/gi, '');
  html = html.replace(/\s*<link\s+rel="canonical"[\s\S]*?>/gi, '');
  html = html.replace(/\s*<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');

  // JSON-LD Structured Data
  let jsonLd = '';
  if (type === 'article') {
    jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      image: [imageUrl],
      datePublished: publishedTime || new Date().toISOString(),
      dateModified: publishedTime || new Date().toISOString(),
      author: [{
        '@type': 'Person',
        name: author,
        url: SITE_ORIGIN
      }],
      publisher: {
        '@type': 'Organization',
        name: 'Rohit Curiosity',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_ORIGIN}/vite.svg`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      keywords: tags.join(', ')
    });
  } else {
    jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Rohit Curiosity',
      url: SITE_ORIGIN,
      description: description
    });
  }

  // Build meta tags block
  const metaTags = `
    <!-- Primary SEO Meta Tags -->
    <meta name="description" content="${escapedDesc}" />
    <link rel="canonical" href="${escapedUrl}" />

    <!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="Rohit Curiosity" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedDesc}" />
    <meta property="og:image" content="${escapedImage}" />
    <meta property="og:image:secure_url" content="${escapedImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapedTitle}" />
    <meta property="og:url" content="${escapedUrl}" />

    <!-- Twitter / X Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@rohitcuriosity" />
    <meta name="twitter:creator" content="@rohitcuriosity" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedDesc}" />
    <meta name="twitter:image" content="${escapedImage}" />

    <!-- Schema.org JSON-LD Structured Data -->
    <script type="application/ld+json">
      ${jsonLd}
    </script>
  `;

  // Inject meta tags into <head>
  html = html.replace('</head>', `${metaTags}\n  </head>`);

  return html;
}

/**
 * Main Prerender Routine
 */
async function prerender() {
  console.log('\n🚀 [prerender] Starting static HTML & Open Graph generation...\n');

  const baseHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('❌ [prerender] Error: dist/index.html does not exist. Run "vite build" first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');
  const sitemapUrls = [
    { url: `${SITE_ORIGIN}/`, priority: '1.0', changefreq: 'daily' },
    { url: `${SITE_ORIGIN}/about`, priority: '0.8', changefreq: 'monthly' },
    { url: `${SITE_ORIGIN}/blogs`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_ORIGIN}/portfolio`, priority: '0.8', changefreq: 'weekly' },
    { url: `${SITE_ORIGIN}/contact`, priority: '0.6', changefreq: 'monthly' }
  ];

  // 1. Process Blog Articles
  if (fs.existsSync(blogsDir)) {
    const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));
    console.log(`📄 [prerender] Found ${blogFiles.length} blog article(s).`);

    for (const file of blogFiles) {
      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(blogsDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, content } = parseFrontmatter(raw);

      const title = frontmatter.title || slug.replace(/-/g, ' ');
      const description = frontmatter.excerpt || (content ? content.slice(0, 160).replace(/[#*`]/g, '').trim() + '...' : DEFAULT_DESCRIPTION);
      const imageUrl = toAbsoluteImageUrl(frontmatter.coverImage);
      const articleUrl = `${SITE_ORIGIN}/blogs/${slug}`;

      const pageHtml = generatePageHtml(baseHtml, {
        title: `${title} | Rohit Curiosity`,
        description,
        url: articleUrl,
        imageUrl,
        type: 'article',
        author: frontmatter.author || 'Rohit Curiosity',
        publishedTime: frontmatter.date ? `${frontmatter.date}T00:00:00Z` : undefined,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : []
      });

      const outDir = path.join(distDir, 'blogs', slug);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), pageHtml, 'utf8');

      console.log(`   ✓ Generated: /blogs/${slug}/index.html (OG: "${title}")`);

      sitemapUrls.push({
        url: articleUrl,
        lastmod: frontmatter.date || new Date().toISOString().split('T')[0],
        priority: '0.9',
        changefreq: 'monthly'
      });
    }

    // Also generate /blogs/index.html directory page
    const blogsIndexDir = path.join(distDir, 'blogs');
    const blogsIndexHtml = generatePageHtml(baseHtml, {
      title: 'Market Views & Analytical Briefs | Rohit Curiosity',
      description: 'In-depth market intelligence, macro risk models, sovereign AI compute, and technological frontier analysis.',
      url: `${SITE_ORIGIN}/blogs`,
      imageUrl: DEFAULT_IMAGE,
      type: 'website'
    });
    fs.writeFileSync(path.join(blogsIndexDir, 'index.html'), blogsIndexHtml, 'utf8');
    console.log(`   ✓ Generated: /blogs/index.html`);
  }

  // 2. Process Portfolio Projects
  if (fs.existsSync(portfolioDir)) {
    const portfolioFiles = fs.readdirSync(portfolioDir).filter(f => f.endsWith('.md'));
    console.log(`💼 [prerender] Found ${portfolioFiles.length} portfolio project(s).`);

    for (const file of portfolioFiles) {
      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(portfolioDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, content } = parseFrontmatter(raw);

      const title = frontmatter.title || slug.replace(/-/g, ' ');
      const description = frontmatter.summary || frontmatter.excerpt || (content ? content.slice(0, 160).replace(/[#*`]/g, '').trim() + '...' : DEFAULT_DESCRIPTION);
      const imageUrl = toAbsoluteImageUrl(frontmatter.coverImage);
      const projectUrl = `${SITE_ORIGIN}/portfolio/${slug}`;

      const pageHtml = generatePageHtml(baseHtml, {
        title: `${title} | Portfolio | Rohit Curiosity`,
        description,
        url: projectUrl,
        imageUrl,
        type: 'article',
        author: frontmatter.client || 'Rohit Curiosity',
        publishedTime: frontmatter.date ? `${frontmatter.date}T00:00:00Z` : undefined,
        tags: Array.isArray(frontmatter.technologies) ? frontmatter.technologies : []
      });

      const outDir = path.join(distDir, 'portfolio', slug);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), pageHtml, 'utf8');

      console.log(`   ✓ Generated: /portfolio/${slug}/index.html (OG: "${title}")`);

      sitemapUrls.push({
        url: projectUrl,
        lastmod: frontmatter.date || new Date().toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'monthly'
      });
    }

    // Also generate /portfolio/index.html
    const portfolioIndexDir = path.join(distDir, 'portfolio');
    const portfolioIndexHtml = generatePageHtml(baseHtml, {
      title: 'Venture Cases & Technical Systems | Rohit Curiosity',
      description: 'Production systems, quantitative financial simulators, and autonomous AI architectures designed and shipped.',
      url: `${SITE_ORIGIN}/portfolio`,
      imageUrl: DEFAULT_IMAGE,
      type: 'website'
    });
    fs.writeFileSync(path.join(portfolioIndexDir, 'index.html'), portfolioIndexHtml, 'utf8');
    console.log(`   ✓ Generated: /portfolio/index.html`);
  }

  // 3. Update root dist/index.html with default SEO & OG tags
  const updatedRootHtml = generatePageHtml(baseHtml, {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: `${SITE_ORIGIN}/`,
    imageUrl: DEFAULT_IMAGE,
    type: 'website'
  });
  fs.writeFileSync(path.join(distDir, 'index.html'), updatedRootHtml, 'utf8');
  console.log(`   ✓ Updated: /index.html with default Open Graph tags`);

  // 4. Generate sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(item => `  <url>
    <loc>${item.url}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : `<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>`}
    <changefreq>${item.changefreq || 'weekly'}</changefreq>
    <priority>${item.priority || '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log(`\n🗺️  [prerender] Generated sitemap.xml (${sitemapUrls.length} routes)`);

  // 5. Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
  console.log(`🤖 [prerender] Generated robots.txt`);

  console.log('\n✨ [prerender] Static Open Graph pre-rendering completed successfully!\n');
}

prerender().catch(err => {
  console.error('❌ [prerender] Fatal error:', err);
  process.exit(1);
});
