#!/usr/bin/env node
/* Patriot's Plumbing — static page generator.
   Zero dependencies. Run:  node _build/build.js
   Emits service pages, city pages, both hubs, and sitemap.xml into the repo root.

   Why a generator: 13 pages share one header, footer, lead form and chat widget.
   Hand-maintaining that many copies guarantees drift. Edit the templates here,
   rebuild, commit the output. GitHub Pages still serves plain static HTML. */

const fs = require('fs');
const path = require('path');
const { BIZ, TOWNS } = require('./content');
const SERVICES = require('./services');
const CITIES = require('./cities').concat(require('./cities-2'));

const ROOT = path.join(__dirname, '..');
const BUILD_STAMP = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

/* ---------------------------------------------------------------- helpers */

// Content strings carry HTML entities on purpose. JSON-LD needs plain text.
const ENT = {
  '&mdash;': '—', '&ndash;': '–', '&rsquo;': '’', '&lsquo;': '‘',
  '&ldquo;': '“', '&rdquo;': '”', '&hellip;': '…', '&nbsp;': ' ',
  '&amp;': '&', '&lt;': '<', '&gt;': '>',
};
const toText = (s) => String(s).replace(/&[a-z]+;/g, (m) => (m in ENT ? ENT[m] : m));

const PLACE_ID = BIZ.origin + '/#business';
const url = (p) => BIZ.origin + p;

const pageTowns = TOWNS.filter((t) => t.page);
const townLink = (t) => `/plumber/${t.slug}/`;
const svcLink = (s) => `/services/${s.slug}/`;

/* ------------------------------------------------------------------ head */

function head(p) {
  const canonical = url(p.path);
  const schema = JSON.stringify(p.schema, null, 2);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content">
<title>${p.title}</title>
<meta name="description" content="${p.meta}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="48x48" href="/assets/icon-48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/icon-96.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
<link rel="apple-touch-icon" href="/assets/icon-192.png">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.meta}">
<meta property="og:image" content="${url('/assets/og.png')}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0A1428">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://patriots-plumbing-api.onrender.com" crossorigin>
<link rel="preload" as="style" href="${FONT_CSS}" fetchpriority="high">
<link rel="stylesheet" href="${FONT_CSS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONT_CSS}"></noscript>
<link rel="stylesheet" href="/css/site.css">
<script type="application/ld+json">
${schema}
</script>
</head>
<body>`;
}

const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600;700&display=swap';

/* ---------------------------------------------------------------- header */

function header() {
  return `
<div class="topbar">
  <p>Serving the I-81 corridor of Southwest Virginia</p>
  <a href="mailto:${BIZ.email}">${BIZ.email}</a>
</div>

<header class="header" id="top">
  <a class="brand" href="/" aria-label="${BIZ.brand} home">
    <img src="/assets/eagle-64.png" alt="" width="46" height="34">
    <span class="brand__word">Patriot&rsquo;s <em>Plumbing</em></span>
  </a>
  <nav class="nav" id="nav" aria-label="Main">
    <a href="/services/">Services</a>
    <a href="/service-area/">Service area</a>
    <a href="/#work">Our Work</a>
    <a href="/#about">About</a>
    <a href="/#financing">Financing</a>
  </nav>
  <div class="header__actions">
    <a class="header__phone" href="tel:${BIZ.phoneE164}">
      <span class="header__phone-label">Call or text</span>
      <span class="header__phone-num">${BIZ.phoneDisplay}</span>
    </a>
    <a class="btn btn--red header__cta" href="#request">Request service</a>
    <button class="navtoggle" id="navtoggle" aria-expanded="false" aria-controls="nav" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;
}

/* ----------------------------------------------------------- breadcrumbs */

function crumbs(trail) {
  const items = trail
    .map((c, i) =>
      i === trail.length - 1
        ? `<li aria-current="page">${c.name}</li>`
        : `<li><a href="${c.path}">${c.name}</a></li>`
    )
    .join('');
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

function crumbSchema(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: toText(c.name),
      item: url(c.path),
    })),
  };
}

