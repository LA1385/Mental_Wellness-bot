import { Panel } from "./Panel";

type LiveFeedProps = {
  lastUpdated: Date;
}

export function LiveFeed({ lastUpdated }: LiveFeedProps) {
  return (
    <Panel title="Dashboard status" eyebrow="Aggregate data">
      <p className="mt-4 text-sm text-muted">
        Last updated {lastUpdated.toLocaleTimeString()}
      </p>
    </Panel>
  );
}
