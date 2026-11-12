import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { siteTarget } from '../lib/address'
import { formatDay, formatTime } from '../lib/format'
import type { Page, Transition, Visit } from '../lib/types'
import type { PageProps } from './types'

const HOW: Record<Transition, string> = {
  typed: 'typed',
  link: 'link',
  search: 'search',
  history: 'history',
  back: 'back',
  forward: 'forward',
  reload: 'reload',
  publish: 'published',
  start: 'opened',
}

export function HistoryPage({ entry, browser }: PageProps) {
  const page = entry.page as Extract<Page, { kind: 'history' }>
  const [filter, setFilter] = useState(String(entry.state.filter ?? ''))

  const groups = useMemo(() => {
    const f = filter.trim().toLowerCase()
    const shown = f
      ? page.visits.filter((v) => v.address.includes(f) || (v.title ?? '').toLowerCase().includes(f))
      : page.visits
    const out: { day: string; visits: Visit[] }[] = []
    for (const v of shown) {
      const day = formatDay(v.at)
      if (out[out.length - 1]?.day !== day) out.push({ day, visits: [] })
      out[out.length - 1].visits.push(v)
    }
    return out
  }, [page.visits, filter])

  const distinct = useMemo(() => new Set(page.visits.filter((v) => v.found).map((v) => v.address)).size, [page.visits])

  return (
    <>
    <PageHeader eyebrow="History" title={`Everywhere ${page.personName.split(' ')[0]} has been`} tone="sand">
      <div className="history-head">
        <p className="muted">
          {page.personName} · {page.visits.length} visits to {distinct} sites
        </p>
        <input
          className="filter"
          type="search"
          value={filter}
          placeholder="Filter by address or title"
          aria-label="Filter history"
          onChange={(e) => {
            setFilter(e.target.value)
            browser.patchEntry(entry.key, { state: { filter: e.target.value } })
          }}
        />
      </div>
    </PageHeader>
    <div className="internal">
      {groups.length === 0 && <p className="muted">{page.visits.length ? 'Nothing matches that filter.' : 'Nowhere yet.'}</p>}

      {groups.map((g) => (
        <section key={g.day} className="history-day">
          <h2 className="section-title">{g.day}</h2>
          <ul className="history-list">
            {g.visits.map((v) => (
              <li key={v.id}>
                <button onClick={() => browser.open(siteTarget(v.address), 'history')}>
                  <span className="h-time">{formatTime(v.at)}</span>
                  <span className={`h-title ${v.found ? '' : 'h-missing'}`}>{v.found ? v.title : 'No site here'}</span>
                  <span className="h-address">{v.address}</span>
                  <span className={`h-how how-${v.transition}`}>{HOW[v.transition]}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
    </>
  )
}
