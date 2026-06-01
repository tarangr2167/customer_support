# Ticket Support API

Express API with JSON file persistence for the support ticket dashboard.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev    # development (auto-restart)
npm start      # production
```

Server: **http://localhost:3001** (or set `PORT`).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/tickets` | List tickets |
| GET | `/tickets/:id` | Single ticket |
| POST | `/tickets` | Create ticket |
| PATCH | `/tickets/:id` | Update status |
| GET | `/analytics` | Dashboard stats |

### Query params for `GET /tickets`

`search`, `customerName`, `subject`, `status`, `priority`, `page`, `limit`

### Create body

```json
{
  "customerName": "John Doe",
  "email": "john@test.com",
  "subject": "Payment Issue",
  "priority": "High"
}
```

Data is stored in `data/tickets.json`.
