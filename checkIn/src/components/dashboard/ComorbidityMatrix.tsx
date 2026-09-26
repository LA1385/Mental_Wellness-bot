import { useComorbidity } from "../../hooks/useDashboardData";
import { NotEnoughData } from "./NotEnoughData";
import { Panel } from "./Panel";

const severityLevels = ["Minimal", "Mild", "Moderate", "Severe"];

export function ComorbidityMatrix() {
  const { data, loading, error } = useComorbidity();

  if (loading && !data) {
    return (
      <Panel title="Depression and anxiety together" eyebrow="Aggregate insight">
        <p className="mt-4 text-sm text-muted" aria-busy="true">
          Loading comorbidity data...
        </p>
      </Panel>
    );
  }

  if (error && !data) {
    return (
      <Panel title="Depression and anxiety together" eyebrow="Aggregate insight">
        <p className="mt-4 text-sm text-muted" role="alert">
          Couldn&apos;t load comorbidity data.
        </p>
      </Panel>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Panel title="Depression and anxiety together" eyebrow="Aggregate insight">
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <caption className="mb-3 text-left text-xs text-muted">
            Completed sessions by depression and anxiety severity.
          </caption>
          <thead>
            <tr>
              <th className="border-b border-line p-2 text-left">Depression / Anxiety</th>
              {severityLevels.map((level) => (
                <th key={level} className="border-b border-line p-2 text-left">
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {severityLevels.map((depressionLevel) => (
              <tr key={depressionLevel}>
                <th className="border-b border-line p-2 text-left">
                  {depressionLevel}
                </th>
                {severityLevels.map((anxietyLevel) => {
                  const combination = `${depressionLevel}__${anxietyLevel}`;
                  const count = data[combination];

                  return (
                    <td key={combination} className="border-b border-line p-2">
                      {count === undefined ? (
                        <NotEnoughData />
                      ) : (
                        count
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
