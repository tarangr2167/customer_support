import { apiFetch } from './client';

export interface HealthResponse {
  ok: boolean;
  auth?: boolean;
  message?: string;
}

export function fetchHealth() {
  return apiFetch<HealthResponse>('/health', { skipAuth: true });
}
