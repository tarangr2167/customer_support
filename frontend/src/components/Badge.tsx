import type { TicketPriority, TicketStatus } from '../types/ticket';

const priorityStyles: Record<TicketPriority, string> = {
  Low: 'badge--priority-low',
  Medium: 'badge--priority-medium',
  High: 'badge--priority-high',
};

const statusStyles: Record<TicketStatus, string> = {
  Open: 'badge--status-open',
  'In Progress': 'badge--status-progress',
  Closed: 'badge--status-closed',
};

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={`badge ${priorityStyles[priority]}`}>{priority}</span>;
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`badge ${statusStyles[status]}`}>{status}</span>;
}
