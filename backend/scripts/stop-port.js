import { execSync } from 'child_process';

const PORT = process.env.PORT || 3001;

try {
  const out = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
  const pids = new Set();
  for (const line of out.split('\n')) {
    const match = line.match(/LISTENING\s+(\d+)/);
    if (match) pids.add(match[1]);
  }
  if (pids.size === 0) {
    console.log(`No process listening on port ${PORT}.`);
    process.exit(0);
  }
  for (const pid of pids) {
    console.log(`Stopping PID ${pid} on port ${PORT}...`);
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
  }
  console.log('Done. Run: npm run dev');
} catch {
  console.log(`No process found on port ${PORT}.`);
}
