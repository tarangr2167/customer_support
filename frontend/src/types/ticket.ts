export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

export interface Ticket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
}

export const PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High'];
export const STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Closed'];
