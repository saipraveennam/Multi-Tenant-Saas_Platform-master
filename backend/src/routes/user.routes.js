const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const controller = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

router.use(auth);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create user (tenant admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@demo.com
 *               password:
 *                 type: string
 *                 example: User@123
 *               fullName:
 *                 type: string
 *                 example: Demo User
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 */

router.post('/', role('tenant_admin'), controller.createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users in tenant
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', role('tenant_admin'), controller.getUsers);
// router.get('/', role('tenant_admin'), controller.getAllUsers);

router.get('/:id', role('tenant_admin'), controller.getUserById);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               fullName:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */

router.put('/:id', role('tenant_admin'), controller.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
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
 *         description: User deleted
 */

router.delete('/:id', role('tenant_admin'), controller.deleteUser);

module.exports = router;
