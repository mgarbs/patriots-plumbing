/* Patriot's Plumbing — content model for generated SEO pages.
   Pure data. Edit here, then `node _build/build.js` to regenerate. */

const BIZ = {
  // NOTE: `name` is aligned to the Google Business Profile spelling on purpose.
  // GBP = "The Patriot's Plumber"; the trading/brand name on the site is
  // "Patriot's Plumbing". Google builds one entity from consistent naming, so
  // schema carries the GBP name plus the brand as alternateName.
  name: "The Patriot's Plumber",
  altName: "Patriot's Plumbing",
  brand: "Patriot’s Plumbing",
  origin: 'https://thepatriotsplumber.com',
  phoneE164: '+12762851392',
  phoneDisplay: '(276) 285-1392',
  email: 'thepatriotsplumber@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61584678868541',
  hearth: 'https://app.gethearth.com/partners/patriots-plumbing/bill/apply',
  // Verified 2026-08-28 from the profile's "Ask for reviews" panel; the g.page
  // token base64url-decodes to CID 9996931938350486345, matching the profile fid.
  gbpUrl: 'https://maps.google.com/?cid=9996931938350486345',
  reviewUrl: 'https://g.page/r/CUlTI8WhPLyKEBM/review',
  region: 'Southwest Virginia',
  regionShort: 'SWVA',
  geo: { lat: 36.7098, lng: -81.9773 }, // Abingdon, VA — service-area centroid
};

/* Every town claimed anywhere on the site. `page:true` = gets its own city page.
   County matters: the GBP currently says "Washington County", which under-claims
   Smyth and Wythe by five towns. */
const TOWNS = [
  { name: 'Abingdon',     slug: 'abingdon-va',     county: 'Washington County', page: true,
    lat: 36.7098, lng: -81.9773 },
  { name: 'Bristol',      slug: 'bristol-va',      county: 'City of Bristol',   page: true,
    lat: 36.5951, lng: -82.1887 },
  { name: 'Marion',       slug: 'marion-va',       county: 'Smyth County',      page: true,
    lat: 36.8351, lng: -81.5148 },
  { name: 'Wytheville',   slug: 'wytheville-va',   county: 'Wythe County',      page: true,
    lat: 36.9487, lng: -81.0848 },
  { name: 'Glade Spring', slug: 'glade-spring-va', county: 'Washington County', page: true,
    lat: 36.7893, lng: -81.7712 },
  { name: 'Emory',        slug: 'emory-va',        county: 'Washington County', page: true,
    lat: 36.7929, lng: -81.8404 },
  { name: 'Meadowview',   slug: null, county: 'Washington County', page: false },
  { name: 'Damascus',     slug: 'damascus-va',     county: 'Washington County', page: true,
    lat: 36.6337, lng: -81.7862 },
  { name: 'Saltville',    slug: 'saltville-va',    county: 'Smyth County',      page: true,
    lat: 36.8790, lng: -81.7626 },
  { name: 'Chilhowie',    slug: 'chilhowie-va',    county: 'Smyth County',      page: true,
    lat: 36.7987, lng: -81.6820 },
  { name: 'Atkins',       slug: null, county: 'Smyth County',      page: false },
];

module.exports = { BIZ, TOWNS };
