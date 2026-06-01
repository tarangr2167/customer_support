import cors from 'cors';
import express from 'express';
import { readTickets, writeTickets } from './store.js';
import { validateCreateTicket, validateStatusUpdate } from './validation.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function filterTickets(tickets, query) {
  let result = [...tickets];
  const customerName = (query.customerName || '').trim().toLowerCase();
  const subject = (query.subject || '').trim().toLowerCase();
  const status = (query.status || '').trim();
  const priority = (query.priority || '').trim();
  const search = (query.search || '').trim().toLowerCase();

  if (search) {
    result = result.filter(
      (t) =>
        t.customerName.toLowerCase().includes(search) ||
        t.subject.toLowerCase().includes(search) ||
        t.email.toLowerCase().includes(search) ||
        t.id.includes(search),
    );
  }
  if (customerName) {
    result = result.filter((t) =>
      t.customerName.toLowerCase().includes(customerName),
    );
  }
  if (subject) {
    result = result.filter((t) => t.subject.toLowerCase().includes(subject));
  }
  if (status) {
    result = result.filter((t) => t.status === status);
  }
  if (priority) {
    result = result.filter((t) => t.priority === priority);
  }

  result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return result;
}

function paginate(items, page, limit) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limitNum));
  const safePage = Math.min(pageNum, totalPages);
  const start = (safePage - 1) * limitNum;

  return {
    data: items.slice(start, start + limitNum),
    page: safePage,
    limit: limitNum,
    total,
    totalPages,
  };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/tickets', async (req, res, next) => {
  try {
    const tickets = await readTickets();
    const filtered = filterTickets(tickets, req.query);

    if (req.query.page || req.query.limit) {
      return res.json(paginate(filtered, req.query.page, req.query.limit));
    }

    res.json({ data: filtered, total: filtered.length });
  } catch (err) {
    next(err);
  }
});

app.get('/tickets/:id', async (req, res, next) => {
  try {
    const tickets = await readTickets();
    const ticket = tickets.find((t) => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

app.post('/tickets', async (req, res, next) => {
  try {
    const validation = validateCreateTicket(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: validation.errors,
      });
    }

    const tickets = await readTickets();
    const maxId = tickets.reduce(
      (max, t) => Math.max(max, parseInt(t.id, 10) || 0),
      0,
    );
    const id = String(maxId + 1);
    const createdAt = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();

    const ticket = {
      id,
      ...validation.data,
      status: 'Open',
      createdAt,
      activity: [
        {
          id: `a${Date.now()}`,
          type: 'created',
          message: 'Ticket created',
          timestamp,
        },
      ],
    };

    tickets.push(ticket);
    await writeTickets(tickets);
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
});

app.patch('/tickets/:id', async (req, res, next) => {
  try {
    const statusValidation = validateStatusUpdate(req.body.status);
    if (!statusValidation.valid) {
      return res.status(400).json({ error: statusValidation.error });
    }

    const tickets = await readTickets();
    const index = tickets.findIndex((t) => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = tickets[index];
    const previousStatus = ticket.status;
    const newStatus = statusValidation.data;

    if (previousStatus === newStatus) {
      return res.json(ticket);
    }

    ticket.status = newStatus;
    ticket.activity = ticket.activity ?? [];
    ticket.activity.push({
      id: `a${Date.now()}`,
      type: 'status_change',
      message: `Status changed from ${previousStatus} to ${newStatus}`,
      timestamp: new Date().toISOString(),
    });

    tickets[index] = ticket;
    await writeTickets(tickets);
    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

app.get('/analytics', async (_req, res, next) => {
  try {
    const tickets = await readTickets();
    const byStatus = { Open: 0, 'In Progress': 0, Closed: 0 };
    const byPriority = { Low: 0, Medium: 0, High: 0 };

    for (const t of tickets) {
      if (byStatus[t.status] !== undefined) byStatus[t.status]++;
      if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
    }

    res.json({
      total: tickets.length,
      open: byStatus.Open,
      inProgress: byStatus['In Progress'],
      closed: byStatus.Closed,
      highPriority: byPriority.High,
      byStatus,
      byPriority,
    });
  } catch (err) {
    next(err);
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
