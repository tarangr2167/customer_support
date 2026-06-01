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

Server: `http://localhost:3001` (or set `PORT`).

## Endpoints


| Method | Path         | Description          |
| ------ | ------------ | -------------------- |
| POST   | /auth/signup | Register a new user  |
| POST   | /auth/login  | Login user           |
| GET    | /tickets     | List tickets         |
| GET    | /tickets/:id | Get single ticket    |
| POST   | /tickets     | Create ticket        |
| PATCH  | /tickets/:id | Update ticket status |
| GET    | /analytics   | Dashboard statistics |


## Query Parameters for GET /tickets

- `search`
- `customerName`
- `subject`
- `status`
- `priority`
- `page`
- `limit`

## Signup Request Body

```json
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "password123",
  "role": "customer" | "agent"
}
```

## Login Request Body

```json
{
  "email": "john@test.com",
  "password": "password123"
}

```

## Create Ticket Request Body

```json
{
  "customerName": "John Doe",
  "email": "john@test.com",
  "subject": "Payment Issue",
  "priority": "High"
}

```

## Data Storage

All ticket data is stored in:

```text
data/tickets.json

```

User authentication data is stored in:

```text
data/users.json

```

