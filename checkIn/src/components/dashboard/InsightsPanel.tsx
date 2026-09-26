import { ComorbidityMatrix } from "./ComorbidityMatrix";
import { CorrelationCard } from "./CorrelationCard";

export function InsightsPanel() {
  return (
    <div className="space-y-4">
      <ComorbidityMatrix />
      <CorrelationCard />
    </div>
  );
}
