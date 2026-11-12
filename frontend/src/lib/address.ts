import type { InternalPage, Target } from './types'

const LABEL = '[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?'
export const ADDRESS_RE = new RegExp(`^(?:${LABEL}\\.)+[a-z]{2,12}$`)

const INTERNAL: InternalPage[] = ['home', 'search', 'history', 'publish']

export const HOME: Target = { kind: 'internal', page: 'home', params: {} }

export function isAddress(s: string): boolean {
  return ADDRESS_RE.test(s)
}

export function parseTarget(raw: string, opts: { allowSearch: boolean }): Target | null {
  const input = raw.trim()
  if (!input) return null
  const lower = input.toLowerCase()

  if (lower.startsWith('about:')) {
    const rest = input.slice('about:'.length)
    const q = rest.indexOf('?')
    const name = (q === -1 ? rest : rest.slice(0, q)).toLowerCase()
    const params: Record<string, string> = {}
    if (q !== -1) new URLSearchParams(rest.slice(q + 1)).forEach((v, k) => (params[k] = v))
    if ((INTERNAL as string[]).includes(name)) return { kind: 'internal', page: name as InternalPage, params }
    return { kind: 'invalid', input, reason: 'unknown-page' }
  }

  let s = lower.replace(/^zz:\/\//, '')
  if (/^[a-z][a-z0-9+.-]*:/.test(s)) return { kind: 'invalid', input, reason: 'outside' }
  s = s.replace(/^\/\//, '').replace(/\/+$/, '')
  if (ADDRESS_RE.test(s)) return { kind: 'site', address: s }

  if (opts.allowSearch && (/\s/.test(input) || !input.includes('.'))) {
    return { kind: 'internal', page: 'search', params: { q: input } }
  }
  return { kind: 'invalid', input, reason: 'malformed' }
}

export function targetUrl(t: Target): string {
  if (t.kind === 'site') return t.address
  if (t.kind === 'invalid') return t.input
  const qs = new URLSearchParams(t.params).toString()
  return `about:${t.page}${qs ? `?${qs}` : ''}`
}

export function searchTarget(q: string): Target {
  return { kind: 'internal', page: 'search', params: q.trim() ? { q: q.trim() } : {} }
}

export function siteTarget(address: string): Target {
  return { kind: 'site', address }
}

export function appHref(url: string): string {
  return url === 'about:home' ? '/' : `/?at=${encodeURIComponent(url)}`
}

export function targetFromLocation(): Target {
  const at = new URLSearchParams(window.location.search).get('at')
  return (at && parseTarget(at, { allowSearch: false })) || HOME
}
