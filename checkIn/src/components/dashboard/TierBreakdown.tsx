import type { DashboardStats, Tier } from "../../types/dashboard";
import {
  tierBarClasses,
  tierMeta,
  tierOrder,
  tierTextClasses,
} from "../../types/dashboardConfig";
import { Panel } from "./Panel";

interface TierBreakdownProps {
  severity_breakdown: DashboardStats["severity_breakdown"];
  severity_percent: DashboardStats["severity_percent"];
}

export function TierBreakdown({
  severity_breakdown,
  severity_percent,
}: TierBreakdownProps) {
  return (
    <Panel title="Response mix" eyebrow="By triage tier">
      <div className="space-y-6 pt-3">
        {tierOrder.map((tier: Tier) => {
          const percentage = severity_percent[tier];
          return (
            <div key={tier}>
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span>{tierMeta[tier].label}</span>
                <span className={tierTextClasses[tier]}>
                  {severity_breakdown[tier]} ({percentage}%)
                </span>
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
