# Team Task Manager

A minimal full-stack task manager for teams with JWT auth, role-based access, PostgreSQL persistence, and a lightweight React dashboard.

## Folder Structure

```text
TeamTaskManager/
  backend/
    scripts/
    src/
    tests/
  database/
    schema.sql
  frontend/
    src/
```

## Tech Stack

- Backend: Node.js + Express
- Frontend: React + Vite
- Database: PostgreSQL
- Auth: JWT + bcryptjs
- Tests: Vitest
- Deployment target: Railway

## Run Locally

1. Install dependencies.

```bash
npm install
```

2. Create environment files.

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

3. Update `backend/.env` with your PostgreSQL connection string and JWT secret.

4. Apply the schema and seed the demo data.

```bash
npm run db:setup
```

5. Start the development servers.

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3000`

## Test Credentials

- Admin: `admin@example.com` / `Admin123!`
- Member: `member@example.com` / `Member123!`

## API Examples

### Signup

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"New Member","email":"new@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

### Create Project

```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Website Relaunch"}'
```

### Create Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"project_id":1,"title":"Finalize copy","description":"Polish homepage copy","assigned_to":2,"due_date":"2026-06-01"}'
```

### Update Task Status

```bash
curl -X PATCH http://localhost:3000/tasks/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"status":"DONE"}'
```

### Dashboard

```bash
curl http://localhost:3000/dashboard \
  -H "Authorization: Bearer <token>"
```

## Database Schema

See `database/schema.sql` for the full PostgreSQL schema.

- `users`: id, name, email, password_hash, role
- `projects`: id, name, created_by
- `project_members`: user_id, project_id
- `tasks`: id, title, description, status, assigned_to, project_id, due_date

Indexes are included on the foreign keys and due date.

## Architecture

The backend keeps a simple layered structure:

- routes: HTTP wiring and middleware
- controllers: request/response handling
- services: business rules and RBAC
- repositories: SQL queries

The frontend is a single protected dashboard experience with auth pages, using fetch-based API helpers and local state rather than a heavier state manager.

## Railway Deployment

Create three Railway services:

1. PostgreSQL database
2. Backend service from the `backend` folder
3. Frontend service from the `frontend` folder

### Backend service

- Build command: `npm install`
- Start command: `npm run db:migrate && npm start`
- Required vars:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `CORS_ORIGIN` set to the Railway frontend URL

### Frontend service

- Build command: `npm install && npm run build`
- Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`
- Required vars:
  - `VITE_API_URL` set to the Railway backend URL

### Database

- Attach the Railway Postgres service to the backend service as `DATABASE_URL`.
- Run `npm run db:seed` once after deploy to create the demo users and starter data.

## Live URL

Not available in this workspace. Add the deployed Railway URL here after creating the services.

## Sample Commit History

- `chore: scaffold monorepo and package manifests`
- `feat: add auth, project, task, and dashboard backend`
- `feat: add protected React dashboard and auth pages`
- `test: cover auth, task creation, and RBAC rules`
- `docs: add setup, deployment, and API examples`

## Tests

Run the backend suite:

```bash
npm test -w backend
```

The included tests cover:

- signup/login behavior
- task creation flow
- admin/member RBAC rules

## AI Usage Disclosure

This project was drafted with AI assistance to accelerate scaffolding, implementation, and documentation. The code was then reviewed and adjusted for the requested architecture, runtime shape, and evaluation requirements.
