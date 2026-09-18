import type { DashboardStats, Tier } from "../../types/dashboard";
import {
  tierBarClasses,
  tierMeta,
  tierOrder,
  tierTextClasses,
} from "../../types/dashboardConfig";
import { Panel } from "./Panel";

interface TierBreakdownProps {
  tierCounts: DashboardStats["tierCounts"];
}

export function TierBreakdown({ tierCounts }: TierBreakdownProps) {
  const totalTiers = Object.values(tierCounts).reduce(
    (sum, value) => sum + value,
    0,
  );

  return (
    <Panel title="Response mix" eyebrow="By triage tier">
      <div className="space-y-6 pt-3">
        {tierOrder.map((tier: Tier) => {
          const percentage = Math.round((tierCounts[tier] / totalTiers) * 100);
          return (
            <div key={tier}>
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span>{tierMeta[tier].label}</span>
                <span className={tierTextClasses[tier]}>{percentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg">
                <div
                  className={`h-full rounded-full ${tierBarClasses[tier]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
