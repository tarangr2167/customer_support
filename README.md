# Customer Support Ticket Dashboard

A full-stack support ticket dashboard for agents to view, create, filter, and update customer tickets—with analytics and activity history.

## Tech stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, TanStack Query, React Router |
| Backend  | Node.js, Express 5                                |
| Data     | JSON file persistence (`backend/data/tickets.json`) |

## Features

- **Login/Signup** — User can login or create account and select role at the time of creating account
- **Dashboard** — List tickets with customer name, subject, priority, status, and created date
- **Create ticket** — Validated form (name, email, subject, priority)
- **Update status** — Open → In Progress → Closed with activity log (Agent Role only)
- **Search & filter** — Debounced search by customer name and subject; filter by status and priority
- **Ticket details** — Full info + activity timeline & change status (Agent Role only)
- **Analytics** — Total, open, closed, high-priority counts with bar charts
- **UX** — Loading, error, and empty states; responsive layout (mobile cards, desktop table)
- **Pagination** —  tickets per page on the dashboard

## Getting started

### Prerequisites

- Node.js 18+

### Backend

```bash
cd backend
npm install
npm run dev
```

API runs at **http://localhost:3001** 

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # optional; defaults to http://localhost:3001
npm run dev
```

App runs at **http://localhost:5173**

## API endpoints

| Method | Path               | Description                          |
| ------ | ------------------ | ------------------------------------ |
| GET    | `/tickets`         | List tickets (query: filters, `page`, `limit`) |
| GET    | `/tickets/:id`     | Single ticket                        |
| POST   | `/tickets`         | Create ticket                        |
| PATCH  | `/tickets/:id`     | Update status (`{ "status": "..." }`) |
| GET    | `/analytics`       | Aggregate counts                     |
| POST   | `/auth/login`      | User Login                        |
| POST   | `/auth/signup`     | User regestration                 |
## Deployment

### Backend (Render / Railway)

1. Set root directory to `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Set `PORT` from the platform (handled automatically)

### Frontend (Vercel)

1. Set root directory to `frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable: `VITE_API_URL=https://your-api.onrender.com`

## Project structure

```
customer_support/
├── backend/
│   ├── data/tickets.json
│   └── src/
│       ├── server.js
│       ├── store.js
│       └── validation.js
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── types/
└── README.md
```

## License

ISC
