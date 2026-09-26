import { useCorrelation } from "../../hooks/useDashboardData";
import { NotEnoughData } from "./NotEnoughData";
import { Panel } from "./Panel";

export function CorrelationCard() {
  const { data, loading, error } = useCorrelation();

  if (loading && !data) {
    return (
      <Panel title="Depression and anxiety relationship" eyebrow="Aggregate insight">
        <p className="mt-4 text-sm text-muted" aria-busy="true">
          Loading correlation data...
        </p>
      </Panel>
    );
  }

  if (error && !data) {
    return (
      <Panel title="Depression and anxiety relationship" eyebrow="Aggregate insight">
        <p className="mt-4 text-sm text-muted" role="alert">
          Couldn&apos;t load correlation data.
        </p>
      </Panel>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Panel title="Depression and anxiety relationship" eyebrow="Aggregate insight">
      {"error" in data ? (
        <p className="mt-4 text-sm">
          <NotEnoughData />
        </p>
      ) : (
        <div className="mt-4 space-y-2 text-sm">
          <p>
            Pearson correlation: <strong>{data.pearson_r}</strong>
          </p>
          <p className="text-muted">
            Based on {data.n} completed sessions.
          </p>
        </div>
      )}
    </Panel>
  );
}
