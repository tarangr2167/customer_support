import { apiFetch } from './client';
import type { LoginResponse, MeResponse, SignupInput, User } from '../types/auth';

export function signup(input: SignupInput) {
  return apiFetch<LoginResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
    skipAuth: true,
  });
}

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
}

export function fetchMe() {
  return apiFetch<MeResponse>('/auth/me');
}

export function logout() {
  return apiFetch<{ ok: boolean }>('/auth/logout', { method: 'POST' });
}

export type { User };
