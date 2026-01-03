-- SUPER ADMIN
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    NULL,
    'superadmin@system.com',
    '$2b$10$wqMZbM7Yh8zQYH2Y9cJv0e8dKQZQ9mXx6tXhVnX9F8xYxHf3W2cLa',
    'System Admin',
    'super_admin'
);

-- TENANT
INSERT INTO tenants (
    id, name, subdomain, status, subscription_plan, max_users, max_projects
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Demo Company',
    'demo',
    'active',
    'pro',
    25,
    15
);

-- TENANT ADMIN
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'admin@demo.com',
    '$2b$10$wqMZbM7Yh8zQYH2Y9cJv0e8dKQZQ9mXx6tXhVnX9F8xYxHf3W2cLa',
    'Demo Admin',
    'tenant_admin'
);

-- USERS
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role
) VALUES
(
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'user1@demo.com',
    '$2b$10$wqMZbM7Yh8zQYH2Y9cJv0e8dKQZQ9mXx6tXhVnX9F8xYxHf3W2cLa',
    'Demo User One',
    'user'
),
(
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    'user2@demo.com',
    '$2b$10$wqMZbM7Yh8zQYH2Y9cJv0e8dKQZQ9mXx6tXhVnX9F8xYxHf3W2cLa',
    'Demo User Two',
    'user'
);

-- PROJECTS
INSERT INTO projects (
    id, tenant_id, name, description, created_by
) VALUES
(
    '66666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'Project Alpha',
    'First demo project',
    '33333333-3333-3333-3333-333333333333'
),
(
    '77777777-7777-7777-7777-777777777777',
    '22222222-2222-2222-2222-222222222222',
    'Project Beta',
    'Second demo project',
    '33333333-3333-3333-3333-333333333333'
);

-- TASKS
INSERT INTO tasks (
    id, project_id, tenant_id, title, priority, assigned_to
) VALUES
(
    '88888888-8888-8888-8888-888888888888',
    '66666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'Design UI',
    'high',
    '44444444-4444-4444-4444-444444444444'
),
(
    '99999999-9999-9999-9999-999999999999',
    '66666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'Build Backend',
    'medium',
    '55555555-5555-5555-5555-555555555555'
);
