export interface Person {
  id: string
  name: string
  hue: number
}

export interface Revision {
  title: string
  html: string
  publishedAt: number
}

export interface Site {
  address: string
  authorId: string
  createdAt: number

  revisions: Revision[]
}

export interface SiteSummary {
  address: string
  title: string
  authorId: string
  authorName: string
  updatedAt: number
  revision: number
}

export interface SitePage extends SiteSummary {
  html: string
}

export type Transition =
  | 'typed'
  | 'link'
  | 'search'
  | 'history'
  | 'back'
  | 'forward'
  | 'reload'
  | 'publish'
  | 'start'

export interface Visit {
  id: string
  personId: string
  address: string
  at: number
  transition: Transition

  found: boolean
  title: string | null
}

export interface SnippetPart {
  text: string
  hit: boolean
}

export interface SearchResult {
  address: string
  title: string
  authorName: string
  snippet: SnippetPart[]
  score: number
}

export type InternalPage = 'home' | 'search' | 'history' | 'publish'
export type InvalidReason = 'outside' | 'malformed' | 'unknown-page'

export type Target =
  | { kind: 'site'; address: string }
  | { kind: 'internal'; page: InternalPage; params: Record<string, string> }
  | { kind: 'invalid'; input: string; reason: InvalidReason }

export type Page =
  | {
      kind: 'site'
      url: string
      site: SitePage
      prior: { count: number; last: number } | null
      visited: string[]
    }
  | { kind: 'missing'; url: string; address: string; suggestions: SiteSummary[] }
  | { kind: 'invalid'; url: string; input: string; reason: InvalidReason }
  | { kind: 'error'; url: string; message: string }
  | {
      kind: 'home'
      url: string
      sites: (SiteSummary & { excerpt: string })[]
      people: Person[]
      recent: Visit[]
      totalVisits: number
    }
  | { kind: 'search'; url: string; q: string; results: SearchResult[] }
  | { kind: 'history'; url: string; personId: string; personName: string; visits: Visit[] }
  | { kind: 'publish'; url: string; address: string; editing: SitePage | null }

export interface Entry {
  key: string
  url: string
  title: string
  page: Page

  scroll: number

  state: Record<string, unknown>
}
