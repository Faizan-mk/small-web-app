import { parse } from 'node-html-parser'

export function htmlToText(html: string, opts: { dropHeading?: boolean } = {}): string {
  const root = parse(html, { blockTextElements: { script: false, style: false, noscript: false } })
  root.querySelectorAll('style, script, noscript, template').forEach((n) => n.remove())
  if (opts.dropHeading) root.querySelectorAll('h1, nav').forEach((n) => n.remove())
  return root.structuredText.replace(/\s+/g, ' ').trim()
}

export function excerpt(html: string, words = 26): string {
  const all = htmlToText(html, { dropHeading: true }).split(' ')
  return all.slice(0, words).join(' ') + (all.length > words ? '…' : '')
}

const STOP = new Set(
  (
    'a an and are as at be but by for from has have he her his i in is it its of on or our she that the their ' +
    'them they this to was we were with you your not so if into than then there these those about after all also ' +
    'can do just like more my no out up what when which who will would one zz me us'
  ).split(' '),
)

export function normalize(word: string): string {
  let w = word.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (w.length > 4 && w.endsWith('ies')) w = `${w.slice(0, -3)}y`
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1)
  return w
}

export function queryTerms(q: string): string[] {
  return [
    ...new Set(
      (q.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => w.length > 1 && !STOP.has(w)).map(normalize),
    ),
  ]
}

export interface SnippetPart {
  text: string
  hit: boolean
}

export function snippet(text: string, terms: string[], size = 30): SnippetPart[] {
  const words = text.split(' ')
  const hitAt = words.map((w) => {
    const n = normalize(w)
    return n ? (terms.find((t) => n.startsWith(t)) ?? null) : null
  })
  let bestStart = 0
  let bestScore = -1
  hitAt.forEach((h, i) => {
    if (!h) return
    const start = Math.max(0, i - 8)
    const distinct = new Set(hitAt.slice(start, start + size).filter(Boolean)).size
    if (distinct > bestScore) {
      bestScore = distinct
      bestStart = start
    }
  })
  const end = Math.min(words.length, bestStart + size)
  const raw: SnippetPart[] = []
  if (bestStart > 0) raw.push({ text: '… ', hit: false })
  for (let i = bestStart; i < end; i++) {
    if (i > bestStart) raw.push({ text: ' ', hit: false })
    raw.push({ text: words[i], hit: hitAt[i] !== null })
  }
  if (end < words.length) raw.push({ text: ' …', hit: false })
  const parts: SnippetPart[] = []
  for (const p of raw) {
    const last = parts[parts.length - 1]
    if (last && !last.hit && !p.hit) last.text += p.text
    else parts.push({ ...p })
  }
  return parts
}

export function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return row[b.length]
}
