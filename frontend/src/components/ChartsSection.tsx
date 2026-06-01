import type { Ticket } from '../types/ticket';
import { ChartLegend, DonutChart, type DonutSegment } from './charts/DonutChart';

const GREEN = '#10b981';
const GREEN_LIGHT = '#6ee7b7';
const GREEN_DARK = '#059669';
const GRAY = '#94a3b8';

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
      <article className="chart-card">
        <h3 className="chart-card__title">Tickets by status</h3>
        <div className="chart-card__body chart-card__body--donut">
          <DonutChart segments={safeStatus} size={160} strokeWidth={24} />
          <ChartLegend segments={safeStatus} />
        </div>
      </article>

      <article className="chart-card">
        <h3 className="chart-card__title">Tickets by priority</h3>
        <div className="chart-card__body chart-card__body--donut">
          <DonutChart segments={safePriority} size={160} strokeWidth={24} />
          <ChartLegend segments={safePriority} />
        </div>
      </article>
    </section>
  );
}