/* ------------------------------------------------------------- lead form */
/* Markup mirrors index.html exactly so the shared js/site.js wires it up. */

function leadForm(heading, sub) {
  return `
    <div class="lead-card reveal" id="request">
      <div class="lead-card__head">
        <h2>${heading}</h2>
        <p>${sub}</p>
      </div>

      <div class="lead-card__progress" aria-hidden="true">
        <span class="is-on" data-seg="1"></span><span data-seg="2"></span><span data-seg="3"></span>
      </div>

      <form id="leadform" novalidate>
        <input type="text" name="company" id="company" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp">

        <fieldset class="step is-active" data-step="1">
          <legend>What&rsquo;s going on?</legend>
          <div class="chips" role="group" aria-label="Problem type">
            <button type="button" class="chip" data-problem="Leak or drip">Leak or drip</button>
            <button type="button" class="chip" data-problem="Clogged drain">Clogged drain</button>
            <button type="button" class="chip" data-problem="Water heater">Water heater</button>
            <button type="button" class="chip" data-problem="Toilet or faucet">Toilet or faucet</button>
            <button type="button" class="chip" data-problem="Remodel or install">Remodel or install</button>
            <button type="button" class="chip" data-problem="Something else">Something else</button>
          </div>
        </fieldset>

        <fieldset class="step" data-step="2">
          <legend>Tell us more <span class="opt">(optional)</span></legend>
          <textarea name="details" id="details" rows="3" maxlength="2000"
            placeholder="Where is it, how long has it been happening, anything we should know&hellip;"></textarea>
          <label class="dropzone" id="dropzone" for="photos" tabindex="0">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l2-2h6l2 2h3v13H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
            <strong>Add photos of the problem</strong>
            <span>A photo saves a trip &mdash; snap the leak, the heater tag, the works. Up to 6.</span>
            <input type="file" id="photos" accept="image/*" multiple hidden>
          </label>
          <div class="thumbs" id="thumbs"></div>
          <div class="step__nav">
            <button type="button" class="btn btn--plain" data-back>Back</button>
            <button type="button" class="btn btn--navy" data-next>Next</button>
          </div>
        </fieldset>

        <fieldset class="step" data-step="3">
          <legend>How do we reach you?</legend>
          <div class="field">
            <label for="f-name">Name</label>
            <input type="text" id="f-name" name="name" autocomplete="name" required maxlength="120">
          </div>
          <div class="field">
            <label for="f-phone">Phone</label>
            <input type="tel" id="f-phone" name="phone" autocomplete="tel" inputmode="tel" required maxlength="30" placeholder="(276) 555-0100">
          </div>
          <div class="field">
            <label for="f-email">Email <span class="opt">(optional &mdash; for a written follow-up)</span></label>
            <input type="email" id="f-email" name="email" autocomplete="email" inputmode="email" maxlength="200">
          </div>
          <div class="field">
            <label for="f-address">Address <span class="opt">(optional &mdash; helps us route the truck)</span></label>
            <input type="text" id="f-address" name="address" autocomplete="street-address" maxlength="200">
          </div>
          <div class="field">
            <span class="field__label">When works best?</span>
            <div class="chips chips--small" role="group" aria-label="Timing">
              <button type="button" class="chip chip--timing" data-timing="As soon as possible">ASAP</button>
              <button type="button" class="chip chip--timing" data-timing="Morning">Morning</button>
              <button type="button" class="chip chip--timing" data-timing="Afternoon">Afternoon</button>
            </div>
          </div>
          <p class="form-error" id="formerror" role="alert" hidden></p>
          <div class="step__nav">
            <button type="button" class="btn btn--plain" data-back>Back</button>
            <button type="submit" class="btn btn--red btn--submit" id="submitbtn">Send request</button>
          </div>
          <p class="fine">Prefer to talk? <a href="tel:${BIZ.phoneE164}">Call ${BIZ.phoneDisplay}</a></p>
        </fieldset>

        <div class="step step--success" data-step="done" aria-live="polite">
          <svg class="success__mark" viewBox="0 0 56 56" aria-hidden="true">
            <circle cx="28" cy="28" r="26" fill="none" stroke="#3E9A55" stroke-width="3"/>
            <path d="M17 29.5 25 37 40 20.5" fill="none" stroke="#3E9A55" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3 id="success-title">Request received</h3>
          <p id="success-copy">We&rsquo;ll call you back shortly.</p>
          <p class="fine">Urgent? <a href="tel:${BIZ.phoneE164}">Call ${BIZ.phoneDisplay}</a> right now.</p>
          <button type="button" class="btn btn--plain" data-reset>Send another request</button>
        </div>
      </form>
    </div>`;
}

