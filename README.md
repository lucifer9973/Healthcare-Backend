# Healthcare Backend System

Production-ready REST API backend for healthcare workflows using Django 6.0.5, Django REST Framework 3.17.1, PostgreSQL, and JWT authentication.

## Features

- Email/password registration and login with JWT access and refresh tokens
- Patient CRUD scoped to the authenticated user
- Doctor CRUD with email and phone validation
- Patient-doctor assignment with duplicate prevention
- Pagination, filtering, search, and ordering
- PostgreSQL configuration through `.env`
- Swagger/OpenAPI docs with `drf-spectacular`
- Docker support, pytest tests, sample fixtures, and Postman collection

## Project Structure

```text
healthcare_backend/
├── apps/
│   ├── authentication/
│   ├── core/
│   ├── doctors/
│   ├── mappings/
│   └── patients/
├── config/
├── docs/
├── sample_data/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── manage.py
├── requirements.txt
└── .env.example
```

## Local Setup

Requires Python 3.12+ and PostgreSQL.

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Create the PostgreSQL database/user matching `.env`, or update `.env` to match your local database.

## Docker Setup

```bash
docker compose up --build
```

The API will run at `http://localhost:8000`.

## API Docs

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI schema: `http://localhost:8000/api/schema/`
- Full endpoint notes: `docs/API.md`

## Authentication

Register:

```http
POST /api/auth/register/
```

Login:

```http
POST /api/auth/login/
```

Use the returned access token:

```http
Authorization: Bearer <access_token>
```

## Tests

```bash
pytest
```

Tests override the database to in-memory SQLite for fast API-level checks. Runtime settings remain PostgreSQL-first.

## Sample Data

After migrating:

```bash
python manage.py loaddata sample_data/sample_data.json
```

Demo fixture login is `demo@example.com` / `DemoPass123!`.

## Postman

Import `docs/Healthcare_Backend.postman_collection.json`. The login request stores `access_token` and `refresh_token` collection variables automatically.
