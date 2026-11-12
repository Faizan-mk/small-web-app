import { useEffect, useMemo, useRef } from 'react'
import { buildSrcDoc, newFrameToken } from '../lib/sandbox'

interface Props {
  html: string
  title: string
  visited: string[]

  restoreY: number
  onNavigate?(href: string): void
  onScroll?(y: number): void
  onHover?(href: string | null): void
  className?: string
}

export function SiteFrame({ html, title, visited, restoreY, onNavigate, onScroll, onHover, className }: Props) {
  const ref = useRef<HTMLIFrameElement>(null)
  const token = useMemo(() => newFrameToken(), [])
  const initialY = useRef(restoreY).current
  const srcDoc = useMemo(
    () => buildSrcDoc({ html, token, restoreY: initialY, visited: new Set(visited) }),
    [html, token, initialY, visited],
  )

  const handlers = useRef({ onNavigate, onScroll, onHover })
  handlers.current = { onNavigate, onScroll, onHover }

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!ref.current || e.source !== ref.current.contentWindow) return
      if (e.origin !== 'null') return
      const m = e.data as { channel?: unknown; token?: unknown; type?: unknown; href?: unknown; y?: unknown }
      if (!m || typeof m !== 'object' || m.channel !== 'smallweb' || m.token !== token) return
      const h = handlers.current
      if (m.type === 'navigate' && typeof m.href === 'string' && m.href.length < 2048) h.onNavigate?.(m.href)
      else if (m.type === 'scroll' && typeof m.y === 'number' && Number.isFinite(m.y)) h.onScroll?.(m.y)
      else if (m.type === 'hover' && (m.href === null || (typeof m.href === 'string' && m.href.length < 2048)))
        h.onHover?.(m.href as string | null)
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      handlers.current.onHover?.(null)
    }
  }, [token])

  return (
    <iframe
      ref={ref}
      className={className ?? 'site-frame'}
      title={title}
      srcDoc={srcDoc}

      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      allow=""
    />
  )
}
