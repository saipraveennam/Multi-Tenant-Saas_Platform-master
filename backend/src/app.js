const express = require('express');
const db = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const tenantRoutes = require('./routes/tenant.routes');
const errorHandler = require('./middleware/error.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const tenantRegistrationRoutes = require('./routes/tenantRegistration.routes');

const app = express();
const cors = require('cors');
app.use(cors());

// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));

// const cors = require("cors");

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "http://frontend:5173"
//   ],
//   credentials: true
// }));
// const cors = require("cors");

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

/* ------------------ MIDDLEWARE (ORDER MATTERS) ------------------ */

// Parse JSON FIRST
app.use(express.json());

// FORCE CORS (Swagger + Browser friendly)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// IMPORTANT: handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

/* ------------------ SWAGGER ------------------ */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ------------------ ROUTES ------------------ */
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', tenantRegistrationRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

/* ------------------ ERROR HANDLER ------------------ */
app.use(errorHandler);

module.exports = app;
