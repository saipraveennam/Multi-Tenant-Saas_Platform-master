-- =====================================================
-- ENABLE UUID EXTENSION
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TENANTS
-- =====================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROJECTS
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TASKS
-- =====================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TOKEN BLACKLIST
-- =====================================================
CREATE TABLE IF NOT EXISTS token_blacklist (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AUDIT LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  tenant_id UUID,
  user_id UUID,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  entity_type VARCHAR(50),
  entity_id UUID
);

-- =====================================================
-- SEED: ACME TENANT
-- =====================================================
INSERT INTO tenants (id, name, subdomain)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Acme Corporation',
  'acme'
)
ON CONFLICT (subdomain) DO NOTHING;

-- =====================================================
-- SEED: USERS (ACME)
-- Password hashes are bcrypt
-- =====================================================

-- Tenant Admin (Main)
INSERT INTO users (tenant_id, email, password_hash, full_name, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@acme.com',
  '$2b$10$.fyEC8n6o2KNzLv7Eli2CexQTptQoZYZ0GHDbgXac5DiHd2ONFwR6', -- Admin@123
  'Acme Admin',
  'tenant_admin'
)
ON CONFLICT DO NOTHING;

-- Tenant Admin (Second)
INSERT INTO users (tenant_id, email, password_hash, full_name, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'manager@acme.com',
  '$2b$10$.fyEC8n6o2KNzLv7Eli2CexQTptQoZYZ0GHDbgXac5DiHd2ONFwR6', -- Admin@123
  'Operations Manager',
  'tenant_admin'
)
ON CONFLICT DO NOTHING;

-- Regular User 1
INSERT INTO users (tenant_id, email, password_hash, full_name, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'user1@acme.com',
  '$2b$10$6QpZzB2z7A8e3cX4U7bMQu6JwKkA0c0Y2WZ9q0k8Z9zZk1bFf0a4a', -- User@123
  'John Doe',
  'user'
)
ON CONFLICT DO NOTHING;

-- Regular User 2
INSERT INTO users (tenant_id, email, password_hash, full_name, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'user2@acme.com',
  '$2b$10$6QpZzB2z7A8e3cX4U7bMQu6JwKkA0c0Y2WZ9q0k8Z9zZk1bFf0a4a', -- User@123
  'Jane Smith',
  'user'
)
ON CONFLICT DO NOTHING;

-- QA User
INSERT INTO users (tenant_id, email, password_hash, full_name, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'qa@acme.com',
  '$2b$10$Z8t0nL2s9U8x7D9e8GJ7oObZQJ6bK4eYc3xT0kZp7C0e6T9xX7n5S', -- Test@123
  'QA Tester',
  'user'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED: SAMPLE PROJECTS (ACME)
-- =====================================================
INSERT INTO projects (tenant_id, name, description)
VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'CRM System',
  'Customer relationship management'
),
(
  '11111111-1111-1111-1111-111111111111',
  'HR Portal',
  'Employee onboarding and HR tasks'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Inventory App',
  'Track products and stock'
);
