# TODO App Backend (Express + MySQL)

Backend API for the TODO application. Built with Node.js, Express and MySQL. The server will auto-create the database and the `todos` table when started (see src/db.js).

## Features

- REST API for todos: create, list, update, toggle done, delete
- Health endpoint
- Creates database/table automatically via initDb()
- Graceful shutdown and basic error handling

## Requirements

- Node.js 18+
- MySQL 8+ (or compatible server reachable from this machine)
- npm or yarn

## Environment variables

Create a `.env` in this folder (copy from `.env.example` if present) and set values:

- PORT — port for the HTTP server (default: 5000)
- HOST — host to bind (default: 0.0.0.0)
- DB_HOST — MySQL host (default: localhost)
- DB_PORT — MySQL port (default: 3306)
- DB_USER — MySQL user
- DB_PASSWORD — MySQL password
- DB_NAME — Database name to create/use (default: todo_app)
- TRUST_PROXY — set to "true" if app is behind a proxy (optional)
- NODE_ENV — "development" or "production" (affects error output)

Example .env:
```bash
PORT=5000
HOST=0.0.0.0
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=todo_app
TRUST_PROXY=false
NODE_ENV=development
```

## Install

From the `server` directory:

```bash
npm install
# or
yarn
```

## Run (development)

```bash
npm run dev
# or
yarn dev
```

The server listens on http://HOST:PORT (default http://0.0.0.0:5000).

## Build / Start (production)

If project includes build/start scripts, use:

```bash
npm start
# or
yarn start
```

## Database behavior

The server's `src/db.js` will:
- Connect to MySQL with the provided credentials
- Create the database specified by DB_NAME if it doesn't exist
- Create a `todos` table if it doesn't exist

No external migration tool is required for initial setup, but consider adding migrations for schema changes in production.

## API

Base path: /api

- GET /api/health
  - Response: { "status": "ok" }

- GET /api/todos
  - Returns list of todos

- POST /api/todos
  - Body: { "title": "Task title", "description": "optional" }
  - 201 Created -> returns created todo

- PUT /api/todos/:id
  - Body: { "title": "new title", "description": "optional or null" }
  - 200 -> updated todo

- PATCH /api/todos/:id/done
  - Toggles done flag
  - 200 -> updated todo

- DELETE /api/todos/:id
  - 204 -> deleted

Example requests:
```bash
# health
curl http://localhost:5000/api/health

# create todo
curl -X POST -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs"}' \
  http://localhost:5000/api/todos

# list
curl http://localhost:5000/api/todos
```

## Troubleshooting

- "Access denied" from MySQL: verify DB_USER/DB_PASSWORD and that host allows connections.
- Server fails before creating DB: check DB host/port and network connectivity.
- For verbose errors set NODE_ENV=development.

