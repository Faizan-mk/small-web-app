import { useCallback, useEffect, useReducer, useRef } from 'react'
import { appHref, HOME, parseTarget, targetFromLocation, targetUrl } from '../lib/address'
import { api } from '../lib/api'
import type { Entry, Page, Target, Transition } from '../lib/types'
import { initialState, loadPage, pageTitle } from './pages'

interface Session {
  entries: Entry[]
  index: number
}

type CommitMode = 'push' | 'replace' | 'adopt'

const SESSION_KEY = 'smallweb:session'
const MAX_ENTRIES = 50

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Session
    return Array.isArray(s.entries) && typeof s.index === 'number' ? s : null
  } catch {
    return null
  }
}

function saveSession(s: Session): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
  } catch {
  }
}

const newKey = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
const stateKey = (state: unknown) => (state && typeof state === 'object' ? (state as { sw?: string }).sw : undefined)

export interface BrowserApi {
  entry: Entry | null
  entries: Entry[]
  index: number
  pending: { url: string } | null
  canBack: boolean
  canForward: boolean

  go(input: string): void
  open(target: Target, transition: Transition): void
  back(): void
  forward(): void
  jump(index: number): void
  reload(): void
  stop(): void

  patchEntry(key: string, patch: { scroll?: number; state?: Record<string, unknown> }): void
}

export function useBrowser(personId: string): BrowserApi {
  const sessionRef = useRef<Session>({ entries: [], index: -1 })
  const pendingRef = useRef<{ seq: number; url: string } | null>(null)
  const seqRef = useRef(0)
  const personRef = useRef(personId)
  personRef.current = personId
  const saveTimer = useRef<number | undefined>(undefined)
  const [, rerender] = useReducer((n: number) => n + 1, 0)

  const setSession = useCallback((s: Session) => {
    sessionRef.current = s
    saveSession(s)
    rerender()
  }, [])

  const record = useCallback((entry: Entry, transition: Transition) => {
    const p: Page = entry.page
    const address = p.kind === 'site' ? p.site.address : p.kind === 'missing' ? p.address : null

    if (address) api.recordVisit({ personId: personRef.current, address, transition }).catch(() => {})
  }, [])

  const commit = useCallback(
    (entry: Entry, mode: CommitMode) => {
      const { entries, index } = sessionRef.current
      let next: Entry[]
      let at: number
      if (mode === 'replace' && index >= 0) {
        next = entries.slice()
        next[index] = entry
        at = index
      } else {
        next = [...entries.slice(0, index + 1), entry]
        at = next.length - 1
      }
      if (next.length > MAX_ENTRIES) {
        const drop = next.length - MAX_ENTRIES
        next = next.slice(drop)
        at -= drop
      }
      const href = appHref(entry.url)
      if (mode === 'push') window.history.pushState({ sw: entry.key }, '', href)
      else window.history.replaceState({ sw: entry.key }, '', href)
      setSession({ entries: next, index: at })
    },
    [setSession],
  )

  const navigate = useCallback(
    async (
      target: Target,
      transition: Transition,
      opts: { mode?: CommitMode; keep?: { scroll: number; state: Record<string, unknown> } } = {},
    ) => {
      const seq = ++seqRef.current
      pendingRef.current = { seq, url: targetUrl(target) }
      rerender()

      let page: Page
      try {
        page = await loadPage(target, personRef.current)
      } catch (err) {
        page = { kind: 'error', url: targetUrl(target), message: err instanceof Error ? err.message : String(err) }
      }

      if (seq !== seqRef.current) return
      pendingRef.current = null

      const cur = sessionRef.current.entries[sessionRef.current.index]

      const mode = opts.mode ?? (cur && cur.url === page.url ? 'replace' : 'push')
      const entry: Entry = {
        key: newKey(),
        url: page.url,
        title: pageTitle(page),
        page,
        scroll: opts.keep?.scroll ?? 0,
        state: opts.keep?.state ?? initialState(page, personRef.current),
      }
      commit(entry, mode)
      record(entry, transition)
    },
    [commit, record],
  )

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      seqRef.current++
      pendingRef.current = null
      const key = stateKey(e.state)
      const s = sessionRef.current
      const idx = key ? s.entries.findIndex((x) => x.key === key) : -1
      if (idx === -1) {
        sessionRef.current = { entries: [], index: -1 }
        void navigate(targetFromLocation(), 'start', { mode: 'adopt' })
        return
      }
      const transition: Transition = idx < s.index ? 'back' : 'forward'
      setSession({ ...s, index: idx })
      record(s.entries[idx], transition)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [navigate, record, setSession])

  useEffect(() => {
    const saved = loadSession()
    const key = stateKey(window.history.state)
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (saved && key) {
      const idx = saved.entries.findIndex((e) => e.key === key)
      if (idx !== -1) {
        setSession({ entries: saved.entries, index: idx })
        if (nav?.type === 'reload') {
          const e = saved.entries[idx]
          const t = parseTarget(e.url, { allowSearch: false }) ?? HOME
          void navigate(t, 'reload', { mode: 'replace', keep: { scroll: e.scroll, state: e.state } })
        }
        return
      }
    }

    sessionRef.current = saved
      ? { entries: saved.entries.slice(0, saved.index + 1), index: saved.index }
      : { entries: [], index: -1 }
    void navigate(targetFromLocation(), 'start', { mode: 'adopt' })
  }, [navigate, setSession])

  useEffect(() => {
    const flush = () => saveSession(sessionRef.current)
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [])

  const { entries, index } = sessionRef.current
  const entry = entries[index] ?? null

  return {
    entry,
    entries,
    index,
    pending: pendingRef.current,
    canBack: index > 0,
    canForward: index < entries.length - 1,
    go(input) {
      const t = parseTarget(input, { allowSearch: true })
      if (t) void navigate(t, 'typed')
    },
    open(target, transition) {
      void navigate(target, transition)
    },
    back() {
      if (sessionRef.current.index > 0) window.history.back()
    },
    forward() {
      const s = sessionRef.current
      if (s.index < s.entries.length - 1) window.history.forward()
    },
    jump(to) {
      const delta = to - sessionRef.current.index
      if (delta !== 0 && to >= 0 && to < sessionRef.current.entries.length) window.history.go(delta)
    },
    reload() {
      const e = sessionRef.current.entries[sessionRef.current.index]
      if (!e) return
      const t = parseTarget(e.url, { allowSearch: false }) ?? HOME
      void navigate(t, 'reload', { mode: 'replace', keep: { scroll: e.scroll, state: e.state } })
    },
    stop() {
      seqRef.current++
      pendingRef.current = null
      rerender()
    },
    patchEntry(key, patch) {
      const s = sessionRef.current
      const i = s.entries.findIndex((e) => e.key === key)
      if (i < 0) return
      const entries = s.entries.slice()
      const e = entries[i]
      entries[i] = {
        ...e,
        scroll: patch.scroll ?? e.scroll,
        state: patch.state ? { ...e.state, ...patch.state } : e.state,
      }
      sessionRef.current = { ...s, entries }
      window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => saveSession(sessionRef.current), 200)
    },
  }
}
