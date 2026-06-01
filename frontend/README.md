# Customer Support Dashboard - Frontend

A modern customer support ticket management dashboard built with **React, TypeScript, and Vite**.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Context API / State Management
- Axios
- Recharts (Analytics Charts)
- ESLint

## Setup

```bash
npm install

```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001

```

For production:

```env
VITE_API_URL=https://your-backend-url.onrender.com

```

## Run Application

```bash
npm run dev

```

Application runs on:

```text
http://localhost:5173

```

## Build

```bash
npm run build

```

## Features

### Authentication

- Login
- Signup
- Select role during account creation
  - Customer
  - Agent
- Protected routes
- Persistent authentication

### Dashboard

- View all support tickets
- Customer name
- Subject
- Priority
- Status
- Created date
- Responsive table/card layout

### Create Ticket

- Form validation
- Customer name
- Email
- Subject
- Priority selection

### Update Ticket Status

Available for Agent role only:

- Open
- In Progress
- Closed

Every status update is recorded in the activity log.

### Search & Filters

- Debounced search
- Search by:
  - Customer name
  - Subject
- Filter by:
  - Status
  - Priority

### Ticket Details

- Complete ticket information
- Activity timeline
- Status history
- Change status (Agent only)

### Analytics Dashboard

- Total tickets
- Open tickets
- Closed tickets
- High-priority tickets
- Bar chart visualizations

### Pagination

- Configurable tickets per page
- Page navigation controls

### User Experience

- Loading states
- Error states
- Empty states
- Mobile responsive design
- Desktop table view
- Mobile card view

## Project Structure

```text
src/
├── api/
├── components/
├── pages/
├── hooks/
├── context/
├── routes/
├── types/
├── utils/
└── App.tsx

```

## Backend API

The frontend communicates with the Ticket Support API using:

```text
VITE_API_URL

```

Ensure the backend server is running before starting the frontend.