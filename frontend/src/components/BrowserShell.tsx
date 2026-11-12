'use client'

import dynamic from 'next/dynamic'

const Browser = dynamic(() => import('./Browser'), {
  ssr: false,
  loading: () => <div className="boot" aria-busy="true" />,
})

export function BrowserShell() {
  return <Browser />
}
