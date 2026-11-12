import type { BrowserApi } from '../browser/useBrowser'
import type { Entry, Person } from '../lib/types'

export interface PageProps {
  entry: Entry
  browser: BrowserApi
  personId: string
  people: Person[]
}
