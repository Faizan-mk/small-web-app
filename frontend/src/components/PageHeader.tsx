import type { ReactNode } from 'react'

export function PageHeader({ eyebrow, title, children, tone = 'sea' }: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  tone?: 'sea' | 'sand' | 'dusk'
}) {
  return (
    <header className={`page-header tone-${tone}`}>
      <div className="page-header-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children}
      </div>
    </header>
  )
}
