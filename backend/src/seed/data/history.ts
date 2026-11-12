export const SEED_EPOCH = Date.UTC(2026, 10, 9, 17, 0, 0)
export const DAY = 86_400_000

export const SEED_PEOPLE = [
  { id: 'p-ada', name: 'Ada Okafor', hue: 262 },
  { id: 'p-bruno', name: 'Bruno Silva', hue: 28 },
  { id: 'p-chen', name: 'Chen Wei', hue: 2 },
  { id: 'p-dara', name: 'Dara Murphy', hue: 95 },
  { id: 'p-esme', name: 'Esme Laurent', hue: 178 },
  { id: 'p-farid', name: 'Farid Haddad', hue: 215 },
  { id: 'p-iris', name: 'Iris Novak', hue: 320 },
]

export interface Trail {
  person: string

  start: number
  steps: string[]
}

export const TRAILS: Trail[] = [

  {
    person: 'p-ada',
    start: 0,
    steps: [
      '>directory.zz', 'tidepool.zz', 'kelpforest.zz', 'otters.zz', '<kelpforest.zz', 'nightswim.zz',
      'weather.zz', 'lighthouse.zz', 'radio.zz', 'market.zz', 'sourdough.zz', 'ferment.zz',
      'garden.zz', 'compost.zz', '<garden.zz', 'market.zz', 'bikes.zz',
    ],
  },
  { person: 'p-farid', start: 6, steps: ['>weather.zz', 'radio.zz', 'lighthouse.zz', 'weather.zz'] },
  { person: 'p-esme', start: 9, steps: ['>tidepool.zz', 'kelpforest.zz', 'tidepool.zz', 'lighthouse.zz', 'weather.zz'] },
  { person: 'p-bruno', start: 14, steps: ['>sourdough.zz', 'ferment.zz', 'garden.zz', 'market.zz', 'sourdough.zz', 'bakery-hours.zz'] },
  { person: 'p-chen', start: 19, steps: ['>market.zz', 'bikes.zz', 'maps.zz', '<bikes.zz', 'weather.zz'] },
  { person: 'p-dara', start: 24, steps: ['?garden.zz', 'ferment.zz', 'sourdough.zz', 'market.zz', 'garden.zz'] },
  { person: 'p-esme', start: 31, steps: ['>tidepool.zz', 'harbourmaster.zz', '<tidepool.zz', 'market.zz'] },
  { person: 'p-farid', start: 37, steps: ['>radio.zz', 'nightswim.zz', 'kelpforest.zz', 'tidepool.zz', '<kelpforest.zz'] },
  { person: 'p-ada', start: 42, steps: ['^nightswim.zz', 'lighthouse.zz', 'oldmill.zz', '<lighthouse.zz', 'tidepool.zz'] },
  { person: 'p-bruno', start: 47, steps: ['>sourdough.zz', 'market.zz'] },
  { person: 'p-chen', start: 51, steps: ['>market.zz', 'radio.zz'] },
  { person: 'p-iris', start: 55, steps: ['>directory.zz', 'market.zz', 'tidepool.zz'] },
]

export const PREFIX: Record<string, 'typed' | 'search' | 'back' | 'history'> = {
  '>': 'typed',
  '?': 'search',
  '<': 'back',
  '^': 'history',
}

export function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
