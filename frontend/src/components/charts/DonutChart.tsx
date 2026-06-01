export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerValue?: string | number;
  centerLabel?: string;
}

export function DonutChart({
  segments,
  size = 200,
  strokeWidth = 28,
  centerValue,
  centerLabel,
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const dash = pct * circumference;
    const arc = {
      ...seg,
      dash,
      gap: circumference - dash,
      offset: -offset,
    };
    offset += dash;
    return arc;
  });

  return (
    <div className="donut-chart" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {arcs.map((arc) => (
            <circle
              key={arc.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={arc.offset}
              strokeLinecap="butt"
            />
          ))}
        </g>
      </svg>
      {(centerValue !== undefined || centerLabel) && (
        <div className="donut-chart__center">
          {centerValue !== undefined && (
            <span className="donut-chart__value">{centerValue}</span>
          )}
          {centerLabel && <span className="donut-chart__label">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

export function ChartLegend({ segments }: { segments: DonutSegment[] }) {
  return (
    <ul className="chart-legend">
      {segments.map((seg) => (
        <li key={seg.label}>
          <span className="chart-legend__dot" style={{ background: seg.color }} />
          <span className="chart-legend__label">{seg.label}</span>
          <span className="chart-legend__value">{seg.value}</span>
        </li>
      ))}
    </ul>
  );
}
