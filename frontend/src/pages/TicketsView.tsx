import { useMemo, useState } from 'react';
import { TicketFilters, type FilterState } from '../components/TicketFilters';
import { TicketList } from '../components/TicketList';
import type { Ticket } from '../types/ticket';

const emptyFilters: FilterState = {
  customerName: '',
  subject: '',
  status: '',
  priority: '',
};

interface TicketsViewProps {
  tickets: Ticket[];
  globalSearch: string;
  onSelectTicket: (ticket: Ticket) => void;
}

function matchesSearch(ticket: Ticket, q: string) {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  return (
    ticket.customerName.toLowerCase().includes(s) ||
    ticket.subject.toLowerCase().includes(s) ||
    ticket.email.toLowerCase().includes(s) ||
    ticket.id.includes(s)
  );
}

function filterTickets(tickets: Ticket[], filters: FilterState) {
  return tickets.filter((t) => {
    const name = filters.customerName.trim().toLowerCase();
    const subj = filters.subject.trim().toLowerCase();
    if (name && !t.customerName.toLowerCase().includes(name)) return false;
    if (subj && !t.subject.toLowerCase().includes(subj)) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    return true;
  });
}

export function TicketsView({ tickets, globalSearch, onSelectTicket }: TicketsViewProps) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  const filtered = useMemo(() => {
    const byFilters = filterTickets(tickets, filters);
    return byFilters.filter((t) => matchesSearch(t, globalSearch));
  }, [tickets, filters, globalSearch]);

  return (
    <div className="page tickets-page">
      <div className="page-header">
        <h1>All tickets</h1>
        <p>{filtered.length} tickets found</p>
      </div>

      <div className="panel">
        <TicketFilters filters={filters} onChange={setFilters} />

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No tickets found</h3>
            <p>Adjust your search or filters.</p>
          </div>
        ) : (
          <TicketList tickets={filtered} onSelect={onSelectTicket} />
        )}
      </div>
    </div>
  );
}
