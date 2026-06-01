import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { fetchTickets } from '../api/tickets';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TicketFilters, type FilterState } from '../components/TicketFilters';
import { TicketList } from '../components/TicketList';
import { useDebounce } from '../hooks/useDebounce';
import type { Ticket } from '../types/ticket';

const emptyFilters: FilterState = {
  customerName: '',
  subject: '',
  status: '',
  priority: '',
};

interface TicketsViewProps {
  globalSearch: string;
  onSelectTicket: (ticket: Ticket) => void;
}

export function TicketsView({ globalSearch, onSelectTicket }: TicketsViewProps) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const debouncedSearch = useDebounce(globalSearch, 300);
  const debouncedCustomer = useDebounce(filters.customerName, 300);
  const debouncedSubject = useDebounce(filters.subject, 300);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      customerName: debouncedCustomer || undefined,
      subject: debouncedSubject || undefined,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
    }),
    [debouncedSearch, debouncedCustomer, debouncedSubject, filters.status, filters.priority],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['tickets', queryParams],
    queryFn: () => fetchTickets(queryParams),
    placeholderData: (prev) => prev,
  });

  const tickets = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="page tickets-page">
      <div className="page-header">
        <h1>All tickets</h1>
        <p>
          {total} ticket{total === 1 ? '' : 's'} found
          {isFetching && !isLoading ? ' · updating…' : ''}
        </p>
      </div>

      <div className="panel">
        <TicketFilters filters={filters} onChange={setFilters} />

        {isLoading ? (
          <LoadingSpinner label="Loading tickets…" />
        ) : isError ? (
          <ErrorAlert
            message={error instanceof Error ? error.message : 'Failed to load tickets'}
            onRetry={() => refetch()}
          />
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <h3>No tickets found</h3>
            <p>Adjust your search or filters.</p>
          </div>
        ) : (
          <TicketList tickets={tickets} onSelect={onSelectTicket} />
        )}
      </div>
    </div>
  );
}
