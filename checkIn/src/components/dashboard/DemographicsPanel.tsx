import { useState } from "react";
import {
  useDemographics,
  useSymptomsByAxis,
} from "../../hooks/useDashboardData";
import type { Axis } from "../../types/dashboard";
import { AxisSelector } from "./AxisSelector";
import { NotEnoughData } from "./NotEnoughData";
import { Panel } from "./Panel";

const severityKeys = ["minimal_mild", "moderate", "severe"] as const;

export function DemographicsPanel() {
  const [axis, setAxis] = useState<Axis>("faculty");
  const demographics = useDemographics(axis);
  const symptoms = useSymptomsByAxis(axis);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AxisSelector axis={axis} onAxisChange={setAxis} />
      </div>

      <Panel title="Severity by group" eyebrow="Aggregate severity responses">
        {demographics.loading && !demographics.data ? (
          <p className="mt-4 text-sm text-muted" aria-busy="true">
            Loading severity data...
          </p>
        ) : demographics.error && !demographics.data ? (
          <p className="mt-4 text-sm text-muted" role="alert">
            Couldn&apos;t load severity-by-group data.
          </p>
        ) : (
          <div className="mt-5 space-y-5">
            {demographics.data?.map((group) => (
              <div key={group.group}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{group.group}</h3>
                    <p className="text-xs text-muted">
                      {group.respondents} respondents
                    </p>
                  </div>
                  {group.severity_percent === null ? (
                    <NotEnoughData />
                  ) : null}
                </div>
                {group.severity_percent && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {severityKeys.map((severity) => (
                      <div key={severity} className="text-sm">
                        <span className="text-muted">{severity}: </span>
                        <strong>
                            {group.severity_percent?.[severity] != null
                            ? `${group.severity_percent[severity]}%`
                            : "N/A"}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Symptoms by group" eyebrow="Aggregate screening responses">
        {symptoms.loading && !symptoms.data ? (
          <p className="mt-4 text-sm text-muted" aria-busy="true">
            Loading symptom data...
          </p>
        ) : symptoms.error && !symptoms.data ? (
          <p className="mt-4 text-sm text-muted" role="alert">
            Couldn&apos;t load symptoms-by-group data.
          </p>
        ) : (
          <div className="mt-5 space-y-5">
            {symptoms.data?.map((group) => (
              <div key={group.group}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{group.group}</h3>
                    <p className="text-xs text-muted">
                      {group.respondents} respondents
                    </p>
                  </div>
                  {group.item_elevated_percent === null && <NotEnoughData />}
                </div>
                {group.item_elevated_percent && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {Object.entries(group.item_elevated_percent).map(
                      ([symptom, percentage]) => (
                        <div key={symptom} className="text-sm">
                          <span className="text-muted">{symptom}: </span>
                          <strong>{percentage}%</strong>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
