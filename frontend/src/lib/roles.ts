import type { UserRole } from '../types/auth';

export const SIGNUP_ROLES = ['agent', 'customer'] as const;
export type SignupRole = (typeof SIGNUP_ROLES)[number];

export function canChangeTicketStatus(role: UserRole): boolean {
  return role === 'agent' || role === 'admin';
}

export function formatRole(role: UserRole): string {
  if (role === 'admin') return 'Admin';
  if (role === 'agent') return 'Agent';
  return 'Customer';
}
