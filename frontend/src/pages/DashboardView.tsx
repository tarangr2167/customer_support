import { ChartsSection } from '../components/ChartsSection';
import { LatestTicketsTable } from '../components/LatestTicketsTable';
import { SummaryCards } from '../components/SummaryCards';
import type { Ticket } from '../types/ticket';

interface DashboardViewProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export function DashboardView({ tickets, onSelectTicket }: DashboardViewProps) {
  return (
    <div className="page dashboard-page">
      <SummaryCards tickets={tickets} />
      <ChartsSection tickets={tickets} />
      <LatestTicketsTable tickets={tickets} onSelect={onSelectTicket} />
    </div>
  );
}
