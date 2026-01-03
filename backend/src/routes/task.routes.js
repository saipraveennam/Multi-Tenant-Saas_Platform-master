const express = require('express');
const router = express.Router();
const controller = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.post('/', auth, role('tenant_admin'), controller.createTask);
router.get('/project/:projectId', auth, controller.getTasksByProject);
router.put('/:id', auth, role('tenant_admin'), controller.updateTask);
router.delete('/:id', auth, role('tenant_admin'), controller.deleteTask);

module.exports = router;
