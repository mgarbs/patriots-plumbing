/* One-shot, idempotent: wrap the homepage's heavy raster images in <picture>
   so modern browsers take the WebP and everything else keeps the original.
   Safe to re-run — it skips any image already wrapped. */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
const IMGS = [
  ['assets/logo-lockup-520.png', 'assets/logo-lockup-520.webp'],
  ['assets/work-remodel.jpg', 'assets/work-remodel.webp'],
  ['assets/work-roughin.jpg', 'assets/work-roughin.webp'],
  ['assets/work-bathroom.jpg', 'assets/work-bathroom.webp'],
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let html = fs.readFileSync(FILE, 'utf8');
let wrapped = 0;

for (const [src, webp] of IMGS) {
  if (html.includes('srcset="' + webp + '"')) continue; // already done
  const re = new RegExp('<img src="' + esc(src) + '"[^>]*>');
  const m = html.match(re);
  if (!m) {
    console.log('  ! not found:', src);
    continue;
  }
  let tag = m[0];
  if (!/decoding=/.test(tag)) tag = tag.replace(/>$/, ' decoding="async">');
  html = html.replace(
    re,
    '<picture>\n        <source srcset="' + webp + '" type="image/webp">\n        ' + tag + '\n      </picture>'
  );
  wrapped++;
}

fs.writeFileSync(FILE, html);
console.log('wrapped ' + wrapped + ' image(s) in <picture>');
