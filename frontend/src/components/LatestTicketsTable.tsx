import type { Ticket } from '../types/ticket';
import { formatDate } from '../utils/format';
import { StatusBadge } from './Badge';

interface LatestTicketsTableProps {
  tickets: Ticket[];
  onSelect?: (ticket: Ticket) => void;
  limit?: number;
}

export function LatestTicketsTable({
  tickets,
  onSelect,
  limit = 6,
}: LatestTicketsTableProps) {
  const rows = tickets.slice(0, limit);

  return (
    <section className="latest-tickets" aria-labelledby="latest-tickets-title">
      <h2 id="latest-tickets-title" className="latest-tickets__title">
        Latest tickets
      </h2>

      <div className="latest-table-wrap">
        <table className="latest-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((ticket) => (
              <tr
                key={ticket.id}
                className="latest-table__row"
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

      <ul className="latest-cards">
        {rows.map((ticket) => (
          <li key={ticket.id}>
            <button
              type="button"
              className="latest-card"
              onClick={() => onSelect?.(ticket)}
            >
              <div className="latest-card__row">
                <span className="latest-table__id">#{ticket.id}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <strong>{ticket.customerName}</strong>
              <p>{ticket.subject}</p>
              <span className="latest-card__meta">{ticket.email}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
