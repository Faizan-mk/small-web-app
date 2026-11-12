import { useEffect, useState } from 'react'
import type { PublishDraft } from '../browser/pages'
import { PageHeader } from '../components/PageHeader'
import { SiteFrame } from '../components/SiteFrame'
import { isAddress, siteTarget } from '../lib/address'
import { api } from '../lib/api'
import type { Page } from '../lib/types'
import type { PageProps } from './types'

const NO_VISITED: string[] = []

export function PublishPage({ entry, browser, people }: PageProps) {
  const page = entry.page as Extract<Page, { kind: 'publish' }>

  const [draft, setDraft] = useState<PublishDraft>(entry.state.draft as PublishDraft)
  const [preview, setPreview] = useState(draft.html)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const update = (patch: Partial<PublishDraft>) => {
    const next = { ...draft, ...patch }
    setDraft(next)
    setError(null)
    browser.patchEntry(entry.key, { state: { draft: next } })
  }

  useEffect(() => {
    const t = window.setTimeout(() => setPreview(draft.html), 300)
    return () => window.clearTimeout(t)
  }, [draft.html])

  const address = draft.address.trim().toLowerCase()
  const addressOk = isAddress(address)

  return (
    <>
    <PageHeader eyebrow={page.editing ? 'New revision' : 'Publish'} title={page.editing ? `Edit ${page.editing.address}` : 'Put a page on the small web'} tone="dusk">
      <p className="page-header-sub">
        One address, one page of HTML. Scripts, forms and embeds are removed, and outside images and fonts won't load.
        Text, structure, <code>&lt;style&gt;</code> and links to any address all work.
        {page.editing && ' Publishing again adds a new revision; anyone still looking at the old one keeps it until they reload.'}
      </p>
    </PageHeader>
    <div className="internal publish">
      <form
        className="publish-form"
        onSubmit={async (e) => {
          e.preventDefault()
          setBusy(true)
          const r = await api.publish({ ...draft, address })
          setBusy(false)
          if (!r.ok) return setError(r.error)
          browser.open(siteTarget(r.site.address), 'publish')
        }}
      >
        <div className="field-row">
          <label>
            Address
            <input
              value={draft.address}
              onChange={(e) => update({ address: e.target.value })}
              placeholder="mysite.zz"
              spellCheck={false}
              aria-invalid={draft.address !== '' && !addressOk}
              required
            />
            {draft.address !== '' && !addressOk && <small className="bad">Use lowercase letters, digits and hyphens, then a dot and a suffix, like mysite.zz</small>}
          </label>
          <label>
            Publishing as
            <select value={draft.authorId} onChange={(e) => update({ authorId: e.target.value })}>
              {people.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Title
          <input value={draft.title} onChange={(e) => update({ title: e.target.value })} placeholder="What is this page called?" required maxLength={120} />
        </label>

        <div className="editor-split">
          <label className="editor">
            HTML
            <textarea value={draft.html} onChange={(e) => update({ html: e.target.value })} spellCheck={false} />
          </label>
          <div className="editor">
            <span>Preview <small className="muted">(contained exactly as visitors will see it; links are inert here)</small></span>
            <SiteFrame key={preview} html={preview} title="Preview" visited={NO_VISITED} restoreY={0} className="preview-frame" />
          </div>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="problem-actions">
          <button type="submit" disabled={busy || !addressOk}>{busy ? 'Publishing…' : page.editing ? 'Publish revision' : 'Publish'}</button>
        </div>
      </form>
    </div>
    </>
  )
}
