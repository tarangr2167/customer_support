import { apiFetch } from './client';
import type {
  Analytics,
  CreateTicketInput,
  Ticket,
  TicketQueryParams,
  TicketsListResponse,
  TicketStatus,
} from '../types/ticket';

function buildQuery(params: TicketQueryParams): string {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.customerName) qs.set('customerName', params.customerName);
  if (params.subject) qs.set('subject', params.subject);
  if (params.status) qs.set('status', params.status);
  if (params.priority) qs.set('priority', params.priority);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export function fetchTickets(params: TicketQueryParams = {}) {
  return apiFetch<TicketsListResponse>(`/tickets${buildQuery(params)}`);
}

export function fetchTicket(id: string) {
  return apiFetch<Ticket>(`/tickets/${id}`);
}

export function createTicket(input: CreateTicketInput) {
  return apiFetch<Ticket>('/tickets', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTicketStatus(id: string, status: TicketStatus) {
  return apiFetch<Ticket>(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function fetchAnalytics() {
  return apiFetch<Analytics>('/analytics');
}
