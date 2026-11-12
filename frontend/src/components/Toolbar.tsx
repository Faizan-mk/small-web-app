import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { BrowserApi } from '../browser/useBrowser'
import { appHref, HOME, siteTarget, targetUrl } from '../lib/address'
import { siteTheme } from '../lib/siteTheme'
import type { Entry, Person, Target } from '../lib/types'
import {
  BackIcon, ForwardIcon, GlobeIcon, HistoryIcon, HomeIcon, MenuIcon, PublishIcon, ReloadIcon, SearchIcon, StopIcon,
  TrailIcon, WarnIcon,
} from './Icons'

interface Props {
  browser: BrowserApi
  people: Person[]
  personId: string
  onPerson(id: string): void
}

function useDismiss(open: boolean, ref: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, ref, close])
}

export function Toolbar({ browser: b, people, personId, onPerson }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const kind = b.entry?.page.kind
  const siteAddress = b.entry?.page.kind === 'site' ? b.entry.page.site.address : null

  const links: { label: string; icon: ReactNode; target: Target; active: boolean }[] = [
    { label: 'Home', icon: <HomeIcon />, target: HOME, active: kind === 'home' },
    { label: 'Directory', icon: <GlobeIcon />, target: siteTarget('directory.zz'), active: siteAddress === 'directory.zz' },
    { label: 'Search', icon: <SearchIcon />, target: { kind: 'internal', page: 'search', params: {} }, active: kind === 'search' },
    { label: 'History', icon: <HistoryIcon />, target: { kind: 'internal', page: 'history', params: {} }, active: kind === 'history' },
  ]

  return (
    <header className={`chrome ${kind === 'home' ? 'chrome-dark' : ''}`}>
      <div className="glassbar">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault()
            b.open(HOME, 'typed')
          }}
        >
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M4 19c4-5 8-5 12 0s8 5 12 0" /><path d="M4 12c4-5 8-5 12 0s8 5 12 0" opacity=".55" />
            </svg>
          </span>
          <span className="brand-name">small web</span>
        </a>

        <Omnibox browser={b} />

        <NavPills
          links={links}
          open={menuOpen}
          onGo={(t) => {
            setMenuOpen(false)
            b.open(t, 'typed')
          }}
        />

        <div className="bar-right">
          <PersonMenu people={people} personId={personId} onPerson={onPerson} />
          <a
            className={`nav-cta ${kind === 'publish' ? 'active' : ''}`}
            href={appHref('about:publish')}
            onClick={(e) => {
              e.preventDefault()
              setMenuOpen(false)
              b.open({ kind: 'internal', page: 'publish', params: {} }, 'typed')
            }}
          >
            <PublishIcon /> <span>Publish</span>
          </a>
          <button className="bar-btn menu-btn" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <StopIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}

function NavPills({ links, open, onGo }: {
  links: { label: string; icon: ReactNode; target: Target; active: boolean }[]
  open: boolean
  onGo(t: Target): void
}) {
  const ref = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  const activeIndex = links.findIndex((l) => l.active)

  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current?.querySelectorAll<HTMLElement>('.nav-link')[activeIndex]
      setIndicator(el ? { left: el.offsetLeft, width: el.offsetWidth } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeIndex, open])

  return (
    <nav ref={ref} className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
      <span
        className="nav-indicator"
        style={indicator ? { transform: `translateX(${indicator.left}px)`, width: indicator.width, opacity: 1 } : { opacity: 0 }}
        aria-hidden="true"
      />
      {links.map((l) => (
        <a
          key={l.label}
          className={`nav-link ${l.active ? 'active' : ''}`}
          aria-current={l.active ? 'page' : undefined}
          title={l.label}
          href={appHref(targetUrl(l.target))}
          onClick={(e) => {
            e.preventDefault()
            onGo(l.target)
          }}
        >
          {l.icon}
          <span>{l.label}</span>
        </a>
      ))}
    </nav>
  )
}

function Omnibox({ browser: b }: { browser: BrowserApi }) {
  const loading = Boolean(b.pending)
  return (
    <div className={`omnibox ${loading ? 'is-loading' : ''}`}>
      <div className="omni-controls">
        <button className="bar-btn" onClick={b.back} disabled={!b.canBack} title="Back (Alt+←)" aria-label="Back">
          <BackIcon />
        </button>
        <button className="bar-btn" onClick={b.forward} disabled={!b.canForward} title="Forward (Alt+→)" aria-label="Forward">
          <ForwardIcon />
        </button>
        {loading ? (
          <button className="bar-btn" onClick={b.stop} title="Stop loading (Esc)" aria-label="Stop loading">
            <StopIcon />
          </button>
        ) : (
          <button className="bar-btn" onClick={b.reload} disabled={!b.entry} title="Reload" aria-label="Reload">
            <ReloadIcon />
          </button>
        )}
      </div>
      <span className="omni-divider" aria-hidden="true" />
      <AddressBar entry={b.entry} pendingUrl={b.pending?.url ?? null} onSubmit={b.go} onStop={b.stop} />
      <TrailMenu browser={b} />
      <div className={`progress ${loading ? 'on' : ''}`} role="progressbar" aria-hidden={!loading} />
    </div>
  )
}

