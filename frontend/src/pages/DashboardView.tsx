import { useQuery } from '@tanstack/react-query';
import { fetchTickets } from '../api/tickets';
import { ChartsSection } from '../components/ChartsSection';
import { ErrorAlert } from '../components/ErrorAlert';
import { LatestTicketsTable } from '../components/LatestTicketsTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SummaryCards } from '../components/SummaryCards';
import { useDebounce } from '../hooks/useDebounce';
import type { Ticket } from '../types/ticket';

interface DashboardViewProps {
  search: string;
  onSelectTicket: (ticket: Ticket) => void;
}

export function DashboardView({ search, onSelectTicket }: DashboardViewProps) {
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['tickets', { search: debouncedSearch }],
    queryFn: () => fetchTickets({ search: debouncedSearch || undefined }),
    placeholderData: (prev) => prev,
  });

  const tickets = data?.data ?? [];

  return (
    <div className="page dashboard-page">
      <SummaryCards />

      {isFetching && !isLoading && (
        <p className="fetching-hint" aria-live="polite">
          Updating tickets…
        </p>
      )}

      {isLoading ? (
        <LoadingSpinner label="Loading tickets…" />
      ) : isError ? (
        <ErrorAlert
          message={error instanceof Error ? error.message : 'Failed to load tickets'}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <ChartsSection tickets={tickets} />
          {tickets.length === 0 ? (
            <div className="empty-state">
              <h3>No tickets found</h3>
              <p>Try a different search or create a new ticket.</p>
            </div>
          ) : (
            <LatestTicketsTable tickets={tickets} onSelect={onSelectTicket} />
          )}
        </>
      )}
    </div>
  );
}
