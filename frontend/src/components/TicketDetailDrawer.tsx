import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTicket, updateTicketStatus } from '../api/tickets';
import { STATUSES, type TicketStatus } from '../types/ticket';
import { formatDate } from '../utils/format';
import { PriorityBadge, StatusBadge } from './Badge';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';

interface TicketDetailDrawerProps {
  ticketId: string | null;
  onClose: () => void;
}

function formatTimestamp(ts: string) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function TicketDetailDrawer({ ticketId, onClose }: TicketDetailDrawerProps) {
  const queryClient = useQueryClient();

  const { data: ticket, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => fetchTicket(ticketId!),
    enabled: !!ticketId,
  });

  const statusMutation = useMutation({
    mutationFn: (status: TicketStatus) => updateTicketStatus(ticketId!, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(['ticket', ticketId], updated);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  if (!ticketId) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="drawer"
        role="dialog"
        aria-labelledby="drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && <LoadingSpinner label="Loading ticket…" />}

        {isError && (
          <ErrorAlert
            message={error instanceof Error ? error.message : 'Failed to load ticket'}
            onRetry={() => refetch()}
          />
        )}

        {ticket && (
          <>
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

            <div className="drawer__status">
              <label htmlFor="status-select">Update status</label>
              <select
                id="status-select"
                value={ticket.status}
                disabled={statusMutation.isPending}
                onChange={(e) =>
                  statusMutation.mutate(e.target.value as TicketStatus)
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {statusMutation.isPending && (
                <span className="drawer__saving">Saving…</span>
              )}
              {statusMutation.isError && (
                <p className="field-error" role="alert">
                  {statusMutation.error.message}
                </p>
              )}
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

            <section className="drawer__activity" aria-labelledby="activity-heading">
              <h3 id="activity-heading">Activity history</h3>
              {!ticket.activity?.length ? (
                <p className="drawer__empty-activity">No activity yet.</p>
              ) : (
                <ol className="activity-list">
                  {[...ticket.activity].reverse().map((entry) => (
                    <li key={entry.id}>
                      <p>{entry.message}</p>
                      <time dateTime={entry.timestamp}>{formatTimestamp(entry.timestamp)}</time>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}
      </aside>
    </div>
  );
}
