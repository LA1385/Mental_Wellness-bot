import { useEffect, useState } from 'react'
import { getDashboardStats } from './api/getDashboardStats'
import { DashboardHeader } from './components/dashboard/DashboardHeader'
import { LiveFeed } from './components/dashboard/LiveFeed'
import { StatCard } from './components/dashboard/StatCard'
import { TierBreakdown } from './components/dashboard/TierBreakdown'
import { TrendChart } from './components/dashboard/TrendChart'
import './App.css'

function App() {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    getDashboardStats().then((nextStats) => {
      setStats(nextStats); 
      setFlash(true); 
      window.setTimeout(() => setFlash(false), 900)
    })
  }, [])

  const totalResponses = Object.values(stats.tierCounts).reduce((sum, value) => sum + value, 0)
  const severePercentage = Math.round((stats.tierCounts.severe / totalResponses) * 100)

  return (
    <main className="min-h-screen bg-bg px-5 py-8 text-ink sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[960px]">
        <DashboardHeader />
        <section className="grid gap-4 sm:grid-cols-3" aria-label="Summary statistics">
          <StatCard label="Total sessions" value={stats.totalSessions} detail="Across all check-ins" tone="minimal_mild" flash={flash} />
          <StatCard label="Completion rate" value={`${stats.completionRatePct}%`} detail="Started to completed" tone="moderate" />
          <StatCard label="Flagged severe" value={`${severePercentage}%`} detail="Of all responses" tone="severe" />
        </section>
        <section className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <TrendChart dailySessions={stats.dailySessions} />
          <TierBreakdown tierCounts={stats.tierCounts} />
        </section>
        <section className="mt-4"><LiveFeed entries={stats.recentFeed} /></section>
        <footer className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-muted"><span aria-hidden="true">&#9670;</span> Zero personally identifiable information is collected or displayed</footer>
      </div>
    </main>
  )
}
export default App