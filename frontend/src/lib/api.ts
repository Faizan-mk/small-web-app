import type { Person, SearchResult, SitePage, SiteSummary, Transition, Visit } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4100/api'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body: unknown,
  ) {
    super(message)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(BASE + path, {
      ...init,
      headers: { 'content-type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiError(0, `Can't reach the small web server at ${BASE}. Is the backend running?`, null)
  }
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const m = (body as { message?: string | string[] } | null)?.message
    throw new ApiError(res.status, Array.isArray(m) ? m.join(' ') : (m ?? res.statusText), body)
  }
  return body as T
}

const post = <T>(path: string, data: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(data) })

export type SiteLookup =
  | { site: SitePage; prior: { count: number; last: number } | null; visited: string[] }
  | { site: null; suggestions: SiteSummary[] }

export type PublishResult = { ok: true; site: SiteSummary; created: boolean } | { ok: false; error: string }

export const api = {
  people: () => request<Person[]>('/people'),

  listSites: () => request<(SiteSummary & { excerpt: string })[]>('/sites'),

  async getSite(address: string, personId: string): Promise<SiteLookup> {
    try {
      return await request<SiteLookup>(`/sites/${encodeURIComponent(address)}?person=${encodeURIComponent(personId)}`)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        const body = err.body as { suggestions?: SiteSummary[] } | null
        return { site: null, suggestions: body?.suggestions ?? [] }
      }
      throw err
    }
  },

  search: (q: string) => request<SearchResult[]>(`/search?q=${encodeURIComponent(q)}`),

  history: (personId: string) => request<Visit[]>(`/people/${encodeURIComponent(personId)}/visits`),

  stats: () => request<{ sites: number; people: number; visits: number }>('/stats'),

  recordVisit: (v: { personId: string; address: string; transition: Transition }) => post<Visit>('/visits', v),

  async publish(input: { address: string; title: string; html: string; authorId: string }): Promise<PublishResult> {
    try {
      const r = await post<{ site: SiteSummary; created: boolean }>('/sites', input)
      return { ok: true, ...r }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) }
    }
  },
}