/* --------------------------------------------------------------- page hero */

function pageHero(eyebrow, h1, lead, formHeading, formSub) {
  return `
<section class="hero hero--page">
  <svg class="hero__wing" viewBox="0 0 900 620" aria-hidden="true" focusable="false">
    <path d="M980 -60 C 640 10, 380 140, 210 400" fill="none" stroke="#C02D40" stroke-opacity=".34" stroke-width="30"/>
    <path d="M1010 30 C 690 90, 450 210, 300 460" fill="none" stroke="#F4F7FB" stroke-opacity=".10" stroke-width="26"/>
    <path d="M1030 120 C 740 170, 530 280, 400 520" fill="none" stroke="#C02D40" stroke-opacity=".22" stroke-width="24"/>
  </svg>
  <div class="hero__inner">
    <div class="hero__copy">
      <p class="eyebrow">${eyebrow}</p>
      <h1>${h1}</h1>
      <p class="hero__sub">${lead}</p>
      <div class="hero__cta">
        <a class="btn btn--red btn--lg" href="tel:${BIZ.phoneE164}">Call ${BIZ.phoneDisplay}</a>
        <button class="btn btn--ghost btn--lg" data-open-chat>Ask a question</button>
      </div>
      <ul class="hero__trust">
        <li>Master Plumber&ndash;led</li>
        <li>Licensed &amp; insured</li>
        <li>All work guaranteed</li>
      </ul>
    </div>
${leadForm(formHeading, formSub)}
  </div>
</section>

<div class="stripe-band" aria-hidden="true"></div>`;
}

/* ----------------------------------------------------------- content bits */

function block(b) {
  if (b.kind === 'list') {
    return `<section class="prose reveal">
  <h2>${b.h2}</h2>
  <ul class="checks">${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>
</section>`;
  }
  if (b.kind === 'steps') {
    return `<section class="prose reveal">
  <h2>${b.h2}</h2>
  <ol class="steps">${b.items
    .map(([t, d]) => `<li><strong>${t}</strong> ${d}</li>`)
    .join('')}</ol>
</section>`;
  }
  return `<section class="prose reveal">
  <h2>${b.h2}</h2>
  ${b.body.map((p) => `<p>${p}</p>`).join('\n  ')}
</section>`;
}

function faqBlock(faqs) {
  return `<section class="prose faq reveal">
  <h2>Common questions</h2>
  <div class="faq__list">
${faqs
  .map(
    ([q, a]) => `    <details>
      <summary>${q}</summary>
      <p>${a}</p>
    </details>`
  )
  .join('\n')}
  </div>
</section>`;
}

function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: toText(q),
      acceptedAnswer: { '@type': 'Answer', text: toText(a) },
    })),
  };
}

