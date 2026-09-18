import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  eyebrow: string
  children: ReactNode
}

export function Panel({ title, eyebrow, children }: PanelProps) {
  return (
    <div className="rounded-[14px] border border-line bg-panel p-5 shadow-[0_6px_24px_rgba(28,35,31,0.04)] sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-bold">{title}</h2>
      {children}
    </div>
  )
}