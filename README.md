# Multi-Tenant SaaS Platform

A **production-ready, scalable multi-tenant SaaS platform** for project and task management, designed with strong tenant isolation and robust access control.

---

## Key Features

* **Tenant Isolation:** Complete separation of data between tenants to ensure privacy and security.
* **Authentication & Authorization:**
  * Secure JWT-based authentication.
  * Role-Based Access Control (RBAC) with three levels:
    * `super_admin` – Full system access
    * `tenant_admin` – Tenant-level administrative control
    * `user` – Standard tenant-level access
* **Project & Task Management:** Full lifecycle management including creation, assignment, and tracking.
* **Database Automation:** Automatic migrations and seed execution during startup.
* **Containerized Deployment:** Backend, frontend, and database services run in isolated Docker containers.
* **System Monitoring:** Dedicated health check endpoint for backend API.

---

## Technology Stack

**Backend:**

* Node.js & Express.js
* PostgreSQL database
* JWT Authentication
* RBAC for secure access control

**Frontend:**

* React with Vite
* Axios for API requests
* Dynamic UI based on user roles

**Deployment & Infrastructure:**

* Docker containers
* Docker Compose orchestration

---

## Quick Start

# Start all services from project root
```bash
docker-compose up -d
```

# Check backend health
```
curl http://localhost:5000/api/health
```

# Access the frontend
```
http://localhost:3000/
```

## Service Endpoints

| Component       | Address                                  |
|-----------------|------------------------------------------|
| Frontend        | [http://localhost:3000](http://localhost:3000) |
| Backend API     | [http://localhost:5000](http://localhost:5000) |
| Health Endpoint | [http://localhost:5000/api/health](http://localhost:5000/api/health) |


## Preloaded Test Credentials

**Tenant Administrator:**

- **Email:** `admin@acme.com`
- **Password:** `Admin@123`
- **Tenant ID:** `acme`

> These credentials are also documented in `submission.json`.

## Login Instructions

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter the preloaded credentials
3. Submit the login form to access the dashboard

**Access includes:**

- User and role management
- Project creation and updates
- Task assignment and tracking
- Tenant-level administrative controls


## Authentication & Access Model

| Role           | Scope of Access                       |
|----------------|---------------------------------------|
| `super_admin`  | Full system-wide control              |
| `tenant_admin` | Administrative access within a tenant |
| `user`         | Standard tenant-level operations      |

> Each tenant operates in complete isolation.


## Dockerized Services

| Service  | Port Mapping |
|---------|--------------|
| Database | 5432 → 5432 |
| Backend  | 5000 → 5000 |
| Frontend | 3000 → 3000 |


## Code Structure

* **Backend Logic:** `backend/src`
* **Database Migrations:** `backend/migrations`
* **Seed Scripts:** `backend/seed.js`
* **Frontend Source:** `frontend/src`
* **Docker Configuration:** `docker-compose.yml`


## Validation Checklist

After starting the platform:

1. Open the frontend and log in using seeded credentials.
2. Verify:
   - Tenant-level data separation
   - Role-based permissions
   - Full project and task management workflow

## Demo

The demonstration includes:

- System architecture overview
- Docker deployment walkthrough
- Tenant isolation demonstration
- User, project, and task operations


## Evaluator Notes

- Fully containerized SaaS platform
- Single-command startup using Docker Compose
- Automated database initialization (no manual setup)
- Demonstrates secure tenant isolation, RBAC, and modern containerized architecture


## Project Summary

This project highlights a **real-world, multi-tenant SaaS system** with:

- Strong tenant isolation
- Secure role-based access control
- Automated database lifecycle management
- Independent services orchestrated via Docker Compose

It’s ideal for **academic evaluation, practical learning, and production-oriented deployment**.


