import type { Tier } from "../../types/dashboard";
import { tierBarClasses, tierMeta } from "../../types/dashboardConfig";

interface StatCardProps {
  label: string;
  value: string | number;
  detail: string;
  tone: Tier;
  flash?: boolean;
}

export function StatCard({
  label,
  value,
  detail,
  tone,
  flash = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-[14px] border border-line border-t-4 ${tierBarClasses[tone]} bg-panel p-5 shadow-[0_6px_24px_rgba(28,35,31,0.04)] ${flash ? "stat-flash" : ""}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted">{detail}</p>
      <span className="sr-only">{tierMeta[tone].label} priority styling</span>
    </div>
  );
}