function closer(line) {
  return `
<div class="stripe-band" aria-hidden="true"></div>
<section class="closer">
  <h2>Ready when you are.</h2>
  <p>${line}</p>
  <div class="closer__cta">
    <a class="btn btn--red btn--lg" href="tel:${BIZ.phoneE164}">Call ${BIZ.phoneDisplay}</a>
    <a class="btn btn--ghost btn--lg" href="#request">Request service</a>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- footer */

function footer() {
  const svcCols = SERVICES.map((s) => `<a href="${svcLink(s)}">${s.nav}</a>`).join('\n      ');
  const townCols = pageTowns.map((t) => `<a href="${townLink(t)}">${t.name}</a>`).join('\n      ');
  return `
<footer class="footer">
  <div class="footer__inner footer__inner--wide">
    <div class="footer__brand">
      <img src="/assets/eagle-64.png" alt="" width="40" height="30">
      <div>
        <strong>Patriot&rsquo;s Plumbing</strong>
        <span>America&rsquo;s #1 Plumbing Service!</span>
      </div>
    </div>
    <nav class="footer__col" aria-label="Services">
      <strong class="footer__h">Services</strong>
      ${svcCols}
    </nav>
    <nav class="footer__col" aria-label="Service area">
      <strong class="footer__h">Where we work</strong>
      ${townCols}
      <a href="/service-area/">All towns &rarr;</a>
    </nav>
    <div class="footer__col">
      <strong class="footer__h">Contact</strong>
      <a href="tel:${BIZ.phoneE164}">${BIZ.phoneDisplay}</a>
      <a href="mailto:${BIZ.email}">${BIZ.email}</a>
      <a href="${BIZ.facebook}" target="_blank" rel="noopener">Facebook</a>
      <a href="${BIZ.hearth}" target="_blank" rel="noopener">Financing</a>
    </div>
  </div>
  <p class="footer__legal">Master Plumber &bull; Licensed &amp; insured &bull; All work guaranteed &bull; Serving Southwest Virginia</p>
</footer>

<div class="mobilebar" id="mobilebar">
  <a class="btn btn--red" href="tel:${BIZ.phoneE164}">Call now</a>
  <a class="btn btn--navy" href="#request">Request service</a>
</div>

<button class="chat-launch" id="chatlaunch" aria-haspopup="dialog" aria-expanded="false">
  <img src="/assets/eagle-64.png" alt="" width="34" height="26">
  <span>Ask a plumber</span>
</button>

<section class="chat" id="chat" role="dialog" aria-modal="false" aria-label="Chat with Patriot's Plumbing" hidden>
  <header class="chat__head">
    <img src="/assets/eagle-64.png" alt="" width="38" height="29">
    <div>
      <strong>Patriot&rsquo;s Plumbing</strong>
      <span>Virtual assistant &mdash; instant answers, day or night</span>
    </div>
    <button class="chat__close" id="chatclose" aria-label="Close chat">&times;</button>
  </header>
  <div class="chat__log" id="chatlog" aria-live="polite"></div>
  <div class="chat__starters" id="chatstarters">
    <button>My water heater is leaking</button>
    <button>How does pricing work?</button>
    <button>Do you handle bathroom remodels?</button>
    <button>I smell gas &mdash; what do I do?</button>
  </div>
  <form class="chat__inputrow" id="chatform">
    <label class="sr-only" for="chatinput">Type your question</label>
    <textarea id="chatinput" rows="1" maxlength="2000" placeholder="Type your question&hellip;"></textarea>
    <button type="submit" aria-label="Send">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l18-8L3 4v6l11 2-11 2z" fill="currentColor"/></svg>
    </button>
  </form>
  <footer class="chat__foot">
    <button class="chat__handoff" data-chat-handoff>Send photos &amp; request service</button>
    <a href="tel:${BIZ.phoneE164}">or call ${BIZ.phoneDisplay}</a>
  </footer>
</section>

<script src="/js/site.js" defer></script>
</body>
</html>`;
}

/* ------------------------------------------------------------ page render */

function renderService(s) {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services/' },
    { name: toText(s.nav), path: svcLink(s) },
  ];
  const others = SERVICES.filter((x) => x.slug !== s.slug);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      crumbSchema(trail),
      {
        '@type': 'Service',
        '@id': url(svcLink(s)) + '#service',
        name: toText(s.h1),
        description: s.meta,
        serviceType: toText(s.nav),
        provider: { '@id': PLACE_ID },
        areaServed: TOWNS.map((t) => ({
          '@type': 'City',
          name: t.name + ', VA',
          containedInPlace: { '@type': 'AdministrativeArea', name: t.county },
        })),
        availableChannel: {
          '@type': 'ServiceChannel',
          servicePhone: { '@type': 'ContactPoint', telephone: BIZ.phoneE164 },
          serviceUrl: url(svcLink(s)),
        },
      },
      faqSchema(s.faqs),
    ],
  };

  const body = `
${header()}
<main>
${pageHero(
    'Southwest Virginia',
    s.h1,
    s.lead,
    'Request service',
    'Three quick steps. We&rsquo;ll call you back.'
  )}
<div class="wrap">
${crumbs(trail)}
<article class="article">
  <section class="prose reveal">
    ${s.intro.map((p) => `<p class="lede">${p}</p>`).join('\n    ')}
  </section>
${block(s.firstBlock)}
${s.sections.map(block).join('\n')}
${faqBlock(s.faqs)}

  <section class="prose reveal">
    <h2>Where we do this work</h2>
    <p>We cover the I-81 corridor across Washington, Smyth, Wythe and Grayson counties. Towns with their own page:</p>
    <ul class="linkgrid">
${pageTowns.map((t) => `      <li><a href="${townLink(t)}">Plumber in ${t.name}, VA</a></li>`).join('\n')}
    </ul>
    <p class="fine">Full list on the <a href="/service-area/">service area page</a>.</p>
  </section>

  <section class="prose reveal">
    <h2>Other things we do</h2>
    <ul class="linkgrid">
${others.map((o) => `      <li><a href="${svcLink(o)}">${o.nav}</a></li>`).join('\n')}
    </ul>
  </section>
</article>
</div>
${closer(
    'Call, or send a photo of the problem &mdash; either way, you&rsquo;ll be talking to the shop, not a call center.'
  )}
</main>
${footer()}`;

  return (
    head({ path: svcLink(s), title: s.title, meta: s.meta, schema }) + body
  );
}

function renderCity(c) {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Service area', path: '/service-area/' },
    { name: c.town, path: townLink(c) },
  ];
  const town = TOWNS.find((t) => t.slug === c.slug);
  const others = pageTowns.filter((t) => t.slug !== c.slug);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      crumbSchema(trail),
      {
        '@type': 'Plumber',
        '@id': url(townLink(c)) + '#localbusiness',
        name: BIZ.name,
        alternateName: BIZ.altName,
        parentOrganization: { '@id': PLACE_ID },
        url: url(townLink(c)),
        telephone: BIZ.phoneE164,
        email: BIZ.email,
        image: url('/assets/og.png'),
        priceRange: '$$',
        areaServed: {
          '@type': 'City',
          name: c.town + ', VA',
          containedInPlace: { '@type': 'AdministrativeArea', name: c.county },
        },
      },
      faqSchema(c.faqs),
    ],
  };

  const body = `
${header()}
<main>
${pageHero(
    c.county,
    c.h1,
    c.lead,
    `Request service in ${c.town}`,
    'Three quick steps. We&rsquo;ll call you back.'
  )}
<div class="wrap">
${crumbs(trail)}
<article class="article">
  <section class="prose reveal">
    ${c.intro.map((p) => `<p class="lede">${p}</p>`).join('\n    ')}
  </section>

  <section class="prose reveal">
    <h2>What we do in ${c.town}</h2>
    <ul class="linkgrid linkgrid--cards">
${SERVICES.map(
      (s) =>
        `      <li><a href="${svcLink(s)}"><strong>${s.nav}</strong><span>${toText(s.lead).slice(0, 92)}&hellip;</span></a></li>`
    ).join('\n')}
    </ul>
  </section>

${c.local.map(block).join('\n')}
${c.localProof && c.localProof.length ? proofBlock(c.localProof, c.town) : ''}
${faqBlock(c.faqs)}

  <section class="prose reveal">
    <h2>Nearby towns we cover</h2>
    <ul class="linkgrid">
${others.map((t) => `      <li><a href="${townLink(t)}">Plumber in ${t.name}, VA</a></li>`).join('\n')}
    </ul>
    <p class="fine">We also cover ${TOWNS.filter((t) => !t.page).map((t) => t.name).join(', ')}. See the <a href="/service-area/">full service area</a>.</p>
  </section>
</article>
</div>
${closer(
    `Serving ${c.town} and the rest of ${c.county}. Call, or send a photo of the problem.`
  )}
</main>
${footer()}`;

  return head({ path: townLink(c), title: c.title, meta: c.meta, schema }) + body;
}

function proofBlock(items, town) {
  return `  <section class="prose reveal">
    <h2>Recent work in ${town}</h2>
    <div class="work__grid">
${items
  .map(
    (i) => `      <article class="job">
        <img src="${i.img}" alt="${i.alt}" loading="lazy" width="668" height="500">
        <div class="job__body"><h3>${i.title}</h3><p>${i.body}</p></div>
      </article>`
  )
  .join('\n')}
    </div>
  </section>`;
}

function renderServicesHub() {
  const trail = [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }];
  const title = 'Plumbing Services in Abingdon &amp; SW Virginia';
  const meta =
    'Urgent repairs, water heaters, drains and sewer lines, remodels, new construction rough-ins and sump pumps across Washington, Smyth, Wythe and Grayson counties.';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      crumbSchema(trail),
      {
        '@type': 'ItemList',
        name: 'Plumbing services',
        itemListElement: SERVICES.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: toText(s.h1),
          url: url(svcLink(s)),
        })),
      },
    ],
  };

  const body = `
${header()}
<main>
${pageHero(
    'What we do',
    'Plumbing Services',
    'One shop, one standard, every job guaranteed &mdash; from a burst pipe to a bathroom you have been planning for a year.',
    'Request service',
    'Three quick steps. We&rsquo;ll call you back.'
  )}
<div class="wrap">
${crumbs(trail)}
<article class="article">
  <section class="prose reveal">
    <p class="lede">We are a Master Plumber&ndash;led shop serving Washington, Smyth, Wythe and Grayson counties. Everything below is work we do ourselves &mdash; residential and commercial, repair and remodel.</p>
  </section>
  <section class="prose reveal">
    <ul class="linkgrid linkgrid--cards linkgrid--big">
${SERVICES.map(
    (s) => `      <li><a href="${svcLink(s)}"><strong>${s.nav}</strong><span>${s.lead}</span></a></li>`
  ).join('\n')}
    </ul>
  </section>
  <section class="prose reveal">
    <h2>How we work</h2>
    <p>Four things are true of every job on this list, whether it is a ten-minute repair or a bathroom stripped to the studs.</p>
    <ol class="steps">
      <li><strong>Honest diagnosis before any work.</strong> We tell you what is actually wrong and what it will take, before anyone starts. If a part will genuinely buy you years, we say so rather than selling you the replacement.</li>
      <li><strong>Trained, courteous technicians.</strong> We only hire plumbers we would send to our own family&rsquo;s house, and we guarantee all of our work. We also run a drug-free workplace, because who walks through your door matters.</li>
      <li><strong>We clean up like we were never there.</strong> Care and respect for your home or business is not an upsell. It is the baseline.</li>
      <li><strong>No games with the bill.</strong> What we quote is what we mean, and if something changes mid-job you hear it from us before it becomes a number on an invoice.</li>
    </ol>
  </section>

  <section class="prose reveal">
    <h2>Residential and commercial</h2>
    <p>We handle both. Residential work is the bulk of what we do &mdash; repairs, water heaters, drains, and the kitchen, bathroom and laundry remodels our office takes on. On the commercial side we do repairs and installations for businesses, rental property and buildings across the same service area.</p>
    <p>If you are not sure whether your project is something we take on, the fastest answer is to call and describe it. We would rather tell you honestly that it is not a fit than waste a visit finding out.</p>
  </section>

  <section class="prose reveal">
    <h2>When the bill is the problem</h2>
    <p>Plumbing failures do not wait for a convenient month. We partner with Hearth so a major repair or a full replacement does not have to sit until the budget catches up: you can see payment options without affecting your credit score, funding typically lands in one to three days, and there are no prepayment penalties and no home equity required.</p>
    <p><a href="${BIZ.hearth}" target="_blank" rel="noopener">Check your financing options &rarr;</a></p>
  </section>

  <section class="prose reveal">
    <h2>Where we work</h2>
    <ul class="linkgrid">
${pageTowns.map((t) => `      <li><a href="${townLink(t)}">Plumber in ${t.name}, VA</a></li>`).join('\n')}
    </ul>
    <p class="fine">Plus ${TOWNS.filter((t) => !t.page).map((t) => t.name).join(', ')} &mdash; see the <a href="/service-area/">full service area</a>.</p>
  </section>
</article>
</div>
${closer('Not sure which one you need? Call and describe it &mdash; we will tell you straight.')}
</main>
${footer()}`;

  return head({ path: '/services/', title, meta, schema }) + body;
}

function renderAreaHub() {
  const trail = [{ name: 'Home', path: '/' }, { name: 'Service area', path: '/service-area/' }];
  const title = 'Service Area | Plumber for Abingdon, Bristol &amp; Marion, VA';
  const meta =
    'We cover Abingdon, Bristol, Marion, Wytheville, Glade Spring, Damascus, Chilhowie and Saltville across Washington, Smyth, Wythe and Grayson counties.';

  const byCounty = {};
  TOWNS.forEach((t) => {
    (byCounty[t.county] = byCounty[t.county] || []).push(t);
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      crumbSchema(trail),
      {
        '@type': 'ItemList',
        name: 'Towns served',
        itemListElement: pageTowns.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: 'Plumber in ' + t.name + ', VA',
          url: url(townLink(t)),
        })),
      },
    ],
  };

  const countyBlocks = Object.keys(byCounty)
    .map(
      (county) => `  <section class="prose reveal">
    <h2>${county}</h2>
    <ul class="linkgrid">
${byCounty[county]
        .map((t) =>
          t.page
            ? `      <li><a href="${townLink(t)}">Plumber in ${t.name}, VA</a></li>`
            : `      <li><span class="linkgrid__plain">${t.name}, VA</span></li>`
        )
        .join('\n')}
    </ul>
  </section>`
    )
    .join('\n');

  const body = `
${header()}
<main>
${pageHero(
    'Where we work',
    'Our Service Area',
    'Based in Abingdon, working the I-81 corridor from Bristol up through Wytheville.',
    'Request service',
    'Three quick steps. We&rsquo;ll call you back.'
  )}
<div class="wrap">
${crumbs(trail)}
<article class="article">
  <section class="prose reveal">
    <p class="lede">We are licensed in Virginia and we work the I-81 corridor &mdash; Washington, Smyth, Wythe and Grayson counties and the City of Bristol. Abingdon and Bristol are where we do most of our work, and we cover the rest of the corridor from there.</p>
    <p>Close but not on this list? <button class="linklike" data-open-chat>Ask us</button> &mdash; we may still cover you, and if we do not we will tell you rather than waste your time.</p>
  </section>
${countyBlocks}
  <section class="prose reveal">
    <h2>A note on the Tennessee line</h2>
    <p>Bristol&rsquo;s State Street runs the Virginia/Tennessee border. We are licensed in Virginia, so we work the Virginia side. If your property sits on the Tennessee side, we are not the right shop &mdash; and we would rather say so up front.</p>
  </section>

  <section class="prose reveal">
    <h2>How far we go, and why this stretch</h2>
    <p>Our territory follows I-81 for a practical reason: it is the road that makes covering this much ground actually workable. Abingdon, Bristol and Glade Spring sit close together at one end, with Marion, Chilhowie and Wytheville strung along the interstate from there &mdash; and because it is interstate the whole way, our timings hold up in weather that would make a back-roads route unreliable.</p>
    <p>We would rather cover a corridor properly than claim a map we cannot serve. If you are past Wytheville, or over the Tennessee line, we will tell you honestly rather than book a visit we cannot do well.</p>
  </section>

  <section class="prose reveal">
    <h2>What helps most when you call</h2>
    <ol class="steps">
      <li><strong>Where you are.</strong> Town and whether you are on town water and sewer or a well and septic. That one answer changes the diagnosis more than anything else you can tell us.</li>
      <li><strong>What you are seeing.</strong> Not what you think is wrong &mdash; what you can actually observe. Where the water is, what it sounds like, when it started, whether it is getting worse.</li>
      <li><strong>A photo, if you can.</strong> A photo saves a trip. Snap the leak, the water heater&rsquo;s data plate, the puddle, the fitting. You can send them straight through the request form on this page.</li>
      <li><strong>How urgent it is.</strong> Be straight with us and we will be straight with you about where you sit in the day. An active leak and a slow drain are different calls.</li>
    </ol>
  </section>

  <section class="prose reveal">
    <h2>If water is moving right now</h2>
    <p>For an active leak, a burst line or a main-line backup, call rather than filling in a form. And before we arrive, shut off your main water valve, which is usually where the supply enters the crawlspace or basement, or at the meter near the road. That single step is the difference between a repair and a restoration job. If you smell gas, leave the building first, then call your gas company or 911 from outside.</p>
    <p>For everything else &mdash; a heater on its last legs, a drain that has been slow for months, a remodel you have been planning &mdash; booking ahead gets you a better slot and our full attention. That is especially true at the far end of the territory in Marion and Wytheville, where a scheduled visit is far easier to do well than a same-day scramble.</p>
  </section>
  <section class="prose reveal">
    <h2>What we do</h2>
    <ul class="linkgrid">
${SERVICES.map((s) => `      <li><a href="${svcLink(s)}">${s.nav}</a></li>`).join('\n')}
    </ul>
  </section>
</article>
</div>
${closer('Call, or send a photo of the problem &mdash; we will tell you honestly what we can do and when.')}
</main>
${footer()}`;

  return head({ path: '/service-area/', title, meta, schema }) + body;
}

/* ---------------------------------------------------------------- sitemap */

function sitemap(paths) {
  const urls = paths
    .map(
      (p) => `  <url>
    <loc>${url(p.path)}</loc>
    <lastmod>${BUILD_STAMP}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/* -------------------------------------------------------------- write out */

function write(rel, contents) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents, 'utf8');
  return rel + '  (' + Math.round(Buffer.byteLength(contents) / 1024) + ' KB)';
}

const written = [];
const smPaths = [{ path: '/', priority: '1.0' }];

written.push(write('services/index.html', renderServicesHub()));
smPaths.push({ path: '/services/', priority: '0.8' });

SERVICES.forEach((s) => {
  written.push(write(`services/${s.slug}/index.html`, renderService(s)));
  smPaths.push({ path: svcLink(s), priority: '0.9' });
});

written.push(write('service-area/index.html', renderAreaHub()));
smPaths.push({ path: '/service-area/', priority: '0.8' });

CITIES.forEach((c) => {
  written.push(write(`plumber/${c.slug}/index.html`, renderCity(c)));
  smPaths.push({ path: townLink(c), priority: '0.9' });
});

written.push(write('sitemap.xml', sitemap(smPaths)));
written.push(
  write(
    'robots.txt',
    `User-agent: *
Allow: /

Sitemap: ${url('/sitemap.xml')}
`
  )
);

console.log('Built ' + written.length + ' files:\n' + written.map((w) => '  ' + w).join('\n'));
