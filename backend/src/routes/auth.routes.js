// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/auth.controller');
// const auth = require('../middleware/auth.middleware');

// router.post('/login', controller.login);
// router.get('/me', auth, controller.me);

// module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const logoutController = require('../controllers/logout.controller');
router.post('/logout', auth, logoutController.logout);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               tenantSubdomain:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', controller.login);
router.post('/register-tenant', controller.registerTenant);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/me', auth, controller.me);

module.exports = router;

