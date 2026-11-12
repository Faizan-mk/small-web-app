import type { BrowserApi } from '../browser/useBrowser'
import { HOME, searchTarget, siteTarget } from '../lib/address'
import type { Person, Target, Transition } from '../lib/types'

const POPULAR = ['tidepool.zz', 'sourdough.zz', 'nightswim.zz', 'lighthouse.zz', 'market.zz']
const TOPICS = ['low tide', 'sourdough', 'sea fog', 'kelp', 'allotment']

export function SiteFooter({ browser, people, personId }: { browser: BrowserApi; people: Person[]; personId: string }) {
  const open = (t: Target, how: Transition = 'link') => browser.open(t, how)
  const me = people.find((p) => p.id === personId)

  const Link = ({ t, children, how }: { t: Target; children: string; how?: Transition }) => (
    <li>
      <button className="footer-link" onClick={() => open(t, how)}>{children}</button>
    </li>
  )

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M4 19c4-5 8-5 12 0s8 5 12 0" /><path d="M4 12c4-5 8-5 12 0s8 5 12 0" opacity=".55" />
              </svg>
            </span>
            <span>small web</span>
          </div>
          <p>
            A browser for the hand-made web of Saltmarsh: one-page sites written by the people of a small coastal town.
          </p>
          {me && (
            <p className="footer-me">
              <span className="person-dot" style={{ background: `hsl(${me.hue} 65% 50%)` }} />
              Browsing as <b>{me.name}</b>
            </p>
          )}
        </div>

        <nav className="footer-col" aria-label="Explore">
          <h3>Explore</h3>
          <ul>
            <Link t={HOME} how="typed">Home</Link>
            <Link t={siteTarget('directory.zz')}>The directory</Link>
            <Link t={{ kind: 'internal', page: 'search', params: {} }} how="typed">Search</Link>
            <Link t={{ kind: 'internal', page: 'history', params: {} }} how="typed">Your history</Link>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Popular sites">
          <h3>Popular sites</h3>
          <ul>
            {POPULAR.map((a) => (
              <Link key={a} t={siteTarget(a)}>{a}</Link>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Topics">
          <h3>Topics</h3>
          <ul>
            {TOPICS.map((q) => (
              <Link key={q} t={searchTarget(q)} how="typed">{q}</Link>
            ))}
          </ul>
        </nav>

        <div className="footer-col footer-cta">
          <h3>Write something</h3>
          <p>Pick an address, write a page of HTML, and it is live for everyone.</p>
          <button className="nav-cta" onClick={() => open({ kind: 'internal', page: 'publish', params: {} }, 'typed')}>
            Publish a site
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 small web · Saltmarsh and everyone in it are invented.</span>
        <span>Seeded with <code>npm run seed</code> in the backend.</span>
      </div>
    </footer>
  )
}
