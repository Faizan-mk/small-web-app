'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useBrowser } from '../browser/useBrowser'
import { SiteFooter } from './SiteFooter'
import { Toolbar } from './Toolbar'
import { api } from '../lib/api'
import type { Person } from '../lib/types'
import { HistoryPage } from '../views/HistoryPage'
import { HomePage } from '../views/HomePage'
import { ErrorPage, InvalidPage, MissingPage } from '../views/ProblemPages'
import { PublishPage } from '../views/PublishPage'
import { SearchPage } from '../views/SearchPage'
import { SiteView } from '../views/SiteView'
import type { PageProps } from '../views/types'

const PERSON_KEY = 'smallweb:person'

function storedPerson(): string {
  try {
    return localStorage.getItem(PERSON_KEY) ?? 'p-ada'
  } catch {
    return 'p-ada'
  }
}

export default function Browser() {
  const [people, setPeople] = useState<Person[]>([])
  const [personId, setPersonId] = useState(storedPerson)
  const browser = useBrowser(personId)
  const [hover, setHover] = useState<string | null>(null)
  const { entry } = browser

  useEffect(() => {
    api.people().then(setPeople).catch(() => setPeople([]))
  }, [])

  useEffect(() => {
    document.title = entry ? `${entry.title} · Small Web` : 'Small Web'
  }, [entry])

  const browserRef = useRef(browser)
  browserRef.current = browser
  useEffect(() => {
    const e = browserRef.current.entry
    if (e?.page.kind === 'history' && e.page.personId !== personId) browserRef.current.reload()
  }, [personId])

  const choosePerson = (id: string) => {
    setPersonId(id)
    try {
      localStorage.setItem(PERSON_KEY, id)
    } catch {
    }
  }

  return (
    <div className="app">
      <Toolbar browser={browser} people={people} personId={personId} onPerson={choosePerson} />
      <main className={`viewport ${browser.pending ? 'is-loading' : ''}`}>
        {entry ? (
          <PageView key={entry.key} entry={entry} browser={browser} personId={personId} people={people} onHover={setHover} />
        ) : (
          <div className="blank" />
        )}
      </main>
      <div className={`status ${hover ? 'on' : ''}`} aria-live="polite">{hover}</div>
    </div>
  )
}

function PageView(props: PageProps & { onHover(href: string | null): void }) {
  const { entry } = props
  switch (entry.page.kind) {
    case 'site':
      return <SiteView {...props} />
    case 'home':
      return <Scroller {...props}><HomePage {...props} /></Scroller>
    case 'search':
      return <Scroller {...props}><SearchPage {...props} /></Scroller>
    case 'history':
      return <Scroller {...props}><HistoryPage {...props} /></Scroller>
    case 'publish':
      return <Scroller {...props}><PublishPage {...props} /></Scroller>
    case 'missing':
      return <Scroller {...props}><MissingPage {...props} /></Scroller>
    case 'invalid':
      return <Scroller {...props}><InvalidPage {...props} /></Scroller>
    case 'error':
      return <Scroller {...props}><ErrorPage {...props} /></Scroller>
  }
}

function Scroller({ entry, browser, people, personId, children }: PageProps & { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const initial = useRef(entry.scroll).current
  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = initial
  }, [initial])
  return (
    <div className="scroller" ref={ref} onScroll={(e) => browser.patchEntry(entry.key, { scroll: e.currentTarget.scrollTop })}>
      <div className="scroller-page">{children}</div>
      <SiteFooter browser={browser} people={people} personId={personId} />
    </div>
  )
}
