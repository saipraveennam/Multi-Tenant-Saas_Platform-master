const db = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminEmail, adminPassword } = req.body;

  if (!tenantName || !subdomain || !adminEmail || !adminPassword) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const tenantId = uuidv4();
  const userId = uuidv4();
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await db.query(
    `INSERT INTO tenants (id, name, subdomain)
     VALUES ($1, $2, $3)`,
    [tenantId, tenantName, subdomain]
  );

  await db.query(
    `INSERT INTO users (id, tenant_id, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, tenantId, adminEmail, passwordHash, 'tenant_admin']
  );

  res.status(201).json({
    success: true,
    message: 'Tenant registered successfully'
  });
};
