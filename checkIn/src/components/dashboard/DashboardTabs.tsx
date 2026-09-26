import type { ReactNode } from "react";

export type DashboardTab =
  | "overview"
  | "symptoms"
  | "demographics"
  | "insights"
  | "quality";

type TabDefinition = {
  id: DashboardTab;
  label: string;
};

const tabs: TabDefinition[] = [
  { id: "overview", label: "Overview" },
  { id: "symptoms", label: "Symptoms" },
  { id: "demographics", label: "Demographics" },
  { id: "insights", label: "Insights" },
  { id: "quality", label: "Data quality" }
];

type DashboardTabsProps = {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  children: ReactNode;
};

export function DashboardTabs({
  activeTab,
  onTabChange,
  children,
}: DashboardTabsProps) {
  return (
    <>
      <nav aria-label="Dashboard sections" className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-1 border-b border-line">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                className={`border-b-2 px-3 py-3 text-sm font-bold transition-colors ${
                  isActive
                    ? "border-sage text-sage"
                    : "border-transparent text-muted hover:text-ink"
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
      {children}
    </>
  );
}
