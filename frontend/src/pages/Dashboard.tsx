import { useMemo, useState } from 'react';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { TicketDetailDrawer } from '../components/TicketDetailDrawer';
import { Header } from '../components/layout/Header';
import { Sidebar, type AppView } from '../components/layout/Sidebar';
import { tempTickets } from '../data/tempTickets';
import type { Ticket } from '../types/ticket';
import { DashboardView } from './DashboardView';
import { TicketsView } from './TicketsView';

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

export function Dashboard() {
  const [view, setView] = useState<AppView>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>(tempTickets);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Ticket | null>(null);

  const dashboardTickets = useMemo(
    () => tickets.filter((t) => matchesSearch(t, search)),
    [tickets, search],
  );

  function handleCreate(data: Omit<Ticket, 'id' | 'status' | 'createdAt'>) {
    const nextId = String(
      Math.max(...tickets.map((t) => parseInt(t.id, 10) || 0), 0) + 1,
    );
    const newTicket: Ticket = {
      ...data,
      id: nextId,
      status: 'Open',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTickets((prev) => [newTicket, ...prev]);
  }

  return (
    <div className="app">
      <Sidebar active={view} onNavigate={setView} />

      <div className="app__main">
        <Header
          view={view}
          search={search}
          onSearchChange={setSearch}
          onAddTicket={() => setModalOpen(true)}
        />

        <main className="app__content">
          {view === 'dashboard' ? (
            <DashboardView
              tickets={dashboardTickets}
              onSelectTicket={setSelected}
            />
          ) : (
            <TicketsView
              tickets={tickets}
              globalSearch={search}
              onSelectTicket={setSelected}
            />
          )}
        </main>
      </div>

      <CreateTicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />

      <TicketDetailDrawer ticket={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
