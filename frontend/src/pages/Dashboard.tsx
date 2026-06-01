import { useState } from 'react';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { TicketDetailDrawer } from '../components/TicketDetailDrawer';
import { Header } from '../components/layout/Header';
import { Sidebar, type AppView } from '../components/layout/Sidebar';
import type { Ticket } from '../types/ticket';
import { DashboardView } from './DashboardView';
import { TicketsView } from './TicketsView';

export function Dashboard() {
  const [view, setView] = useState<AppView>('dashboard');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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
            <DashboardView search={search} onSelectTicket={setSelectedTicket} />
          ) : (
            <TicketsView globalSearch={search} onSelectTicket={setSelectedTicket} />
          )}
        </main>
      </div>

      <CreateTicketModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <TicketDetailDrawer
        ticketId={selectedTicket?.id ?? null}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}
