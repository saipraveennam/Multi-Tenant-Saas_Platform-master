const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const controller = require('../controllers/tenant.controller');

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Tenant management APIs
 */

router.use(auth);

/**
 * @swagger
 * /api/tenants:
 *   get:
 *     summary: Get all tenants (super admin only)
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tenants
 */
router.get('/', role('super_admin'), controller.getAllTenants);

/**
 * @swagger
 * /api/tenants/{id}:
 *   get:
 *     summary: Get tenant by ID
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant details
 */
router.get('/:id', controller.getTenantById);

/**
 * @swagger
 * /api/tenants/{id}:
 *   put:
 *     summary: Update tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tenant updated
 */
router.put('/:id', controller.updateTenant);

module.exports = router;
