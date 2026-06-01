export type UserRole = 'agent' | 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: 'agent' | 'customer';
}
