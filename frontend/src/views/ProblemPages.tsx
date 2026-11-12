import { siteTarget } from '../lib/address'
import type { Page } from '../lib/types'
import type { PageProps } from './types'

export function MissingPage({ entry, browser }: PageProps) {
  const page = entry.page as Extract<Page, { kind: 'missing' }>
  return (
    <div className="internal problem">
      <p className="problem-code">no site</p>
      <h1>There is nothing at <code>{page.address}</code></h1>
      <p>Nobody has published a site at this address. Maybe it never existed, or the link that brought you here was wrong.</p>
      {page.suggestions.length > 0 && (
        <>
          <p>Did you mean:</p>
          <ul className="plain-list">
            {page.suggestions.map((s) => (
              <li key={s.address}>
                <button className="link-btn" onClick={() => browser.open(siteTarget(s.address), 'link')}>
                  {s.address}
                </button>{' '}
                · {s.title}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="problem-actions">
        {browser.canBack && <button onClick={browser.back}>Go back</button>}
        <button
          className="secondary"
          onClick={() => browser.open({ kind: 'internal', page: 'publish', params: { address: page.address } }, 'link')}
        >
          Publish a site at {page.address}
        </button>
      </div>
    </div>
  )
}

const REASONS = {
  outside: {
    title: 'That address is outside the small web',
    body: 'This browser only reaches the sites published here. There is no network beyond it, so http:// and other links lead nowhere.',
  },
  malformed: {
    title: "That isn't an address",
    body: 'Addresses look like name.zz: lowercase letters, digits and hyphens, a dot, and a suffix. There are no paths, because every site is a single page.',
  },
  'unknown-page': {
    title: 'No such browser page',
    body: 'The browser\'s own pages are about:home, about:search, about:history and about:publish.',
  },
}

export function InvalidPage({ entry, browser }: PageProps) {
  const page = entry.page as Extract<Page, { kind: 'invalid' }>
  const r = REASONS[page.reason]
  return (
    <div className="internal problem">
      <p className="problem-code">can't open</p>
      <h1>{r.title}</h1>
      <p><code className="break">{page.input}</code></p>
      <p>{r.body}</p>
      <div className="problem-actions">{browser.canBack && <button onClick={browser.back}>Go back</button>}</div>
    </div>
  )
}

export function ErrorPage({ entry, browser }: PageProps) {
  const page = entry.page as Extract<Page, { kind: 'error' }>
  return (
    <div className="internal problem">
      <p className="problem-code">error</p>
      <h1>This page couldn't be loaded</h1>
      <p><code className="break">{page.message}</code></p>
      <div className="problem-actions">
        <button onClick={browser.reload}>Try again</button>
      </div>
    </div>
  )
}
