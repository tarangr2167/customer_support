import { getInitials, useAuth } from '../../context/AuthContext';
import type { AppView } from './Sidebar';
import { IconSearch } from '../icons';

interface HeaderProps {
  view: AppView;
  search: string;
  onSearchChange: (value: string) => void;
  onAddTicket: () => void;
}

const breadcrumbs: Record<AppView, string> = {
  dashboard: 'Dashboard',
  tickets: 'Tickets',
};

export function Header({ view, search, onSearchChange, onAddTicket }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="header">
      <p className="header__breadcrumb">
        {breadcrumbs[view]} <span aria-hidden="true">/</span>
      </p>

      <div className="header__search">
        <IconSearch />
        <input
          type="search"
          placeholder="Search tickets, customers…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search"
        />
      </div>

      <div className="header__actions">
        <button type="button" className="btn btn--primary" onClick={onAddTicket}>
          + Add Ticket
        </button>
        {user && (
          <div className="header__profile">
            <span className="header__avatar" aria-hidden="true">
              {getInitials(user.name)}
            </span>
            <span className="header__name">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
