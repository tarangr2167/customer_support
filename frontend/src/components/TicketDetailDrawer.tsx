import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTicket, updateTicketStatus } from '../api/tickets';
import { getInitials, useAuth } from '../context/AuthContext';
import { canChangeTicketStatus } from '../lib/roles';
import type { TicketStatus } from '../types/ticket';
import { formatDate } from '../utils/format';
import { PriorityBadge, StatusBadge } from './Badge';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';
import { StatusPicker } from './StatusPicker';

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

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export function TicketDetailDrawer({ ticketId, onClose }: TicketDetailDrawerProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const canUpdateStatus = user ? canChangeTicketStatus(user.role) : false;

  const { data: ticket, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => fetchTicket(ticketId!),
    enabled: !!ticketId,
  });

  const statusMutation = useMutation({
    mutationFn: (status: TicketStatus) => updateTicketStatus(ticketId!, status),
    onMutate: async (newStatus) => {
      if (!canUpdateStatus) return { previous: undefined };
      await queryClient.cancelQueries({ queryKey: ['ticket', ticketId] });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof fetchTicket>>>([
        'ticket',
        ticketId,
      ]);
      if (previous) {
        queryClient.setQueryData(['ticket', ticketId], { ...previous, status: newStatus });
      }
      return { previous };
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['ticket', ticketId], updated);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (_err, _status, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['ticket', ticketId], context.previous);
      }
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
        <div className="drawer__accent" aria-hidden="true" />

        <header className="drawer__header">
          <div className="drawer__header-text">
            <span className="drawer__id">Ticket #{ticketId}</span>
            {ticket && (
              <h2 id="drawer-title" className="drawer__title">
                {ticket.subject}
              </h2>
            )}
          </div>
          <button
            type="button"
            className="drawer__close"
            onClick={onClose}
            aria-label="Close ticket details"
          >
            ×
          </button>
        </header>

        <div className="drawer__body">
          {isLoading && <LoadingSpinner label="Loading ticket…" />}

          {isError && (
            <ErrorAlert
              message={error instanceof Error ? error.message : 'Failed to load ticket'}
              onRetry={() => refetch()}
            />
          )}

          {ticket && (
            <>
              <div className="drawer__badges">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>

              <div className="drawer__customer">
                <span className="drawer__avatar" aria-hidden="true">
                  {getInitials(ticket.customerName)}
                </span>
                <div className="drawer__customer-info">
                  <span className="drawer__customer-label">Customer</span>
                  <strong>{ticket.customerName}</strong>
                  <a className="drawer__email" href={`mailto:${ticket.email}`}>
                    {ticket.email}
                  </a>
                </div>
              </div>

              <div className="drawer__status-card">
                <div className="drawer__status-head">
                  <span className="drawer__status-icon" aria-hidden="true">
                    ◉
                  </span>
                  <div>
                    <p className="drawer__status-label">
                      {canUpdateStatus ? 'Update status' : 'Current status'}
                    </p>
                    <p className="drawer__status-hint">
                      {canUpdateStatus
                        ? 'Tap a status — saves automatically'
                        : 'Only agents can change ticket status'}
                    </p>
                  </div>
                </div>

                {canUpdateStatus ? (
                  <>
                    <StatusPicker
                      value={ticket.status}
                      disabled={statusMutation.isPending}
                      onChange={(status) => statusMutation.mutate(status)}
                    />
                    {statusMutation.isPending && (
                      <span className="drawer__saving" aria-live="polite">
                        Saving…
                      </span>
                    )}
                    {statusMutation.isError && (
                      <p className="field-error" role="alert">
                        {statusMutation.error.message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="drawer__status-readonly">
                    <StatusBadge status={ticket.status} />
                  </div>
                )}
              </div>

              <section className="drawer__details" aria-labelledby="details-heading">
                <h3 id="details-heading">Ticket details</h3>
                <ul className="drawer-detail-grid">
                  <li className="drawer-detail-item">
                    <span className="drawer-detail-item__icon">
                      <IconTag />
                    </span>
                    <div>
                      <span className="drawer-detail-item__label">Subject</span>
                      <span className="drawer-detail-item__value">{ticket.subject}</span>
                    </div>
                  </li>
                  <li className="drawer-detail-item">
                    <span className="drawer-detail-item__icon">
                      <IconMail />
                    </span>
                    <div>
                      <span className="drawer-detail-item__label">Email</span>
                      <span className="drawer-detail-item__value">{ticket.email}</span>
                    </div>
                  </li>
                  <li className="drawer-detail-item">
                    <span className="drawer-detail-item__icon">
                      <IconCalendar />
                    </span>
                    <div>
                      <span className="drawer-detail-item__label">Created</span>
                      <span className="drawer-detail-item__value">
                        <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time>
                      </span>
                    </div>
                  </li>
                </ul>
              </section>

              <section className="drawer__activity" aria-labelledby="activity-heading">
                <h3 id="activity-heading">Activity history</h3>
                {!ticket.activity?.length ? (
                  <p className="drawer__empty-activity">
                    No activity yet. Status changes will appear here.
                  </p>
                ) : (
                  <ol className="activity-timeline">
                    {[...ticket.activity].reverse().map((entry, index) => (
                      <li key={entry.id} className="activity-timeline__item">
                        <span
                          className={`activity-timeline__dot ${index === 0 ? 'activity-timeline__dot--latest' : ''}`}
                          aria-hidden="true"
                        />
                        <div className="activity-timeline__content">
                          <p>{entry.message}</p>
                          <time dateTime={entry.timestamp}>
                            {formatTimestamp(entry.timestamp)}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
