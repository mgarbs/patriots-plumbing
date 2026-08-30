/* IndexNow submission for thepatriotsplumber.com.
   Run after a content deploy:  node _build/submit-indexnow.js

   IMPORTANT: IndexNow is Bing / Yandex / Seznam / Naver only.
   Google does NOT support it and has publicly declined to adopt it — Google
   discovers these pages via the sitemap declared in robots.txt, and is nudged
   faster through Search Console. Do not expect this script to affect Google.

   The key file must already be live at https://<host>/<key>.txt before the API
   will accept a submission, so deploy before running this. */

const fs = require('fs');
const path = require('path');

const HOST = 'thepatriotsplumber.com';
const KEY = '60ac2235d21e229eb3bec25a264cbe0c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ROOT = path.join(__dirname, '..');

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

if (!urlList.length) throw new Error('No <loc> entries found in sitemap.xml.');
const stray = urlList.filter((u) => new URL(u).host !== HOST);
if (stray.length) throw new Error(`URLs not on ${HOST}: ${stray.join(', ')}`);

(async () => {
  // The API rejects everything if the key file is not reachable, so check first
  // and fail with a useful message rather than an opaque 403.
  const probe = await fetch(KEY_LOCATION);
  if (!probe.ok) {
    throw new Error(`Key file not reachable (${probe.status}) at ${KEY_LOCATION} — deploy it before submitting.`);
  }
  const served = (await probe.text()).trim();
  if (served !== KEY) throw new Error(`Key file contents mismatch: served "${served}", expected "${KEY}".`);
  console.log(`key file OK  ${KEY_LOCATION}`);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });

  if (!res.ok && res.status !== 202) {
    throw new Error(`IndexNow rejected the submission (${res.status}): ${(await res.text()).slice(0, 400)}`);
  }
  console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${res.status})`);
  urlList.forEach((u) => console.log('  ' + u));
})();
