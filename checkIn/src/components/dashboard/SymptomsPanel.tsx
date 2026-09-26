import { useSymptoms } from "../../hooks/useDashboardData";
import { Panel } from "./Panel";

type SymptomLabel = {
  [key: string]: string;
};

const symptomLabels: SymptomLabel = {
  anhedonia: "loss of interest or pleasure",
  low_mood: "low mood or hopelessness",
  sleep_problems: "sleep problems",
  fatigue: "fatigue or low energy",
  appetite_change: "appetite change",
  low_self_worth: "low self-worth",
  concentration_problems: "concentration problems",
  psychomotor_changes: "psychomotor changes",
  self_harm_ideation: "self-harm thoughts",
  nervousness: "nervousness or anxiety",
  uncontrollable_worry: "uncontrollable worry",
  excessive_worry: "excessive worry",
  trouble_relaxing: "trouble relaxing",
  restlessness: "restlessness",
  irritability: "irritability",
  fear_of_impending_doom: "fear that something bad may happen",
};

export function SymptomsPanel() {
  const { data, loading, error } = useSymptoms();

  if (loading && !data) {
    return (
      <Panel title="Symptoms reported" eyebrow="Aggregate screening responses">
        <p className="mt-4 text-sm text-muted" aria-busy="true">
          Loading symptom data...
        </p>
      </Panel>
    );
  }

  if (error && !data) {
    return (
      <Panel title="Symptoms reported" eyebrow="Aggregate screening responses">
        <p className="mt-4 text-sm text-muted" role="alert">
          Couldn&apos;t load symptom data.
        </p>
      </Panel>
    );
  }

  if (!data) {
    return null;
  }

  const rankedSymptoms = [...data].sort(
    (first, second) => second.elevated_percent - first.elevated_percent,
  );

  return (
    <Panel title="Symptoms reported" eyebrow="Aggregate screening responses">
      <div className="mt-5 space-y-4">
        {rankedSymptoms.map((item) => {
          const label = symptomLabels[item.symptom] ?? item.symptom;

          return (
            <div key={item.symptom}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span>Elevated {label} reported</span>
                <span className="shrink-0 font-bold text-sage">
                  {item.elevated_percent}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg">
                <div
                  className="h-full rounded-full bg-sage"
                  style={{ width: `${item.elevated_percent}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted">
                {item.respondents} respondents
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
