import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const targets = [
  {
    name: '21-three-column',
    source: 'src/21-three-column.html',
    css: 'assets/css/21-three-column.css',
    js: 'assets/js/21-three-column.js',
    cssTitle: 'Reddit-style Blogger 3-column layout',
    jsTitle: 'Reddit-style Blogger 3-column layout'
  },
  {
    name: '11-infinite',
    source: 'src/11-infinite.html',
    css: 'assets/css/11-infinite.css',
    js: 'assets/js/11-infinite.js',
    cssTitle: 'Reddit-style Blogger post infinite scroll',
    jsTitle: 'Reddit-style Blogger post infinite scroll',
    jsSuffix: ' (stable end + dedupe + lazy)'
  },
  {
    name: '22-post-image',
    source: 'src/22-post-image.html',
    css: 'assets/css/22-post-image.css',
    cssTitle: 'Reddit-style Blogger post image'
  },
  {
    name: '23-yt-posts',
    source: 'src/23-yt-posts.html',
    css: 'assets/css/23-yt-posts.css',
    js: 'assets/js/23-yt-posts.js',
    cssTitle: 'Reddit-style Blogger YouTube post list',
    jsTitle: 'Reddit-style Blogger YouTube post list'
  },
  {
    name: '24-home',
    source: 'src/24-home.html',
    css: 'assets/css/24-home.css',
    js: 'assets/js/24-home.js',
    cssTitle: 'Reddit-style Blogger home landing',
    jsTitle: 'Reddit-style Blogger home landing'
  }
];

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  const eq = process.argv.find(a => a.startsWith(flag + '='));
  return eq ? eq.slice(flag.length + 1) : undefined;
}

const checkOnly = process.argv.includes('--check');
const version = argValue('--version') || process.env.VERSION || pkg.version;
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`Invalid version: ${version}`);
  process.exit(1);
}

function extract(source, tag) {
  if (tag === 'script') {
    const blocks = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
    const inline = blocks.find(m => !/\bsrc\s*=/i.test(m[1]));
    return inline ? inline[2] : '';
  }
  const m = source.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? m[1] : '';
}

function cleanScript(code) {
  return code
    .replace(/^\s*\/\/<!\[CDATA\[\s*$/m, '')
    .replace(/^\s*\/\/\]\]>\s*$/m, '')
    .trim();
}

function cleanStyle(code) {
  return code
    .replace(/^\s*\/\*<!\[CDATA\[\*\/\s*/m, '')
    .replace(/\/\*\]\]>\*\/\s*$/m, '')
    .trim();
}

function output(header, body) {
  return `${header}\n${body}\n`;
}

/* 저장소는 LF 기준이다. Windows(CRLF) 체크아웃에서도 생성물이 바이트 단위로
   같아지도록 소스를 읽을 때 개행을 정규화한다(`npm run check` 거짓 실패 방지). */
function readSource(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n?/g, '\n');
}

const files = new Map();
for (const t of targets) {
  const source = readSource(t.source);
  const css = cleanStyle(extract(source, 'style'));
  const js = t.js ? cleanScript(extract(source, 'script')) : '';
  if (t.css && !css) throw new Error(`${t.name}: no <style> block`);
  if (t.js && !js) throw new Error(`${t.name}: no inline <script> block`);
  if (t.css) files.set(t.css, output(`/* ${t.cssTitle} — v${version} */`, css));
  if (t.js) files.set(t.js, output(`/* ${t.jsTitle} — v${version}${t.jsSuffix || ''} */`, js));
}

if (checkOnly) {
  let failed = false;
  for (const [rel, expected] of files) {
    const abs = path.join(root, rel);
    const actual = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    if (actual !== expected) {
      console.error(`OUT OF DATE: ${rel}`);
      failed = true;
    }
  }
  if (failed) {
    console.error('Run `npm run build` and commit the generated assets.');
    process.exit(1);
  }
  console.log(`Assets are up to date (v${version}).`);
  process.exit(0);
}

for (const [rel, content] of files) {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log(`wrote ${rel} (${Buffer.byteLength(content)} bytes)`);
}
console.log(`Built CDN assets v${version}.`);
