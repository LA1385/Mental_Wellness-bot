import type { Axis } from "../../types/dashboard";

interface AxisSelectorProps {
  axis: Axis;
  onAxisChange: (axis: Axis) => void;
}

const axisOptions: { value: Axis; label: string }[] = [
  { value: "faculty", label: "Faculty" },
  { value: "gender", label: "Gender" },
  { value: "hall_of_residence", label: "Hall of residence" },
];

export function AxisSelector({ axis, onAxisChange }: AxisSelectorProps) {
  return (
    <label className="flex items-center gap-3 text-sm font-bold">
      <span>Group by</span>
      <select
        value={axis}
        onChange={(event) => onAxisChange(event.target.value as Axis)}
        className="rounded-md border border-line bg-panel px-3 py-2 font-normal text-ink"
      >
        {axisOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
