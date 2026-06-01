import type { Ticket } from '../types/ticket';
import { formatDate } from '../utils/format';
import { PriorityBadge, StatusBadge } from './Badge';

interface TicketListProps {
  tickets: Ticket[];
  onSelect?: (ticket: Ticket) => void;
}

export function TicketList({ tickets, onSelect }: TicketListProps) {
  return (
    <>
      <div className="ticket-table-wrap">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="ticket-row"
                onClick={() => onSelect?.(ticket)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect?.(ticket);
                  }
                }}
              >
                <td className="latest-table__id">#{ticket.id}</td>
                <td>{ticket.customerName}</td>
                <td className="latest-table__email">{ticket.email}</td>
                <td>{ticket.subject}</td>
                <td>
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td>
                  <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time>
                </td>
                <td>
                  <StatusBadge status={ticket.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="ticket-cards" aria-label="Tickets">
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <button
              type="button"
              className="ticket-card"
              onClick={() => onSelect?.(ticket)}
            >
              <div className="ticket-card__row">
                <span className="latest-table__id">#{ticket.id}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <strong>{ticket.customerName}</strong>
              <p>{ticket.subject}</p>
              <span className="ticket-card__meta">{ticket.email}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
