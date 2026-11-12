import { searchTarget, targetUrl } from '../lib/address'
import { api } from '../lib/api'
import type { Page, Target } from '../lib/types'

export async function loadPage(target: Target, personId: string): Promise<Page> {
  const url = targetUrl(target)
  if (target.kind === 'invalid') return { kind: 'invalid', url, input: target.input, reason: target.reason }

  if (target.kind === 'site') {
    const r = await api.getSite(target.address, personId)
    return r.site
      ? { kind: 'site', url, site: r.site, prior: r.prior, visited: r.visited }
      : { kind: 'missing', url, address: target.address, suggestions: r.suggestions }
  }

  switch (target.page) {
    case 'home': {
      const [sites, people, visits, stats] = await Promise.all([
        api.listSites(),
        api.people(),
        api.history(personId),
        api.stats(),
      ])

      const seen = new Set<string>()
      const recent = visits.filter((v) => v.found && !seen.has(v.address) && seen.add(v.address)).slice(0, 5)
      return { kind: 'home', url: 'about:home', sites, people, recent, totalVisits: stats.visits }
    }
    case 'search': {
      const q = (target.params.q ?? '').trim()
      return { kind: 'search', url: targetUrl(searchTarget(q)), q, results: q ? await api.search(q) : [] }
    }
    case 'history': {
      const [visits, people] = await Promise.all([api.history(personId), api.people()])
      const personName = people.find((p) => p.id === personId)?.name ?? personId
      return { kind: 'history', url: 'about:history', personId, personName, visits }
    }
    case 'publish': {
      const address = (target.params.address ?? '').trim().toLowerCase()
      const existing = address ? await api.getSite(address, personId) : null
      return { kind: 'publish', url, address, editing: existing?.site ?? null }
    }
  }
}

export function pageTitle(page: Page): string {
  switch (page.kind) {
    case 'site':
      return page.site.title
    case 'missing':
      return `${page.address}: no site here`
    case 'invalid':
      return "Can't open this address"
    case 'error':
      return 'Something went wrong'
    case 'home':
      return 'Home'
    case 'search':
      return page.q ? `${page.q}: search` : 'Search'
    case 'history':
      return 'History'
    case 'publish':
      return page.editing ? `Edit ${page.editing.address}` : 'Publish a site'
  }
}

export const NEW_SITE_TEMPLATE = `<style>
  body { font-family: Georgia, serif; }
  h1 { color: #1f5fbf; }
</style>
<h1>My new site</h1>
<p>Write something here. Links point at addresses, like
<a href="directory.zz">the directory</a> or <a href="tidepool.zz">tidepool.zz</a>.</p>`

export interface PublishDraft {
  address: string
  title: string
  html: string
  authorId: string
}

export function initialState(page: Page, personId: string): Record<string, unknown> {
  switch (page.kind) {
    case 'search':
      return { q: page.q }
    case 'history':
      return { filter: '' }
    case 'publish': {
      const draft: PublishDraft = {
        address: page.editing?.address ?? page.address,
        title: page.editing?.title ?? '',
        html: page.editing?.html ?? NEW_SITE_TEMPLATE,
        authorId: page.editing?.authorId ?? personId,
      }
      return { draft }
    }
    default:
      return {}
  }
}
