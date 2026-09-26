import { useQuality } from "../../hooks/useDashboardData";
import { Panel } from "./Panel";

export function QualityPanel() {
  const { data, loading, error } = useQuality();

  if (loading && !data) {
    return (
      <Panel title="Data quality" eyebrow="Aggregate response checks">
        <p className="mt-4 text-sm text-muted" aria-busy="true">
          Loading quality data...
        </p>
      </Panel>
    );
  }

  if (error && !data) {
    return (
      <Panel title="Data quality" eyebrow="Aggregate response checks">
        <p className="mt-4 text-sm text-muted" role="alert">
          Couldn&apos;t load quality data.
        </p>
      </Panel>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Panel title="Data quality" eyebrow="Aggregate response checks">
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Speed runs</dt>
          <dd className="font-bold">
            {data.speed_run_count} ({data.speed_run_percent_of_completed}%)
          </dd>
        </div>
        <div>
          <dt className="text-muted">Incomplete sessions</dt>
          <dd className="font-bold">
            {data.incomplete_count} ({data.incomplete_percent}%)
          </dd>
        </div>
        <div>
          <dt className="text-muted">Distinct chat IDs</dt>
          <dd className="font-bold">{data.distinct_chat_ids}</dd>
        </div>
        <div>
          <dt className="text-muted">People with repeat check-ins</dt>
          <dd className="font-bold">{data.chat_ids_with_multiple_sessions}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-muted">
        Repeat check-ins are intended use of the tool and are not treated as suspicious activity.
      </p>
    </Panel>
  );
}