function AddressBar({ entry, pendingUrl, onSubmit, onStop }: {
  entry: Entry | null
  pendingUrl: string | null
  onSubmit(v: string): void
  onStop(): void
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const shownUrl = entry?.url ?? ''

  useEffect(() => setDraft(null), [shownUrl, entry?.key])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault()
        input.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const value = draft ?? pendingUrl ?? (shownUrl === 'about:home' ? '' : shownUrl)
  const page = entry?.page
  const bad = page?.kind === 'missing' || page?.kind === 'invalid' || page?.kind === 'error'
  const prior = page?.kind === 'site' ? page.prior : null

  let badge: ReactNode
  if (page?.kind === 'site') {
    const t = siteTheme(page.site.address)
    badge = (
      <span className="omni-favicon" style={{ background: t.bg, color: t.accent }} title={`${page.site.title} by ${page.site.authorName}`}>
        {page.site.title.charAt(0)}
      </span>
    )
  } else if (bad) {
    badge = <span className="omni-favicon omni-bad" title="Nothing here"><WarnIcon /></span>
  } else {
    badge = <span className="omni-favicon omni-internal" title="Browser page"><SearchIcon /></span>
  }

  return (
    <form
      className={`address ${bad ? 'address-bad' : ''}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        const v = (draft ?? value).trim()
        if (!v) return
        onSubmit(v)
        setDraft(null)
        input.current?.blur()
      }}
    >
      {badge}
      <input
        ref={input}
        aria-label="Address"
        spellCheck={false}
        autoComplete="off"
        placeholder="Search or type an address like tidepool.zz"
        value={value}
        onFocus={(e) => {
          setDraft(value)
          requestAnimationFrame(() => e.target.select())
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft === shownUrl || draft === '') setDraft(null)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            if (pendingUrl) onStop()
            setDraft(null)
            input.current?.blur()
          }
        }}
      />
      {prior && draft === null && !pendingUrl && (
        <span className="address-hint" title={`Last visit ${new Date(prior.last).toLocaleString()}`}>
          visited {prior.count}×
        </span>
      )}
      {!value && draft === null && <kbd className="omni-kbd" aria-hidden="true">/</kbd>}
    </form>
  )
}

function PersonMenu({ people, personId, onPerson }: { people: Person[]; personId: string; onPerson(id: string): void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(open, ref, () => setOpen(false))
  const me = people.find((p) => p.id === personId)
  const initials = (p: Person) => p.name.split(' ').map((n) => n[0]).join('')

  return (
    <div className="person-menu" ref={ref}>
      <button
        className="person-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Browsing as ${me?.name ?? ''}. Change person`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="avatar avatar-sm" style={{ background: me ? `hsl(${me.hue} 60% 46%)` : 'var(--muted)' }}>
          {me ? initials(me) : '?'}
        </span>
        <span className="person-name">{me?.name.split(' ')[0]}</span>
        <svg className="chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="popover person-pop" role="listbox" aria-label="Browse as">
          <p className="popover-head">Browse as</p>
          {people.map((p) => (
            <button
              key={p.id}
              role="option"
              aria-selected={p.id === personId}
              className={`person-option ${p.id === personId ? 'selected' : ''}`}
              onClick={() => {
                onPerson(p.id)
                setOpen(false)
              }}
            >
              <span className="avatar avatar-sm" style={{ background: `hsl(${p.hue} 60% 46%)` }}>{initials(p)}</span>
              <span>{p.name}</span>
              {p.id === personId && (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
                  <path d="m5 12 5 5 9-10" />
                </svg>
              )}
            </button>
          ))}
          <p className="popover-foot">History is kept per person.</p>
        </div>
      )}
    </div>
  )
}

function TrailMenu({ browser: b }: { browser: BrowserApi }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(open, ref, () => setOpen(false))

  return (
    <div className="trail" ref={ref}>
      <button className="bar-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} title="This tab's trail"
        aria-label="This tab's trail">
        <TrailIcon />
      </button>
      {open && (
        <div className="popover trail-menu" role="menu">
          <div className="popover-head">This tab's trail · {b.entries.length} {b.entries.length === 1 ? 'step' : 'steps'}</div>
          <ol>
            {b.entries.map((e, i) => (
              <li key={e.key}>
                <button
                  role="menuitem"
                  className={i === b.index ? 'current' : i > b.index ? 'ahead' : ''}
                  onClick={() => {
                    setOpen(false)
                    b.jump(i)
                  }}
                >
                  <span className="trail-i">{i + 1}</span>
                  <span className="trail-title">{e.title}</span>
                  <span className="trail-url">{e.url}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
