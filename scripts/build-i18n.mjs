#!/usr/bin/env node
/**
 * Builds the /ko/ /en/ /ja/ static pages for all three domains.
 *
 * Output: dist/i18n/<domain-key>/<lang>/{index.html,contact/index.html,resume/index.html,...}
 * A single Cloudflare Pages project serves this tree; the Worker maps
 * www.<domain>/<lang>/* to /<domain-key>/<lang>/*.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['ko', 'en', 'ja'];
const LANG_LABELS = { ko: '한국어', en: 'English', ja: '日本語' };
const PAGE_PATHS = { home: '', contact: 'contact/', resume: 'resume/' };
const CHECK = process.argv.includes('--check');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function render(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (key in vars ? String(vars[key]) : ''));
}

const locales = Object.fromEntries(LANGS.map((lang) => [lang, readJson(`i18n/locales/${lang}.json`)]));
const brands = fs
  .readdirSync(path.join(root, 'i18n/brands'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => readJson(`i18n/brands/${f}`));
const templates = {
  home: fs.readFileSync(path.join(root, 'i18n/templates/home.html'), 'utf8'),
  contact: fs.readFileSync(path.join(root, 'i18n/templates/contact.html'), 'utf8'),
  resume: fs.readFileSync(path.join(root, 'i18n/templates/resume.html'), 'utf8'),
};

const files = new Map();

function addFile(rel, content) {
  files.set(rel.replace(/\\/g, '/'), content);
}

function languageLinks(host, lang, page) {
  return LANGS.map((l) => {
    const href = `https://${host}/${l}/${PAGE_PATHS[page]}`;
    return `<link rel="alternate" hreflang="${l}" href="${href}">`;
  })
    .concat(`<link rel="alternate" hreflang="x-default" href="https://${host}/ko/${PAGE_PATHS[page]}">`)
    .join('\n');
}

function switcher(lang, page) {
  return LANGS.map((l) => {
    const href = `/${l}/${PAGE_PATHS[page]}`;
    if (l === lang) return `<b aria-current="page">${esc(LANG_LABELS[l])}</b>`;
    return `<a href="${href}" hreflang="${l}" lang="${l}">${esc(LANG_LABELS[l])}</a>`;
  }).join('');
}

function baseVars(brand, lang, page, title, description) {
  const locale = locales[lang];
  const canonical = `https://${brand.host}/${lang}/${PAGE_PATHS[page]}`;
  return {
    lang,
    title: esc(title),
    description: esc(description),
    canonical,
    hreflang: languageLinks(brand.host, lang, page),
    langSwitcher: switcher(lang, page),
    languageLabel: esc(locale.ui.language),
    brand: esc(brand.brand),
    tagline: esc(brand.tagline[lang] || brand.tagline.ko),
    accent: brand.accent,
    year: new Date().getFullYear(),
    langLabels: LANGS.map((l) => LANG_LABELS[l]).join(' · '),
    blogUrl: brand.blogUrl || '/',
    back: esc(locale.ui.back),
    email: 'ssii@naver.com',
    phone: '010-4361-6611',
    phoneHref: '+821043616611',
    photo: 'resume-photo.jpg',
    printLabel: esc(locale.ui.print),
  };
}

for (const brand of brands) {
  for (const lang of LANGS) {
    const locale = locales[lang];
    const dir = `${brand.key}/${lang}`;

    // Home
    addFile(
      `${dir}/index.html`,
      render(templates.home, {
        ...baseVars(brand, lang, 'home', brand.brand, locale.home.intro),
        ...Object.fromEntries(Object.entries(locale.home).map(([k, v]) => [k, esc(v)])),
      })
    );

    // Contact
    addFile(
      `${dir}/contact/index.html`,
      render(templates.contact, {
        ...baseVars(brand, lang, 'contact', `${locale.contact.title} | ${brand.brand}`, locale.contact.intro),
        contactTitle: esc(locale.contact.title),
        contactIntro: esc(locale.contact.intro),
        emailLabel: esc(locale.contact.emailLabel),
        phoneLabel: esc(locale.contact.phoneLabel),
        topicsTitle: esc(locale.contact.topicsTitle),
        topics: locale.contact.topics.map((t) => `<li>${esc(t)}</li>`).join(''),
        response: esc(locale.contact.response),
        note: esc(locale.contact.note),
      })
    );

    // Resume
    addFile(
      `${dir}/resume/index.html`,
      render(templates.resume, {
        ...baseVars(brand, lang, 'resume', `${locale.resume.title} | ${brand.brand}`, locale.resume.summary),
        name: esc(locale.resume.name),
        role: esc(locale.resume.role),
        summary: esc(locale.resume.summary),
        skillsTitle: esc(locale.resume.skillsTitle),
        skills: locale.resume.skills.map((s) => `<li>${esc(s)}</li>`).join(''),
        experienceTitle: esc(locale.resume.experienceTitle),
        experience: locale.resume.experience
          .map(
            (job) =>
              `<div class="job"><div class="period">${esc(job.period)}</div><div><strong>${esc(job.title)}</strong><p>${esc(job.desc)}</p></div></div>`
          )
          .join(''),
        note: esc(locale.resume.note),
      })
    );

    const base = `https://${brand.host}/${lang}`;
    addFile(
      `${dir}/sitemap.xml`,
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `  <url><loc>${base}/</loc></url>\n  <url><loc>${base}/contact/</loc></url>\n` +
        `</urlset>\n`
    );
  }
}

addFile(
  '_headers',
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: public, max-age=0, s-maxage=3600\n`
);

const photo = path.join(root, 'pages/resume-photo.jpg');
if (fs.existsSync(photo)) {
  for (const brand of brands) {
    for (const lang of LANGS) {
      addFile(`${brand.key}/${lang}/resume/resume-photo.jpg`, fs.readFileSync(photo));
    }
  }
}

const outRoot = path.join(root, 'dist/i18n');
let changed = 0;
for (const [rel, content] of files) {
  const target = path.join(outRoot, rel);
  const current = fs.existsSync(target) ? fs.readFileSync(target) : null;
  const next = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  if (!current || !current.equals(next)) {
    changed++;
    if (!CHECK) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, next);
    }
  }
}
if (CHECK) {
  if (changed) {
    console.error(`i18n output differs: ${changed} file(s). Run npm run build:i18n.`);
    process.exit(1);
  }
  console.log(`i18n assets are up to date (${files.size} files).`);
} else {
  console.log(`Built i18n pages: ${files.size} files (${changed} written) -> dist/i18n`);
}
