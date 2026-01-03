const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const logAudit = require('../utils/auditLogger');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  const tenantId = req.user.tenantId; // ✅ FIXED HERE

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Project name is required'
    });
  }

  const projectId = uuidv4();

  await db.query(
    `INSERT INTO projects (id, tenant_id, name, description)
     VALUES ($1, $2, $3, $4)`,
    [projectId, tenantId, name, description]
  );

  await logAudit({
    userId: req.user.userId,
    tenantId: tenantId,
    action: 'CREATE_PROJECT',
    entityType: 'project',
    entityId: projectId
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully'
  });
};

exports.getProjects = async (req, res) => {
  const { tenantId } = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const result = await db.query(
    `
    SELECT id, name, description
    FROM projects
    WHERE tenant_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [tenantId, limit, offset]
  );

  const count = await db.query(
    'SELECT COUNT(*) FROM projects WHERE tenant_id = $1',
    [tenantId]
  );

  res.json({
    success: true,
    page,
    limit,
    totalRecords: parseInt(count.rows[0].count),
    data: result.rows
  });
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user;

  const result = await db.query(
    'SELECT * FROM projects WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;
  const { tenantId } = req.user;

  await db.query(
    `UPDATE projects
     SET name = $1, description = $2, status = $3
     WHERE id = $4 AND tenant_id = $5`,
    [name, description, status, id, tenantId]
  );

  await logAudit({
    userId: req.user.userId,
    tenantId: tenantId,
    action: 'UPDATE_PROJECT',
    entityType: 'project',
    entityId: id
  });

  res.json({
    success: true,
    message: 'Project updated successfully'
  });
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user;

  await db.query(
    'DELETE FROM projects WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  );

  await logAudit({
    userId: req.user.userId,
    tenantId: tenantId,
    action: 'DELETE_PROJECT',
    entityType: 'project',
    entityId: id
  });

  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
};
