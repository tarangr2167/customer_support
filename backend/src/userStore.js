import { access, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const USERS_PATH = join(__dirname, '..', 'data', 'users.json');

const DEFAULT_USERS = [
  {
    id: '1',
    email: 'tarang@support.com',
    password: 'password123',
    name: 'Tarang Ramoliya',
    role: 'agent',
  },
  {
    id: '2',
    email: 'customer@support.com',
    password: 'customer123',
    name: 'Jane Customer',
    role: 'customer',
  },
];

async function ensureUsersFile() {
  try {
    await access(USERS_PATH);
  } catch {
    await writeFile(USERS_PATH, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
  }
}

export async function readUsers() {
  await ensureUsersFile();
  const raw = await readFile(USERS_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function writeUsers(users) {
  await writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
}
