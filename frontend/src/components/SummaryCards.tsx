import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '../api/tickets';
import { ErrorAlert } from './ErrorAlert';
import { IconTrendUp } from './icons';
import { LoadingSpinner } from './LoadingSpinner';

function SummaryCard({
  label,
  value,
  trend,
  accent,
}: {
  label: string;
  value: number;
  trend: string;
  accent: 'open' | 'total' | 'progress' | 'priority';
}) {
  return (
    <article className={`summary-card summary-card--${accent}`}>
      <span className="summary-card__label">{label}</span>
      <span className="summary-card__value">{value}</span>
      <span className="summary-card__trend">
        <IconTrendUp />
        {trend}
      </span>
    </article>
  );
}

export function SummaryCards() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  });

  if (isLoading) {
    return (
      <div className="summary-grid summary-grid--loading">
        <LoadingSpinner label="Loading stats…" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorAlert
        message={error instanceof Error ? error.message : 'Failed to load analytics'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  return (
    <div className="summary-grid">
      <SummaryCard label="Open tickets" value={data.open} trend="Live from API" accent="open" />
      <SummaryCard label="Total tickets" value={data.total} trend="All tickets" accent="total" />
      <SummaryCard label="In progress" value={data.inProgress} trend="Active work" accent="progress" />
      <SummaryCard label="High priority" value={data.highPriority} trend="Needs attention" accent="priority" />
    </div>
  );
}
