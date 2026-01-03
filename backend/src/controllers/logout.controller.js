const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const logAudit = require('../utils/auditLogger');

exports.logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  await db.query(
    'INSERT INTO token_blacklist (id, token) VALUES ($1, $2)',
    [uuidv4(), token]
  );

  // 👇 ADDED AUDIT LOG (before response)
  await logAudit({
  userId: req.user.userId,
  tenantId: req.user.tenantId,
  action: 'LOGOUT',
  entityType: 'auth'
});

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
