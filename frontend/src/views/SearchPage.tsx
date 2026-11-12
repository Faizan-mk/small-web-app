import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { searchTarget, siteTarget } from '../lib/address'
import { themeVars } from '../lib/siteTheme'
import type { Page } from '../lib/types'
import type { PageProps } from './types'

export function SearchPage({ entry, browser }: PageProps) {
  const page = entry.page as Extract<Page, { kind: 'search' }>

  const [q, setQ] = useState(String(entry.state.q ?? page.q))
  return (
    <>
    <PageHeader eyebrow="Search" title="Search the small web">
      <form
        className="big-search"
        onSubmit={(e) => {
          e.preventDefault()
          browser.open(searchTarget(q), 'typed')
        }}
      >
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            browser.patchEntry(entry.key, { state: { q: e.target.value } })
          }}
          placeholder="Search every page"
          aria-label="Search the web"
        />
        <button type="submit">Search</button>
      </form>
    </PageHeader>
    <div className="internal">
      {page.q && (
        <p className="result-count">
          {page.results.length === 0
            ? <>No page says anything about <b>{page.q}</b>.</>
            : <>{page.results.length} {page.results.length === 1 ? 'page mentions' : 'pages mention'} <b>{page.q}</b></>}
        </p>
      )}

      <ol className="results">
        {page.results.map((r) => (
          <li key={r.address} style={themeVars(r.address) as React.CSSProperties}>
            <a
              href={`?at=${encodeURIComponent(r.address)}`}
              onClick={(e) => {
                e.preventDefault()
                browser.open(siteTarget(r.address), 'search')
              }}
            >
              <span className="result-address">{r.address}</span>
              <span className="result-title">{r.title}</span>
            </a>
            <p className="result-snippet">
              {r.snippet.map((part, i) => (part.hit ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>))}
            </p>
            <p className="result-author">by {r.authorName}</p>
          </li>
        ))}
      </ol>
    </div>
    </>
  )
}
