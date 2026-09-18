import type { DashboardStats } from "../../types/dashboard";
import {
  tierBarClasses,
  tierMeta,
  tierSoftClasses,
  tierTextClasses,
} from "../../types/dashboardConfig";
import { Panel } from "./Panel";

interface LiveFeedProps {
  entries: DashboardStats["recentFeed"];
}

export function LiveFeed({ entries }: LiveFeedProps) {
  return (
    <Panel title="Live activity" eyebrow="Latest anonymous check-ins">
      <div className="grid gap-x-8 sm:grid-cols-2">
        {entries.slice(0, 8).map((item, index) => (
          <div className="feed-row" key={`${item.timestamp}-${index}`}>
            <span
              className={`h-2.5 w-2.5 rounded-full ${tierBarClasses[item.tier]}`}
              aria-hidden="true"
            />
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-bold ${tierSoftClasses[item.tier]} ${tierTextClasses[item.tier]}`}
            >
              {tierMeta[item.tier].label}
            </span>
            <span className="ml-auto text-xs text-muted">{item.timestamp}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
