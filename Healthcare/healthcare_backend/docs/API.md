# Healthcare Backend API

Base URL: `http://localhost:8000/api/`

Authentication uses JWT bearer tokens:

```http
Authorization: Bearer <access_token>
```

## Auth

### Register

`POST /api/auth/register/`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPass123!"
}
```

### Login

`POST /api/auth/login/`

```json
{
  "email": "jane@example.com",
  "password": "StrongPass123!"
}
```

### Refresh Token

`POST /api/auth/token/refresh/`

```json
{
  "refresh": "<refresh_token>"
}
```

## Patients

All patient endpoints require authentication. A user only sees and changes patients they created.

- `POST /api/patients/`
- `GET /api/patients/`
- `GET /api/patients/{id}/`
- `PUT /api/patients/{id}/`
- `PATCH /api/patients/{id}/`
- `DELETE /api/patients/{id}/`

Query support:

- Search: `?search=priya`
- Filter: `?gender=female&age=34`
- Ordering: `?ordering=-created_at`
- Pagination: `?page=1&page_size=10`

## Doctors

All doctor endpoints require authentication.

- `POST /api/doctors/`
- `GET /api/doctors/`
- `GET /api/doctors/{id}/`
- `PUT /api/doctors/{id}/`
- `PATCH /api/doctors/{id}/`
- `DELETE /api/doctors/{id}/`

Query support:

- Search: `?search=cardiology`
- Filter: `?specialization=Cardiology`
- Ordering: `?ordering=full_name`

## Patient-Doctor Mappings

Mappings are scoped to the authenticated user's patients.

- `POST /api/mappings/` assigns a doctor to a patient.
- `GET /api/mappings/` lists mappings for the authenticated user.
- `GET /api/mappings/{patient_id}/` returns a patient and assigned doctors.
- `DELETE /api/mappings/{mapping_id}/` removes a mapping.

Duplicate patient-doctor assignments are blocked by serializer validation and a database unique constraint.

## Interactive Docs

- Swagger UI: `GET /api/docs/`
- ReDoc: `GET /api/redoc/`
- OpenAPI schema: `GET /api/schema/`
