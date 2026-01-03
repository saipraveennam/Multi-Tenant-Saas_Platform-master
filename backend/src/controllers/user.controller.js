const db = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../utils/password');

const logAudit = require('../utils/auditLogger');

// exports.createUser = async (req, res) => {
//   const { email, password, fullName, role } = req.body;
//   const { tenantId } = req.user;

//   // ✅ SAFETY VALIDATION (VERY IMPORTANT)
//   if (!email || !password || !fullName || !role) {
//     return res.status(400).json({
//       success: false,
//       message: 'email, password, fullName and role are required'
//     });
//   }

//   const passwordHash = await bcrypt.hash(password, 10);

//   await db.query(
//     `INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
//      VALUES ($1, $2, $3, $4, $5, $6)`,
//     [uuidv4(), tenantId, email, passwordHash, fullName, role]
//   );
//   await logAudit({
//   userId: req.user.userId,
//   tenantId: req.user.tenantId,
//   action: 'CREATE_USER',
//   entityType: 'user',
//   entityId: newUserId   // use the UUID you generated
// });
//   res.status(201).json({
//     success: true,
//     message: 'User created successfully'
//   });
// };

// exports.createUser = async (req, res) => {
//   const { email, fullName, password, role } = req.body;
//   const { tenantId, userId } = req.user;

//   // 1️⃣ Hash password
//   const passwordHash = await hashPassword(password);

//   // 2️⃣ Insert user AND get ID
//   const result = await db.query(
//     `INSERT INTO users (email, full_name, password_hash, role, tenant_id)
//      VALUES ($1, $2, $3, $4, $5)
//      RETURNING id`,
//     [email, fullName, passwordHash, role, tenantId]
//   );

//   // ✅ THIS IS THE MISSING LINE
//   const newUserId = result.rows[0].id;

//   // 3️⃣ Audit log (NOW SAFE)
//   await logAudit({
//     userId,
//     tenantId,
//     action: 'CREATE_USER',
//     entityType: 'user',
//     entityId: newUserId
//   });

//   // 4️⃣ Response
//   res.status(201).json({
//     success: true,
//     message: 'User created successfully'
//   });
// };

exports.createUser = async (req, res) => {
  const { email, fullName, password, role } = req.body;
  const { tenantId, userId } = req.user;

  // 1️⃣ Hash password
  const passwordHash = await hashPassword(password);

  // 2️⃣ Insert user AND get ID
  const result = await db.query(
    `INSERT INTO users (email, full_name, password_hash, role, tenant_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [email, fullName, passwordHash, role, tenantId]
  );

  // ✅ THIS IS THE MISSING LINE
  const newUserId = result.rows[0].id;

  // 3️⃣ Audit log (NOW SAFE)
  await logAudit({
    userId,
    tenantId,
    action: 'CREATE_USER',
    entityType: 'user',
    entityId: newUserId
  });

  // 4️⃣ Response
  res.status(201).json({
    success: true,
    message: 'User created successfully'
  });
};

exports.getUsers = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const usersResult = await db.query(
      `
      SELECT id, email, full_name, role
      FROM users
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [tenantId, limit, offset]
    );

    const countResult = await db.query(
      'SELECT COUNT(*) FROM users WHERE tenant_id = $1',
      [tenantId]
    );

    res.json({
      success: true,
      page,
      limit,
      totalRecords: parseInt(countResult.rows[0].count),
      data: usersResult.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};



exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user;

  const result = await db.query(
    'SELECT id, email, full_name, role FROM users WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, role } = req.body;
  const { tenantId } = req.user;

  if (!fullName && !role) {
    return res.status(400).json({
      success: false,
      message: 'Nothing to update'
    });
  }

  const userCheck = await db.query(
    'SELECT id FROM users WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  );

  if (userCheck.rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found in this tenant'
    });
  }

  await db.query(
    `UPDATE users
     SET full_name = COALESCE($1, full_name),
         role = COALESCE($2, role)
     WHERE id = $3 AND tenant_id = $4`,
    [fullName, role, id, tenantId]
  );
  await logAudit({
  userId: req.user.userId,
  tenantId: req.user.tenantId,
  action: 'UPDATE_USER',
  entityType: 'user',
  entityId: req.params.id
});


  res.json({
    success: true,
    message: 'User updated successfully'
  });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { tenantId, userId } = req.user;

  if (id === userId) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete yourself'
    });
  }

  const result = await db.query(
    'DELETE FROM users WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  await logAudit({
  userId: req.user.userId,
  tenantId: req.user.tenantId,
  action: 'DELETE_USER',
  entityType: 'user',
  entityId: req.params.id
});

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
};
