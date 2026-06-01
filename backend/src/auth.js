import crypto from 'crypto';
import { readUsers, writeUsers } from './userStore.js';

/** In-memory sessions: token -> public user profile */
const sessions = new Map();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ['agent', 'admin'];

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  const profile = publicUser(user);
  sessions.set(token, profile);
  return { token, user: profile };
}

export function validateSignup(body) {
  const errors = {};
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email)) errors.email = 'Invalid email address';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { name, email, password },
  };
}

export async function registerUser({ name, email, password }) {
  const validation = validateSignup({ name, email, password });
  if (!validation.valid) {
    return { ok: false, errors: validation.errors };
  }

  const users = await readUsers();
  const exists = users.some((u) => u.email.toLowerCase() === validation.data.email);
  if (exists) {
    return { ok: false, error: 'An account with this email already exists' };
  }

  const maxId = users.reduce((max, u) => Math.max(max, parseInt(u.id, 10) || 0), 0);
  const newUser = {
    id: String(maxId + 1),
    email: validation.data.email,
    password: validation.data.password,
    name: validation.data.name,
    role: 'agent',
  };

  users.push(newUser);
  await writeUsers(users);

  return { ok: true, ...createSession(newUser) };
}

export async function authenticate(email, password) {
  const normalizedEmail = String(email ?? '').trim().toLowerCase();
  const pwd = String(password ?? '');

  if (!normalizedEmail || !pwd) {
    return { ok: false, error: 'Email and password are required' };
  }

  const users = await readUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === pwd,
  );

  if (!user) {
    return { ok: false, error: 'Invalid email or password' };
  }

  return { ok: true, ...createSession(user) };
}

export function getSession(token) {
  if (!token) return null;
  return sessions.get(token) ?? null;
}

export function revokeSession(token) {
  if (token) sessions.delete(token);
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.slice(7).trim();
  const user = getSession(token);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  req.user = user;
  req.authToken = token;
  next();
}

export { ROLES };
