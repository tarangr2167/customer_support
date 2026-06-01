import type { Ticket } from '../types/ticket';
import { formatDate } from '../utils/format';
import { PriorityBadge, StatusBadge } from './Badge';

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export function TicketDetailDrawer({ ticket, onClose }: TicketDetailDrawerProps) {
  if (!ticket) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="drawer"
        role="dialog"
        aria-labelledby="drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="drawer__header">
          <div>
            <p className="drawer__id">Ticket #{ticket.id}</p>
            <h2 id="drawer-title">{ticket.subject}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="drawer__badges">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>

        <dl className="detail-list">
          <div>
            <dt>Customer</dt>
            <dd>{ticket.customerName}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{ticket.email}</dd>
          </div>
          <div>
            <dt>Subject</dt>
            <dd>{ticket.subject}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>
              <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time>
            </dd>
          </div>
        </dl>

        <div className="drawer__hint">
          <p>Status updates and activity history will connect when the API is added.</p>
        </div>
      </aside>
    </div>
  );
}
