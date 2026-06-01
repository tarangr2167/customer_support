import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'tickets.json');

export async function readTickets() {
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function writeTickets(tickets) {
  await writeFile(DATA_PATH, JSON.stringify(tickets, null, 2), 'utf-8');
}
