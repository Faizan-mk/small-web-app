const LABEL = '[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?'
export const ADDRESS_RE = new RegExp(`^(?:${LABEL}\\.)+[a-z]{2,12}$`)

export function normalizeAddress(raw: string): string {
  return raw.trim().toLowerCase().replace(/^zz:\/\//, '').replace(/\/+$/, '')
}

export function addressWords(address: string): string {
  return address.split('.').slice(0, -1).join(' ').replace(/-/g, ' ')
}
