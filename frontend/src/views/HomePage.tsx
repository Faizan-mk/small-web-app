import { useState, type CSSProperties, type ReactNode } from 'react'
import { searchTarget, siteTarget } from '../lib/address'
import { ago, formatDate } from '../lib/format'
import { themeVars } from '../lib/siteTheme'
import type { Page, Target, Transition } from '../lib/types'
import type { PageProps } from './types'

const FEATURED = ['tidepool.zz', 'sourdough.zz', 'nightswim.zz']
const TRY = ['low tide', 'sourdough starter', 'sea fog', 'bioluminescence', 'puncture']

export function HomePage({ entry, browser, personId }: PageProps) {
  const page = entry.page as Extract<Page, { kind: 'home' }>
  const [q, setQ] = useState('')
  const go = (t: Target, how: Transition) => browser.open(t, how)
  const featured = FEATURED.map((a) => page.sites.find((s) => s.address === a)).filter((s) => s !== undefined)
  const me = page.people.find((p) => p.id === personId)
  const authors = page.people
    .map((p) => ({ person: p, sites: page.sites.filter((s) => s.authorId === p.id) }))
    .filter((a) => a.sites.length > 0)
    .sort((a, b) => b.sites.length - a.sites.length)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Saltmarsh · a small web</p>
            <h1>
              A web small enough<br />to <em>know by heart.</em>
            </h1>
            <p className="hero-lede">
              {page.sites.length} hand-written, one-page sites by the people of a little coastal town. Tide pools,
              sourdough, sea fog and night swims. Wander from link to link, search what they wrote, or publish your own.
            </p>
            <form
              className="hero-search"
              onSubmit={(e) => {
                e.preventDefault()
                if (q.trim()) go(searchTarget(q), 'typed')
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
              </svg>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search every word on every page"
                aria-label="Search the web" />
              <button type="submit">Search</button>
            </form>
            <div className="hero-try">
              <span>Try</span>
              {TRY.map((t) => (
                <button key={t} onClick={() => go(searchTarget(t), 'typed')}>{t}</button>
              ))}
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            {featured.map((s, i) => (
              <div key={s.address} className={`hero-card hero-card-${i}`} style={themeVars(s.address) as CSSProperties}>
                <div className="hero-card-bar"><i /><i /><i /><span>{s.address}</span></div>
                <div className="hero-card-body">
                  <strong>{s.title}</strong>
                  <p>{s.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <dl className="hero-stats">
          <div><dt>Sites</dt><dd>{page.sites.length}</dd></div>
          <div><dt>Writers</dt><dd>{authors.length}</dd></div>
          <div><dt>People browsing</dt><dd>{page.people.length}</dd></div>
          <div><dt>Visits recorded</dt><dd>{page.totalVisits}</dd></div>
        </dl>
        <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C 240 90 480 0 720 35 S 1200 80 1440 30 V90 H0 Z" />
        </svg>
      </section>

      <div className="home-body">
        {page.recent.length > 0 && (
          <section className="home-section">
            <header className="home-section-head">
              <div>
                <p className="eyebrow">Welcome back{me ? `, ${me.name.split(' ')[0]}` : ''}</p>
                <h2>Pick up where you left off</h2>
              </div>
              <button className="ghost-btn" onClick={() => go({ kind: 'internal', page: 'history', params: {} }, 'typed')}>
                Full history →
              </button>
            </header>
            <ul className="recent">
              {page.recent.map((v) => (
                <li key={v.id}>
                  <SiteLink open={go} address={v.address} className="recent-item" style={themeVars(v.address) as CSSProperties}>
                    <span className="recent-dot" />
                    <span className="recent-title">{v.title}</span>
                    <span className="recent-when">{ago(v.at)}</span>
                  </SiteLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="home-section">
          <header className="home-section-head">
            <div>
              <p className="eyebrow">Start wandering</p>
              <h2>Three good places to begin</h2>
            </div>
          </header>
          <div className="featured">
            {featured.map((s) => (
              <SiteLink open={go} key={s.address} address={s.address} className="feature" style={themeVars(s.address) as CSSProperties}>
                <span className="feature-address">{s.address}</span>
                <span className="feature-title">{s.title}</span>
                <span className="feature-excerpt">{s.excerpt}</span>
                <span className="feature-foot">
                  <span>by {s.authorName}</span>
                  <span className="feature-go">Open →</span>
                </span>
              </SiteLink>
            ))}
          </div>
        </section>

        <section className="home-section">
          <header className="home-section-head">
            <div>
              <p className="eyebrow">The whole web</p>
              <h2>Every site in Saltmarsh</h2>
            </div>
            <p className="muted small">Sorted by title · {page.sites.length} sites</p>
          </header>
          <ul className="site-grid">
            {page.sites.map((s) => (
              <li key={s.address}>
                <SiteLink open={go} address={s.address} className="site-card" style={themeVars(s.address) as CSSProperties}>
                  <span className="site-card-top">
                    <span className="monogram">{s.title.charAt(0)}</span>
                    <span className="card-address">{s.address}</span>
                  </span>
                  <span className="card-title">{s.title}</span>
                  <span className="card-excerpt">{s.excerpt}</span>
                  <span className="card-meta">{s.authorName} · {formatDate(s.updatedAt)}{s.revision > 1 ? ` · rev ${s.revision}` : ''}</span>
                </SiteLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section">
          <header className="home-section-head">
            <div>
              <p className="eyebrow">Who writes it</p>
              <h2>The people behind the pages</h2>
            </div>
          </header>
          <ul className="authors">
            {authors.map(({ person, sites }) => (
              <li key={person.id} className="author">
                <span className="avatar" style={{ background: `hsl(${person.hue} 60% 46%)` }}>
                  {person.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <div>
                  <strong>{person.name}</strong>
                  <span className="muted small">{sites.length} {sites.length === 1 ? 'site' : 'sites'}</span>
                  <span className="author-sites">
                    {sites.map((s) => (
                      <SiteLink open={go} key={s.address} address={s.address} className="chip">{s.address}</SiteLink>
                    ))}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="how">
          <div className="how-steps">
            <div>
              <span className="how-n">01</span>
              <h3>Type an address</h3>
              <p>Every site lives at an address like <code>tidepool.zz</code>. Type one into the bar at the top, or type plain words to search.</p>
            </div>
            <div>
              <span className="how-n">02</span>
              <h3>Follow the links</h3>
              <p>Sites point at each other. Some links lead nowhere at all; that's part of the web too. Back and forward always take you to the page as you left it.</p>
            </div>
            <div>
              <span className="how-n">03</span>
              <h3>Publish your own</h3>
              <p>Pick an address nobody has taken, write a page of HTML, and it's live. No accounts. Just choose your name from the list.</p>
            </div>
          </div>
          <div className="how-cta">
            <h2>Got something to say?</h2>
            <p>Saltmarsh always has room for one more page.</p>
            <button onClick={() => go({ kind: 'internal', page: 'publish', params: {} }, 'typed')}>Publish a site</button>
          </div>
        </section>
      </div>

    </div>
  )
}

function SiteLink({ address, className, style, children, open }: {
  address: string
  className?: string
  style?: CSSProperties
  children: ReactNode
  open(t: Target, how: Transition): void
}) {
  return (
    <a
      className={className}
      style={style}
      href={`?at=${encodeURIComponent(address)}`}
      onClick={(e) => {
        e.preventDefault()
        open(siteTarget(address), 'link')
      }}
    >
      {children}
    </a>
  )
}
