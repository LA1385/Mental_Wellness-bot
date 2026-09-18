export function DashboardHeader() {
  return (
    <header className="mb-8 flex items-start justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sage">Student wellbeing</p>
        <h1 className="font-display text-4xl leading-none sm:text-5xl">Wellness Check</h1>
        <p className="mt-3 text-sm text-muted">Anonymous aggregate view for programme teams</p>
      </div>
      <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-panel px-3 py-2 text-xs font-bold uppercase tracking-wider text-sage shadow-sm">
        <span className="live-dot" aria-hidden="true" /> Live
      </span>
    </header>
  )
}