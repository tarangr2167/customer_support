import { IconTrendUp } from './icons';
import type { Ticket } from '../types/ticket';

interface SummaryCardsProps {
  tickets: Ticket[];
}

function SummaryCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: number;
  trend: string;
}) {
  return (
    <article className="summary-card">
      <span className="summary-card__label">{label}</span>
      <span className="summary-card__value">{value}</span>
      <span className="summary-card__trend">
        <IconTrendUp />
        {trend}
      </span>
    </article>
  );
}

export function SummaryCards({ tickets }: SummaryCardsProps) {
  const open = tickets.filter((t) => t.status === 'Open').length;
  const inProgress = tickets.filter((t) => t.status === 'In Progress').length;
  const high = tickets.filter((t) => t.priority === 'High').length;

  return (
    <div className="summary-grid">
      <SummaryCard label="Open tickets" value={open} trend="↑ 12% Up from last hour" />
      <SummaryCard label="New tickets" value={tickets.length} trend="↑ 8% Up from yesterday" />
      <SummaryCard label="In progress" value={inProgress} trend="↑ 5% Up from last hour" />
      <SummaryCard label="High priority" value={high} trend="↑ 3% Up from last week" />
    </div>
  );
}
