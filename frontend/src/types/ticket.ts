export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

export interface ActivityEntry {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  activity?: ActivityEntry[];
}

export interface TicketsListResponse {
  data: Ticket[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface Analytics {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  highPriority: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
}

export interface CreateTicketInput {
  customerName: string;
  email: string;
  subject: string;
  priority: TicketPriority;
}

export interface TicketQueryParams {
  search?: string;
  customerName?: string;
  subject?: string;
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
  page?: number;
  limit?: number;
}

export const PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High'];
export const STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Closed'];
