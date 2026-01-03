const db = require('../config/db');
const { comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const logAudit = require('../utils/auditLogger'); // ✅ ADD THIS

exports.login = async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;

  const tenantResult = await db.query(
    'SELECT * FROM tenants WHERE subdomain = $1',
    [tenantSubdomain]
  );

  if (tenantResult.rowCount === 0) {
    return res.status(404).json({ success: false, message: 'Tenant not found' });
  }

  const tenant = tenantResult.rows[0];

  const userResult = await db.query(
    'SELECT * FROM users WHERE email = $1 AND tenant_id = $2',
    [email, tenant.id]
  );

  if (userResult.rowCount === 0) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const user = userResult.rows[0];
  const valid = await comparePassword(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = signToken({
  user_id: user.id,
  tenant_id: user.tenant_id,
  role: user.role
});


  // ✅ AUDIT LOG — LOGIN
  await logAudit({
  user_id: user.id,
  tenant_id: user.tenant_id,
  action: 'LOGIN',
  entity_type: 'auth'
});



  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      },
      token,
      expiresIn: 86400
    }
  });
};

exports.me = async (req, res) => {
  if (!req.user || !req.user.user_id) {
  return res.status(401).json({ success: false, message: 'Unauthorized' });
}

const userId = req.user.user_id;


  const result = await db.query(
    'SELECT id, email, full_name, role FROM users WHERE id = $1',
    [userId]
  );

  res.json({ success: true, data: result.rows[0] });
};

exports.registerTenant = async (req, res) => {
  const {
    organizationName,
    subdomain,
    adminEmail,
    adminFullName,
    password,
    confirmPassword
  } = req.body;

  if (
    !organizationName ||
    !subdomain ||
    !adminEmail ||
    !adminFullName ||
    !password ||
    !confirmPassword
  ) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    });
  }

  // check tenant exists
  const existingTenant = await db.query(
    'SELECT id FROM tenants WHERE subdomain = $1',
    [subdomain]
  );

  if (existingTenant.rowCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Subdomain already exists'
    });
  }

  // create tenant
  const tenantResult = await db.query(
    'INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING id',
    [organizationName, subdomain]
  );

  const tenantId = tenantResult.rows[0].id;

  const bcrypt = require('bcrypt');
  const passwordHash = await bcrypt.hash(password, 10);

  // create admin user
  await db.query(
    `
    INSERT INTO users (tenant_id, email, full_name, password_hash, role)
    VALUES ($1, $2, $3, $4, 'tenant_admin')
    `,
    [tenantId, adminEmail, adminFullName, passwordHash]
  );

  res.status(201).json({
    success: true,
    message: 'Tenant registered successfully'
  });
};

