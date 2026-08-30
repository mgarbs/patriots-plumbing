/* SEO/perf audit over the built site. Run: node _build/audit.js
   Checks the things that actually break rankings quietly:
   title/description length, editorial word count, one H1, canonical,
   valid JSON-LD, internal link count, and orphan pages. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', '_build', 'docs', 'assets', 'css', 'js']);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const pick = (h, re) => { const m = h.match(re); return m ? m[1] : ''; };

// 404 isn't a content page, and google*.html is Search Console's ownership
// verification file — neither should be audited as site content.
const files = walk(ROOT).filter((f) => {
  const base = path.basename(f);
  // 404 isn't a content page; google<hex>.html is Search Console's ownership
  // verification file. Neither should be audited as site content.
  return base !== '404.html' && !/^google[0-9a-f]+\.html$/.test(base);
});
const pages = [];
const problems = [];
const linkedTo = new Set();

for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const main = (h.match(/<main[\s\S]*?<\/main>/) || [h])[0];
  const copy = main
    .replace(/<form[\s\S]*?<\/form>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ');
  const words = copy.trim().split(/\s+/).filter(Boolean).length;

  const title = pick(h, /<title>([\s\S]*?)<\/title>/);
  const desc = pick(h, /<meta name="description" content="([^"]*)"/);
  const canonical = pick(h, /<link rel="canonical" href="([^"]*)"/);
  const h1s = (h.match(/<h1[\s>]/g) || []).length;
  const url = rel(f).replace(/index\.html$/, '').replace(/^/, '/');

  // internal links out of this page
  const hrefs = [...h.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]);
  hrefs.forEach((x) => linkedTo.add(x.endsWith('/') ? x : x + '/'));

  let jsonOk = true;
  const ld = h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) jsonOk = false;
  else { try { JSON.parse(ld[1]); } catch (e) { jsonOk = false; } }

  pages.push({ url, words, title: title.length, desc: desc.length, h1s, jsonOk, out: hrefs.length });

  if (title.length > 62) problems.push(`${url} — title ${title.length} chars (Google truncates ~60)`);
  if (!title.length) problems.push(`${url} — missing title`);
  if (desc.length > 165) problems.push(`${url} — description ${desc.length} chars (truncates ~160)`);
  if (desc.length < 70) problems.push(`${url} — description only ${desc.length} chars`);
  if (!canonical) problems.push(`${url} — missing canonical`);
  if (h1s !== 1) problems.push(`${url} — ${h1s} H1 tags (want exactly 1)`);
  if (!jsonOk) problems.push(`${url} — missing/invalid JSON-LD`);
  if (words < 300) problems.push(`${url} — only ${words} editorial words (thin)`);
}

// orphan check: a page nothing links to
for (const p of pages) {
  if (p.url !== '/' && !linkedTo.has(p.url)) problems.push(`${p.url} — ORPHAN, no internal links point here`);
}

pages.sort((a, b) => a.words - b.words);
console.log('PAGE'.padEnd(42) + 'WORDS  TITLE  DESC  H1  LD  OUT');
for (const p of pages) {
  console.log(
    p.url.padEnd(42) +
      String(p.words).padStart(5) +
      String(p.title).padStart(7) +
      String(p.desc).padStart(6) +
      String(p.h1s).padStart(4) +
      (p.jsonOk ? '  ok' : ' BAD') +
      String(p.out).padStart(5)
  );
}
console.log('\n' + pages.length + ' pages, ' + pages.reduce((s, p) => s + p.words, 0) + ' editorial words total');
console.log(problems.length ? '\nPROBLEMS:\n' + problems.map((p) => '  - ' + p).join('\n') : '\nNo problems found.');
