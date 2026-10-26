// Crea una versión de un solo archivo (dist-single/econoplay.html) con todo incluido:
// código, estilos y fuentes. Sirve para publicarla como página única. Ejecutar después de `npm run build`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const dist = 'dist';
const html = readFileSync(join(dist, 'index.html'), 'utf8');

const jsPath = html.match(/<script[^>]*src="\.?\/?(assets\/[^"]+\.js)"/)[1];
const cssPath = html.match(/<link[^>]*href="\.?\/?(assets\/[^"]+\.css)"/)[1];

const js = readFileSync(join(dist, jsPath), 'utf8').replace(/<\/script/gi, '<\\/script');
const css = readFileSync(join(dist, cssPath), 'utf8').replace(/url\(([^)]+\.woff2?)\)/g, (_, url) => {
  const file = basename(url.replace(/["']/g, ''));
  const data = readFileSync(join(dist, 'assets', file)).toString('base64');
  return `url(data:font/woff2;base64,${data})`;
});

const page = `<title>Econoplay</title>
<meta name="description" content="Aprende jugando la escuela neoclásica y la escuela austriaca.">
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;

mkdirSync('dist-single', { recursive: true });
writeFileSync('dist-single/econoplay.html', page);
console.log(`dist-single/econoplay.html (${Math.round(page.length / 1024)} KB)`);
