const db = require('../config/db');

/**
 * GET /api/tenants/:id
 */
exports.getTenantById = async (req, res) => {
  const { id } = req.params;
  const { role, tenantId } = req.user;

  // tenant_admin can only access own tenant
  if (role !== 'super_admin' && tenantId !== id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  const result = await db.query(
    'SELECT id, name, subdomain, status, subscription_plan, max_users, max_projects FROM tenants WHERE id = $1',
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: 'Tenant not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

/**
 * PUT /api/tenants/:id
 */
exports.updateTenant = async (req, res) => {
  const { id } = req.params;
  const { role, tenantId } = req.user;
  const { name } = req.body;

  // tenant_admin can only update own tenant
  if (role !== 'super_admin' && tenantId !== id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // tenant_admin CANNOT update plan or status
  if (role !== 'super_admin') {
    await db.query(
      'UPDATE tenants SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [name, id]
    );
  } else {
    const { status, subscription_plan, max_users, max_projects } = req.body;

    await db.query(
      `UPDATE tenants
       SET name = $1,
           status = $2,
           subscription_plan = $3,
           max_users = $4,
           max_projects = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [name, status, subscription_plan, max_users, max_projects, id]
    );
  }

  res.json({
    success: true,
    message: 'Tenant updated successfully'
  });
};

/**
 * GET /api/tenants
 */
exports.getAllTenants = async (req, res) => {
  const { role } = req.user;

  if (role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Only super admin can access all tenants'
    });
  }

  const result = await db.query(
    'SELECT id, name, subdomain, status, subscription_plan FROM tenants'
  );

  res.json({
    success: true,
    data: result.rows
  });
};
