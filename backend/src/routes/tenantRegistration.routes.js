const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenantRegistration.controller');

/**
 * @swagger
 * tags:
 *   name: Tenant Registration
 *   description: Tenant onboarding APIs
 */

router.post('/register-tenant', controller.registerTenant);

module.exports = router;
