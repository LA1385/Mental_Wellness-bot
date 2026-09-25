
import { useEffect, useState } from 'react';

import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { LiveFeed } from './components/dashboard/LiveFeed';
import { StatCard } from './components/dashboard/StatCard';
import { TierBreakdown } from './components/dashboard/TierBreakdown';
import { TrendChart } from './components/dashboard/TrendChart';

import { useDailyTrend, useOverallStats } from './hooks/useDashboardData';

import './App.css';

function App() {
  // 1. State
  const overallStats = useOverallStats(7);
  const dailyTrend = useDailyTrend(7);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (overallStats.data && dailyTrend.data) {
      setLastUpdated(new Date());
    }
  }, [overallStats.data, dailyTrend.data]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      overallStats.refetch();
      dailyTrend.refetch();
    }, 12000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [overallStats.refetch, dailyTrend.refetch]);

  const isLoading = overallStats.loading || dailyTrend.loading;
  const error = overallStats.error ?? dailyTrend.error;
  const stats = overallStats.data;
  const daily = dailyTrend.data;

  // 3. Display loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg px-5 py-8 text-ink sm:px-8 sm:py-12">
        <div className="mx-auto max-w-[960px]" aria-busy="true">
          Loading dashboard data...
        </div>
      </main>
    );
  }

  // 4. Display error state
  if (error || !stats || !daily) {
    return (
      <main className="min-h-screen bg-bg px-5 py-8 text-ink sm:px-8 sm:py-12">
        <div className="mx-auto max-w-[960px]" role="alert">
          Couldn't reach the server.
          {error && <p>{error.message}</p>}
        </div>
      </main>
    );
  }

  // 5. Display dashboard
  return (
    <main className="min-h-screen bg-bg px-5 py-8 text-ink sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[960px]">

        <DashboardHeader window={stats.window} />

        <section
          className="grid gap-4 sm:grid-cols-3"
          aria-label="Summary statistics"
        >
          <StatCard
            label="Total sessions"
            value={stats.total_sessions}
            detail="Across all check-ins"
            tone="minimal_mild"
          />

          <StatCard
            label="Completion rate"
            value={`${stats.completion_rate_percent}%`}
            detail="Started to completed"
            tone="moderate"
          />

          <StatCard
            label="Flagged severe"
            value={`${stats.severity_percent.severe}%`}
            detail="Of completed sessions"
            tone="severe"
          />
        </section>

        <section
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Session status"
        >
          <StatCard
            label="Completed sessions"
            value={stats.completed_sessions}
            detail="Completed check-ins"
            tone="minimal_mild"
          />
          <StatCard
            label="In progress"
            value={stats.in_progress_sessions}
            detail="Currently active"
            tone="moderate"
          />
          <StatCard
            label="Expired sessions"
            value={stats.expired_sessions}
            detail="Not completed in time"
            tone="severe"
          />
          <StatCard
            label="Self-harm overrides"
            value={stats.self_harm_override_count}
            detail="Included in severe count"
            tone="severe"
          />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <TrendChart daily={daily} />

          <TierBreakdown
            severity_breakdown={stats.severity_breakdown}
            severity_percent={stats.severity_percent}
          />
        </section>

        {lastUpdated && (
          <section className="mt-4">
            <LiveFeed lastUpdated={lastUpdated} />
          </section>
        )}

        <footer className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-muted">
          <span aria-hidden="true">&#9670;</span>
          Zero personally identifiable information is collected or displayed
        </footer>

      </div>
    </main>
  );
}

export default App;