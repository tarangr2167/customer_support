import { IconDashboard, IconTickets } from '../icons';

export type AppView = 'dashboard' | 'tickets';

interface SidebarProps {
  active: AppView;
  onNavigate: (view: AppView) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true" />
        <span className="sidebar__brand-text">Ticket Support</span>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        <button
          type="button"
          className={`nav-item ${active === 'dashboard' ? 'nav-item--active' : ''}`}
          onClick={() => onNavigate('dashboard')}
          aria-current={active === 'dashboard' ? 'page' : undefined}
        >
          <IconDashboard />
          Dashboard
        </button>
        <button
          type="button"
          className={`nav-item ${active === 'tickets' ? 'nav-item--active' : ''}`}
          onClick={() => onNavigate('tickets')}
          aria-current={active === 'tickets' ? 'page' : undefined}
        >
          <IconTickets />
          Tickets
        </button>
      </nav>

      <div className="sidebar__user">
        <span className="sidebar__avatar" aria-hidden="true">
          TR
        </span>
        <div>
          <span className="sidebar__welcome">Welcome back</span>
          <strong>Tarang Ramoliya</strong>
        </div>
      </div>
    </aside>
  );
}
