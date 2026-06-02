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

## Setup Instructions

Clone Repository
```bash
git clone <repository-url>
cd customer_support
```

Backend Setup
```bash
cd backend
npm install
npm run dev
```

Backend will start on:
```bash
http://localhost:3001
```

Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Create a .env file inside the frontend directory:
```bash
VITE_API_URL=http://localhost:3001
```

Frontend will start on:
```bash
http://localhost:5173
```


## Production Deployment

## Backend (Render / Railway)
```bash
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Frontend (Vercel)
```bash
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```
## Setup Instructions

### Clone Repository

```bash
git clone <repository-url>
cd customer_support
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will start on:

```text
http://localhost:3001
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside the frontend directory if needed:

```env
VITE_API_URL=http://localhost:3001
```

Frontend will start on:

```text
http://localhost:5173
```

### Production Deployment

#### Backend (Render)

* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `npm start`

#### Frontend (Vercel)

* Root Directory: `frontend`
* Build Command: `npm run build`
* Output Directory: `dist`
* Environment Variable:

```env
VITE_API_URL=https://your-api.onrender.com
```

## Architecture Decisions

### Frontend

* React 19 + TypeScript for a modern, type-safe UI.
* Vite for fast development and optimized production builds.
* TanStack Query for server-state management, caching, and automatic refetching.
* React Router for client-side routing and protected pages.
* Component-based architecture to improve reusability and maintainability.

### Backend

* Express 5 used to create lightweight REST APIs.
* Business logic separated from route handlers where possible.

### Data Storage

* JSON file persistence was chosen to keep the project simple and aligned with assessment requirements.
* Ticket data is stored in `backend/data/tickets.json`.
* User data is stored in `backend/data/users.json`.
* No external database dependency is required for setup.

### Authentication & Authorization
* Users can register as either:
  * Customer
  * Agent
* Role-based permissions restrict ticket status updates to agents only.

## Assumptions Made

* Authentication is simplified for assessment purposes.
* Users are assumed to have unique email addresses.
* Ticket IDs are generated by the backend and are unique.
* Agents can update any ticket's status.
* Customers can create and view tickets but cannot change ticket status.
* JSON file storage is sufficient for the expected assessment data volume.
* Concurrent writes to the JSON file are minimal and acceptable for this scope.

## Improvements With Additional Time

### Backend

* Replace JSON persistence with a database such as MongoDB or PostgreSQL.
* Implement JWT authentication with refresh tokens.
* Add password hashing using bcrypt.
* Add centralized error handling and logging.

### Frontend

* Add advanced filtering and sorting options.
* Add user role update option.
* Add real-time updates using WebSockets.
* Add export functionality (CSV/PDF).
* Add agent performance metrics.

ISC
