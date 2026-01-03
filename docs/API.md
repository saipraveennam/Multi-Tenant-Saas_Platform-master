# API Documentation

This document describes all REST API endpoints exposed by the Multi-Tenant SaaS Platform.  
All APIs are secured using JWT authentication and enforce tenant isolation.

---

## 🔐 Authentication APIs

### 1. Login
**POST** `/api/auth/login`

Authenticate a user using email, password, and tenant subdomain.

**Request Body**
```json
{
  "email": "admin@acme.com",
  "password": "Admin@123",
  "tenantSubdomain": "acme"
}
````

**Response**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here"
  }
}
```

---

### 2. Get Current User

**GET** `/api/auth/me`

Returns the currently logged-in user details.

**Headers**

```
Authorization: Bearer <token>
```

---

### 3. Register Tenant

**POST** `/api/auth/register-tenant`

Registers a new tenant and creates a tenant admin.

**Request Body**

```json
{
  "organizationName": "Acme Technologies",
  "subdomain": "acme",
  "adminEmail": "admin@acme.com",
  "adminFullName": "Acme Admin",
  "password": "Admin@123",
  "confirmPassword": "Admin@123"
}
```

---

## 👥 User Management APIs

### 4. Create User

**POST** `/api/users`

Creates a new user under the tenant.

**Headers**

```
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "email": "user1@acme.com",
  "fullName": "John Doe",
  "password": "User@123",
  "role": "user"
}
```

---

### 5. Get Users

**GET** `/api/users`

Returns all users of the tenant.

---

### 6. Delete User

**DELETE** `/api/users/:id`

Deletes a user by ID.

---

## 📁 Project APIs

### 7. Create Project

**POST** `/api/projects`

Creates a new project for the tenant.

**Request Body**

```json
{
  "name": "Analytics Dashboard",
  "description": "Real-time analytics dashboard"
}
```

---

### 8. Get Projects

**GET** `/api/projects`

Returns paginated list of projects for the tenant.

---

### 9. Get Project By ID

**GET** `/api/projects/:id`

Returns project details by ID.

---

### 10. Update Project

**PUT** `/api/projects/:id`

Updates project details.

---

### 11. Delete Project

**DELETE** `/api/projects/:id`

Deletes a project.

---

## ✅ Task APIs

### 12. Create Task

**POST** `/api/tasks`

Creates a new task under a project.

**Request Body**

```json
{
  "projectId": "project_id_here",
  "title": "Design UI",
  "status": "pending"
}
```

---

### 13. Get Tasks

**GET** `/api/tasks`

Returns tasks for the tenant.

---

### 14. Update Task

**PUT** `/api/tasks/:id`

Updates a task.

---

### 15. Delete Task

**DELETE** `/api/tasks/:id`

Deletes a task.

---

## ❤️ Health Check API

### 16. Health Check

**GET** `/api/health`

Returns backend and database status.

**Response**

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## 🔒 Security Notes

* All APIs (except login and register tenant) require JWT authentication
* Tenant isolation is enforced using `tenant_id`
* Role-based access control restricts sensitive operations

---

## 📌 Summary

Total APIs documented: **16+ endpoints**
All endpoints are secured, tenant-aware, and production-ready.