/**
 * Routes only the /ko/, /en/, /ja/ prefixes of the three Blogger domains
 * to one Cloudflare Pages project. Every other path stays on Blogger because
 * the Worker routes are prefix-only.
 */
const DOMAINS = {
  'www.techlifeworld.com': 'techlifeworld',
  'techlifeworld.com': 'techlifeworld',
  'www.shutupquick.com': 'shutupquick',
  'shutupquick.com': 'shutupquick',
  'www.deepstronglove.com': 'deepstronglove',
  'deepstronglove.com': 'deepstronglove',
};

const LANG_RE = /^\/(ko|en|ja)(\/.*)?$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();
    const key = DOMAINS[host];
    const match = url.pathname.match(LANG_RE);
    if (!key || !match) {
      return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Directory URLs: /ko -> /ko/, /ko/contact -> /ko/contact/ (files keep their extension).
    const last = url.pathname.split('/').pop() || '';
    if (!url.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(last)) {
      const redirect = new URL(url.pathname + '/' + url.search, url.origin);
      return Response.redirect(redirect.toString(), 308);
    }

    const lang = match[1];
    const rest = match[2] || '/';
    const pagesOrigin = (env.PAGES_ORIGIN || 'https://jt-i18n.pages.dev').replace(/\/$/, '');
    const target = new URL(pagesOrigin);
    target.pathname = `/${key}/${lang}${rest}`;
    target.search = url.search;

    const upstream = await fetch(target.toString(), {
      method: request.method,
      headers: request.headers,
      redirect: 'follow',
      cf: { cacheEverything: false },
    });

    const headers = new Headers(upstream.headers);
    headers.set('X-JT-I18N', '1');
    // HTML stays fresh at the edge; static assets are immutable by hashed path.
    if ((headers.get('Content-Type') || '').includes('text/html')) {
      headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600');
    }
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
