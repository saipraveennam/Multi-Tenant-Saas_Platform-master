const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const controller = require('../controllers/project.controller');

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management APIs
 */

router.use(auth);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create project (tenant admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Project Alpha
 *               description:
 *                 type: string
 *                 example: First project
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/', role('tenant_admin'), controller.createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', role('tenant_admin'), controller.getProjects);

router.get('/:id', role('tenant_admin'), controller.getProjectById);
router.put('/:id', role('tenant_admin'), controller.updateProject);
router.delete('/:id', role('tenant_admin'), controller.deleteProject);

module.exports = router;
