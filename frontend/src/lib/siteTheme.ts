export interface SiteTheme {
  bg: string
  ink: string
  accent: string
}

const KNOWN: Record<string, SiteTheme> = {
  'directory.zz': { bg: '#fbf3e2', ink: '#2b2620', accent: '#a06b1f' },
  'tidepool.zz': { bg: '#dff1ee', ink: '#123a40', accent: '#0f7c80' },
  'kelpforest.zz': { bg: '#163b32', ink: '#e1f5ea', accent: '#8fe3c0' },
  'lighthouse.zz': { bg: '#fff6dc', ink: '#3a2c0b', accent: '#c8890d' },
  'sourdough.zz': { bg: '#fde9d2', ink: '#3a2a18', accent: '#b35e17' },
  'ferment.zz': { bg: '#e8f1d6', ink: '#26331c', accent: '#5b8a1f' },
  'market.zz': { bg: '#fde3dd', ink: '#3d1512', accent: '#c0392b' },
  'bikes.zz': { bg: '#1e2329', ink: '#f4f5f7', accent: '#ffd23f' },
  'garden.zz': { bg: '#eef0d8', ink: '#3b3413', accent: '#6d7f2b' },
  'weather.zz': { bg: '#e2ebfa', ink: '#182433', accent: '#1f4f99' },
  'radio.zz': { bg: '#241a40', ink: '#ece8f7', accent: '#ff7ab6' },
  'nightswim.zz': { bg: '#0b1230', ink: '#d6deff', accent: '#7ef0ff' },
}

export function siteTheme(address: string): SiteTheme {
  const known = KNOWN[address]
  if (known) return known
  let h = 0
  for (const c of address) h = (h * 31 + c.charCodeAt(0)) % 360
  return { bg: `hsl(${h} 70% 93%)`, ink: `hsl(${h} 40% 16%)`, accent: `hsl(${h} 60% 38%)` }
}

export function themeVars(address: string): Record<string, string> {
  const t = siteTheme(address)
  return { '--site-bg': t.bg, '--site-ink': t.ink, '--site-accent': t.accent }
}
