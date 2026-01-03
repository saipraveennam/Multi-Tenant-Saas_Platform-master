const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const logAudit = require('../utils/auditLogger');

// exports.createTask = async (req, res) => {
//   const { projectId, title, description } = req.body;

//   // 👇 generate task ID once
//   const taskId = uuidv4();

//   await db.query(
//     'INSERT INTO tasks (id, project_id, title, description) VALUES ($1, $2, $3, $4)',
//     [taskId, projectId, title, description]
//   );

//   // 👇 ADDED AUDIT LOG (after successful insert)
//   await logAudit({
//     userId: req.user.userId,
//     tenantId: req.user.tenantId,
//     action: 'CREATE_TASK',
//     entityType: 'task',
//     entityId: taskId
//   });

//   res.status(201).json({
//     success: true,
//     message: 'Task created successfully'
//   });
// };

exports.createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, priority } = req.body;

  const result = await db.query(
    `INSERT INTO tasks (title, priority, project_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, priority || 'medium', projectId]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0]
  });
};

exports.getTasksByProject = async (req, res) => {
  const { projectId } = req.params;

  const result = await db.query(
    'SELECT * FROM tasks WHERE project_id = $1',
    [projectId]
  );

  res.json({ success: true, data: result.rows });
};


exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  await db.query(
    'UPDATE tasks SET title=$1, description=$2, status=$3 WHERE id=$4',
    [title, description, status, id]
  );

  res.json({ success: true, message: 'Task updated successfully' });
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  await db.query('DELETE FROM tasks WHERE id=$1', [id]);
    await logAudit({
  userId: req.user.userId,
  tenantId: req.user.tenantId,
  action: 'DELETE_TASK',
  entityType: 'task',
  entityId: req.params.id
});

  res.json({ success: true, message: 'Task deleted successfully' });
};
