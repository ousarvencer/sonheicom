/**
 * gerar-sitemap.js — SonheiCom
 * Gera sitemap-principal.xml e sitemap-index.xml
 * Uso: node scripts/gerar-sitemap.js
 */

const fs   = require('fs');
const path = require('path');

const BASE_URL = 'https://sonheicom.com.br';
const ROOT_DIR = path.resolve(__dirname, '..');

// ── Páginas principais do site ────────────────────────────────
const PAGINAS_PRINCIPAIS = [
  { url: '/',                          priority: '1.0', changefreq: 'weekly'  },
  { url: '/sobre.html',                priority: '0.5', changefreq: 'monthly' },
  { url: '/politica-de-privacidade.html', priority: '0.3', changefreq: 'yearly' },
];

// ── Data de hoje no formato W3C ───────────────────────────────
function hoje() {
  return new Date().toISOString().slice(0, 10);
}

// ── Gera sitemap-principal.xml ────────────────────────────────
function gerarSitemapPrincipal() {
  const urls = PAGINAS_PRINCIPAIS.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${hoje()}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  const outPath = path.join(ROOT_DIR, 'sitemap-principal.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(`✓ sitemap-principal.xml gerado (${PAGINAS_PRINCIPAIS.length} URLs)`);
}

// ── Gera sitemap-index.xml ────────────────────────────────────
function gerarSitemapIndex() {
  // Verifica quais sitemaps existem
  const sitemaps = [
    'sitemap-principal.xml',
    'sonhos-sitemap.xml',
  ].filter(nome => fs.existsSync(path.join(ROOT_DIR, nome)));

  const entries = sitemaps.map(nome => `  <sitemap>
    <loc>${BASE_URL}/${nome}</loc>
    <lastmod>${hoje()}</lastmod>
  </sitemap>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  const outPath = path.join(ROOT_DIR, 'sitemap-index.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(`✓ sitemap-index.xml gerado (${sitemaps.length} sitemaps incluídos)`);

  if (!fs.existsSync(path.join(ROOT_DIR, 'sonhos-sitemap.xml'))) {
    console.warn(`⚠ sonhos-sitemap.xml não encontrado — rode gerar-paginas.js primeiro`);
  }
}

// ── Entry point ───────────────────────────────────────────────
function main() {
  console.log('✦ Gerando sitemaps...\n');
  gerarSitemapPrincipal();
  gerarSitemapIndex();
  console.log('\n✦ CONCLUÍDO');
  console.log(`  Submeta ao Google Search Console: ${BASE_URL}/sitemap-index.xml`);
}

main();
