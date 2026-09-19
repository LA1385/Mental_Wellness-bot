
import { useState, useEffect } from 'react';

import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { LiveFeed } from './components/dashboard/LiveFeed';
import { StatCard } from './components/dashboard/StatCard';
import { TierBreakdown } from './components/dashboard/TierBreakdown';
import { TrendChart } from './components/dashboard/TrendChart';

import { getDashboardStats } from './api/getDashboardStats';

import type { DashboardStats, DailyStats } from './types/dashboard';

import './App.css';

function App() {
  // 1. State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    window: '',
    total_sessions: 0,
    completed_sessions: 0,
    in_progress_sessions: 0,
    expired_sessions: 0,
    completion_rate_percent: 0,
    severity_breakdown: {
      minimal_mild: 0,
      moderate: 0,
      severe: 0,
    },
    severity_percent: {
      minimal_mild: 0,
      moderate: 0,
      severe: 0,
    },
    self_harm_override_count: 0,
  });

  const [daily, setDaily] = useState<DailyStats>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  // 2. Fetch dashboard data
  useEffect(() => {
    async function loadDashboard(isInitialLoad = false) {
      try {
        if (isInitialLoad) {
          setIsLoading(true);
        }

        // Fetch data from the API
        const data = await getDashboardStats();

        // Store the returned data in state
        setStats(data.stats);
        setDaily(data.daily);

        // Record when the data was received
        setLastUpdated(new Date());

        setRefreshError(null); // Clear any previous refresh errors
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to refresh dashboard data';

        if (isInitialLoad) {
          setError(message);
        } else {
          setRefreshError(message);
        }
      }

      finally {
        if (isInitialLoad) {
          setIsLoading(false);
        }
      }
    }

    // Load data when component mounts
    loadDashboard(true);

    // Refresh data every 12 seconds
    const intervalId = setInterval(() => {
      loadDashboard();
    }, 12000);

    // Cleanup when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
  if (error) {
    return (
      <main className="min-h-screen bg-bg px-5 py-8 text-ink sm:px-8 sm:py-12">
        <div className="mx-auto max-w-[960px]" role="alert">
          Couldn't reach the server.
          <p>{error}</p>
        </div>
      </main>
    );
  }

  // 5. Display dashboard
  return (
    <main className="min-h-screen bg-bg px-5 py-8 text-ink sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[960px]">

        <DashboardHeader window={stats.window} />

        {refreshError && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700" role="alert">
            Failed to refresh dashboard: {refreshError}
          </div>
        )}

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