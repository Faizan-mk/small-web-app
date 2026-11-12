import DOMPurify from 'dompurify'
import { parseTarget } from './address'

const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: [
    'form', 'input', 'button', 'select', 'textarea', 'option', 'iframe', 'frame', 'frameset', 'object',
    'embed', 'link', 'meta', 'base', 'video', 'audio', 'source', 'track', 'picture', 'dialog', 'template',
    'style',
  ],
  FORBID_ATTR: ['target', 'srcset', 'ping', 'formaction', 'action', 'autofocus'],
  ALLOW_DATA_ATTR: false,
}

function containCss(css: string): string {
  return css.replace(/@import[^;]*;?/gi, '').replace(/</g, '\\3c ')
}

export interface PreparedHtml {
  css: string
  body: string
}

export function prepareAuthorHtml(html: string, visited: ReadonlySet<string>): PreparedHtml {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const styles = [...doc.querySelectorAll('style')]
  const css = styles.map((s) => s.textContent ?? '').join('\n')
  styles.forEach((s) => s.remove())

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (!(node instanceof Element)) return
    if (node.nodeName === 'A') {
      const href = node.getAttribute('href')
      const t = href ? parseTarget(href, { allowSearch: false }) : null

      if (t?.kind === 'site' && visited.has(t.address)) node.setAttribute('data-zz-visited', '')
    }
    if (node.nodeName === 'IMG' && !/^data:image\//i.test(node.getAttribute('src') ?? '')) {
      node.removeAttribute('src')
    }
  })
  try {
    const body = DOMPurify.sanitize(doc.body.innerHTML, PURIFY_CONFIG) as unknown as string
    return { css: containCss(css), body }
  } finally {
    DOMPurify.removeHooks('afterSanitizeAttributes')
  }
}

const BASE_CSS = `
:where(html) { background: #fff; color-scheme: light; }
:where(body) { margin: 0 auto; max-width: 46rem; padding: 2.5rem 1.5rem 4rem;
  font: 17px/1.65 Georgia, "Iowan Old Style", serif; color: #1d1d1f; }
:where(a) { color: #1a56c4; }
:where(a[data-zz-visited]) { color: #6b3fa0; }
:where(img) { max-width: 100%; height: auto; }
:where(pre) { overflow-x: auto; }
`

function bridge(token: string, parentOrigin: string, restoreY: number): string {
  return `(function () {
  var T = ${JSON.stringify(token)}, O = ${JSON.stringify(parentOrigin)}, Y = ${Math.max(0, Math.round(restoreY))};
  function send(m) { m.channel = 'smallweb'; m.token = T; parent.postMessage(m, O); }
  function linkOf(e) { var n = e.target; return n && n.closest ? n.closest('a[href]') : null; }
  document.addEventListener('click', function (e) {
    var a = linkOf(e); if (!a) return;
    e.preventDefault();
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') {
      var id = decodeURIComponent(href.slice(1));
      var el = id && (document.getElementById(id) || document.getElementsByName(id)[0]);
      if (el) el.scrollIntoView(); else if (!id) window.scrollTo(0, 0);
      return;
    }
    send({ type: 'navigate', href: href });
  }, true);
  document.addEventListener('auxclick', function (e) { if (linkOf(e)) e.preventDefault(); }, true);
  var hovered = null;
  function hover(e) { var a = linkOf(e); var h = a ? a.getAttribute('href') : null;
    if (h !== hovered) { hovered = h; send({ type: 'hover', href: h }); } }
  document.addEventListener('mouseover', hover, true);
  document.addEventListener('focusin', hover, true);
  document.addEventListener('mouseleave', function () { hovered = null; send({ type: 'hover', href: null }); });
  var queued = false;
  window.addEventListener('scroll', function () {
    if (queued) return; queued = true;
    setTimeout(function () { queued = false; send({ type: 'scroll', y: window.scrollY }); }, 120);
  }, { passive: true });
  var tries = 0, userMoved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
    window.addEventListener(t, function () { userMoved = true; }, { passive: true, once: true });
  });
  function restore() {
    if (Y <= 0 || userMoved) return;
    window.scrollTo(0, Y);
    if (Math.abs(window.scrollY - Y) > 1 && tries++ < 60) requestAnimationFrame(restore);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restore); else restore();
  window.addEventListener('load', function () { tries = 0; restore(); });
})();`
}

function randomToken(): string {
  const a = new Uint8Array(16)
  crypto.getRandomValues(a)
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function newFrameToken(): string {
  return randomToken()
}

export function buildSrcDoc(opts: {
  html: string
  token: string
  restoreY: number
  visited: ReadonlySet<string>
}): string {
  const { css, body } = prepareAuthorHtml(opts.html, opts.visited)
  const nonce = randomToken()
  const csp = [
    "default-src 'none'",
    `script-src 'nonce-${nonce}'`,
    "style-src 'unsafe-inline'",
    'img-src data:',
    'font-src data:',
    "form-action 'none'",
    "base-uri 'none'",
  ].join('; ')
  return `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${BASE_CSS}</style>
<style>${css}</style>
<script nonce="${nonce}">${bridge(opts.token, window.location.origin, opts.restoreY)}</script>
</head><body>${body}</body></html>`
}
