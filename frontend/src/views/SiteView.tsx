import { SiteFrame } from '../components/SiteFrame'
import { parseTarget } from '../lib/address'
import { ago, formatDate } from '../lib/format'
import type { Page } from '../lib/types'
import type { PageProps } from './types'

export function SiteView({ entry, browser, personId, onHover }: PageProps & { onHover(href: string | null): void }) {
  const page = entry.page as Extract<Page, { kind: 'site' }>
  const { site, prior } = page
  return (
    <div className="site-view">
      <div className="site-meta">
        <span>
          by <b>{site.authorName}</b> · updated {formatDate(site.updatedAt)}
          {site.revision > 1 && <> · revision {site.revision}</>}
        </span>
        <span className="site-meta-right">
          {prior ? <>You've been here {prior.count}× · last {ago(prior.last)}</> : <>First visit</>}
          {site.authorId === personId && (
            <button
              className="link-btn"
              onClick={() =>
                browser.open({ kind: 'internal', page: 'publish', params: { address: site.address } }, 'link')
              }
            >
              Edit this site
            </button>
          )}
        </span>
      </div>
      <SiteFrame

        key={entry.key}
        html={site.html}
        title={site.title}
        visited={page.visited}
        restoreY={entry.scroll}
        onScroll={(y) => browser.patchEntry(entry.key, { scroll: y })}
        onHover={onHover}
        onNavigate={(href) => {
          const t = parseTarget(href, { allowSearch: false })
          if (t) browser.open(t, 'link')
        }}
      />
    </div>
  )
}
