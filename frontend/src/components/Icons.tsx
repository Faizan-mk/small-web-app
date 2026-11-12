import type { ReactNode } from 'react'

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export const BackIcon = () => <Svg><path d="M19 12H5M12 19l-7-7 7-7" /></Svg>
export const ForwardIcon = () => <Svg><path d="M5 12h14M12 5l7 7-7 7" /></Svg>
export const ReloadIcon = () => <Svg><path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" /></Svg>
export const StopIcon = () => <Svg><path d="M18 6 6 18M6 6l12 12" /></Svg>
export const HomeIcon = () => <Svg><path d="M3 11 12 3l9 8M5 9.5V21h5v-6h4v6h5V9.5" /></Svg>
export const HistoryIcon = () => <Svg><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 3" /></Svg>
export const PublishIcon = () => <Svg><path d="M12 19V5M5 12l7-7 7 7M5 21h14" /></Svg>
export const TrailIcon = () => <Svg><path d="M6 4v16M6 8h8a4 4 0 0 1 0 8H6" /></Svg>
export const GlobeIcon = () => <Svg><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9z" /></Svg>
export const WarnIcon = () => <Svg><path d="M12 3 2 21h20L12 3zM12 10v5M12 18h.01" /></Svg>
export const GearIcon = () => <Svg><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></Svg>
export const SearchIcon = () => <Svg><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Svg>
export const MenuIcon = () => <Svg><path d="M4 7h16M4 12h16M4 17h16" /></Svg>
export const ArrowIcon = () => <Svg><path d="M7 17 17 7M8 7h9v9" /></Svg>
