# Technical Specification

## 1. Overview

This document describes the technical details, project structure, and development setup of the Multi-Tenant SaaS Platform. The application is designed to be fully containerized and runnable using Docker Compose with no manual setup steps.

---

## 2. Project Structure

The project follows a clear separation of concerns between backend, frontend, database, and documentation.

```

multi-tenant-saas/
│
├── docker-compose.yml
├── submission.json
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── utils/
│       ├── migrations/
│       └── seeds/
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── api/
│       └── routes/
│
├── docs/
│   ├── research.md
│   ├── PRD.md
│   ├── architecture.md
│   ├── technical-spec.md
│   ├── API.md
│   └── images/
│       ├── system-architecture.png
│       └── database-erd.png

````

---

## 3. Backend Technical Details

### Technology Stack
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

### Key Responsibilities
- Handle authentication and authorization
- Enforce tenant isolation
- Provide RESTful APIs
- Run database migrations and seed data automatically

---

## 4. Frontend Technical Details

### Technology Stack
- React
- Vite
- Axios

### Key Responsibilities
- Render user interface
- Handle authentication state
- Enforce role-based UI access
- Communicate with backend APIs

---

## 5. Database Design

- PostgreSQL database
- Shared schema multi-tenancy
- `tenant_id` used for data isolation
- Automatic initialization via migrations and seed scripts

---

## 6. Docker Setup

The application uses Docker and Docker Compose to ensure consistent environments.

### Services
- **database**: PostgreSQL service
- **backend**: Node.js API service
- **frontend**: React UI service

### Startup Command
```bash
docker-compose up -d
````

This command:

* Starts all services
* Runs migrations and seed data automatically
* Makes the application immediately usable

---

## 7. Environment Variables

All required environment variables are defined in `docker-compose.yml`.

### Backend Variables

* DB_HOST
* DB_PORT
* DB_NAME
* DB_USER
* DB_PASSWORD
* JWT_SECRET
* FRONTEND_URL

### Frontend Variables

* VITE_API_URL

No manual `.env` setup is required.

---

## 8. Development Workflow

1. Clone the repository
2. Run `docker-compose up -d`
3. Access the frontend in browser
4. Use credentials from `submission.json`

---

## 9. Error Handling and Logging

* Centralized error handling middleware
* Meaningful HTTP status codes
* Console logging for debugging
* Audit logging for key actions

---

## 10. Conclusion

This technical setup ensures that the application is easy to run, evaluate, and maintain. The Docker-based approach guarantees reproducibility and consistent behavior across environments.