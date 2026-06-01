import type { Ticket } from '../types/ticket';
import { ChartLegend, DonutChart, type DonutSegment } from './charts/DonutChart';

const GREEN = '#10b981';
const GREEN_LIGHT = '#6ee7b7';
const GREEN_DARK = '#059669';
const GRAY = '#94a3b8';
const GRAY_DARK = '#475569';

const STATUS_COLORS: Record<string, string> = {
  Open: '#38bdf8',
  'In Progress': '#fbbf24',
  Closed: GREEN,
};

const PRIORITY_COLORS: Record<string, string> = {
  Low: GRAY,
  Medium: '#fbbf24',
  High: '#f87171',
};

interface ChartsSectionProps {
  tickets: Ticket[];
}

function buildSegments(
  items: { label: string; value: number }[],
  colors: Record<string, string>,
  fallback: string[],
): DonutSegment[] {
  return items
    .filter((i) => i.value > 0)
    .map((item, idx) => ({
      label: item.label,
      value: item.value,
      color: colors[item.label] ?? fallback[idx % fallback.length],
    }));
}

export function ChartsSection({ tickets }: ChartsSectionProps) {
  const total = tickets.length;

  const volumeSegments: DonutSegment[] = [
    { label: 'Open', value: tickets.filter((t) => t.status === 'Open').length, color: GREEN },
    {
      label: 'In Progress',
      value: tickets.filter((t) => t.status === 'In Progress').length,
      color: GREEN_LIGHT,
    },
    { label: 'Closed', value: tickets.filter((t) => t.status === 'Closed').length, color: GREEN_DARK },
    { label: 'High', value: tickets.filter((t) => t.priority === 'High').length, color: GRAY_DARK },
  ].filter((s) => s.value > 0);

  if (volumeSegments.length === 0) {
    volumeSegments.push({ label: 'Empty', value: 1, color: GRAY });
  }

  const statusItems = [
    { label: 'Open', value: tickets.filter((t) => t.status === 'Open').length },
    { label: 'In Progress', value: tickets.filter((t) => t.status === 'In Progress').length },
    { label: 'Closed', value: tickets.filter((t) => t.status === 'Closed').length },
  ];

  const priorityItems = [
    { label: 'Low', value: tickets.filter((t) => t.priority === 'Low').length },
    { label: 'Medium', value: tickets.filter((t) => t.priority === 'Medium').length },
    { label: 'High', value: tickets.filter((t) => t.priority === 'High').length },
  ];

  const statusSegments = buildSegments(statusItems, STATUS_COLORS, [
    GREEN,
    GREEN_LIGHT,
    GREEN_DARK,
  ]);
  const prioritySegments = buildSegments(priorityItems, PRIORITY_COLORS, [
    GRAY,
    '#fbbf24',
    '#f87171',
  ]);

  const safeStatus =
    statusSegments.length > 0 ? statusSegments : [{ label: 'None', value: 1, color: GRAY }];
  const safePriority =
    prioritySegments.length > 0 ? prioritySegments : [{ label: 'None', value: 1, color: GRAY }];

  return (
    <section className="charts-section" aria-label="Ticket charts">
      <article className="chart-card chart-card--large">
        <h3 className="chart-card__title">Tickets volumes</h3>
        <div className="chart-card__body chart-card__body--donut">
          <DonutChart
            segments={volumeSegments}
            size={220}
            strokeWidth={32}
            centerValue={total}
            centerLabel="Total"
          />
          <ChartLegend segments={volumeSegments} />
        </div>
      </article>

      <div className="charts-stack">
        <article className="chart-card chart-card--small">
          <h3 className="chart-card__title">Tickets by status</h3>
          <div className="chart-card__body chart-card__body--compact">
            <DonutChart
              segments={safeStatus}
              size={120}
              strokeWidth={18}
            />
            <ChartLegend segments={safeStatus} />
          </div>
        </article>

        <article className="chart-card chart-card--small">
          <h3 className="chart-card__title">Tickets by priority</h3>
          <div className="chart-card__body chart-card__body--compact">
            <DonutChart
              segments={safePriority}
              size={120}
              strokeWidth={18}
            />
            <ChartLegend segments={safePriority} />
          </div>
        </article>
      </div>
    </section>
  );
}
