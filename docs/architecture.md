# System Architecture

## 1. Overview

The Multi-Tenant SaaS Platform follows a **three-tier architecture** consisting of a frontend, backend API, and database. The system is designed to support multiple tenants while ensuring strict data isolation, security, and scalability.

All components are containerized using Docker and orchestrated using Docker Compose, allowing the entire application to start with a single command.

---

## 2. High-Level Architecture

The system consists of the following components:

### 2.1 Frontend
- Built using React (Vite)
- Handles user interaction and UI rendering
- Communicates with backend APIs using HTTP requests
- Enforces role-based UI access

### 2.2 Backend API
- Built using Node.js and Express
- Handles authentication, authorization, and business logic
- Implements tenant isolation and RBAC
- Exposes RESTful APIs

### 2.3 Database
- PostgreSQL database
- Stores all tenant, user, project, and task data
- Uses shared schema with tenant-based isolation

---

## 3. Architecture Diagram

The high-level system architecture is illustrated in the following diagram:

```

User
↓
Frontend (React)
↓ HTTP Requests (JWT)
Backend API (Node.js + Express)
↓ SQL Queries (tenant_id)
PostgreSQL Database

```

A visual representation is available at:

```

docs/images/system-architecture.png

````

---

## 4. Request Flow

1. A user accesses the frontend application.
2. The user logs in with email, password, and tenant subdomain.
3. The backend validates credentials and issues a JWT token.
4. The frontend stores the token and sends it with subsequent requests.
5. The backend middleware validates the token and extracts user role and tenant ID.
6. Database queries are filtered using tenant ID.
7. Responses are returned to the frontend.

---

## 5. Multi-Tenancy Design

The system uses a **shared database and shared schema** approach.  
Each business table includes a `tenant_id` column.

Tenant isolation is enforced at:
- Authentication level
- Authorization middleware
- Database query level

This ensures no data leakage between tenants.

---

## 6. Authentication & Authorization Flow

- JWT tokens are used for authentication.
- Tokens include user ID, tenant ID, and role.
- Authorization middleware restricts access based on role.
- Token blacklist ensures secure logout.

---

## 7. Docker-Based Deployment Architecture

The application uses Docker Compose to manage services:

- `database` – PostgreSQL service
- `backend` – Node.js API service
- `frontend` – React UI service

All services share a Docker network and communicate using service names.

Startup command:
```bash
docker-compose up -d
````

---

## 8. Database Architecture

The database schema includes:

* tenants
* users
* projects
* tasks
* audit_logs
* token_blacklist

Relationships are documented in the ERD diagram:

```
docs/images/database-erd.png
```

---

## 9. Scalability Considerations

* Stateless backend services
* Shared database with tenant isolation
* Docker-based deployment
* Horizontal scaling possible for backend and frontend

---

## 10. Conclusion

The architecture ensures a clean separation of concerns, secure multi-tenancy, and ease of deployment. This design closely mirrors real-world SaaS platforms and follows industry best practices.