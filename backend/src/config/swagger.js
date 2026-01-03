const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Tenant SaaS API',
      version: '1.0.0',
      description: 'API documentation for Multi-Tenant SaaS Project'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],

    /* 👇 ADD THIS PART */
    paths: {
      '/api/projects': {
        post: {
          tags: ['Projects'],
          summary: 'Create project (tenant admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Project created successfully' }
          }
        },
        get: {
          tags: ['Projects'],
          summary: 'Get all projects',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of projects' }
          }
        }
      },

      '/api/projects/{id}': {
        get: {
          tags: ['Projects'],
          summary: 'Get project by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Project details' },
            404: { description: 'Project not found' }
          }
        },
        put: {
          tags: ['Projects'],
          summary: 'Update project',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Project updated successfully' }
          }
        },
        delete: {
          tags: ['Projects'],
          summary: 'Delete project',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Project deleted successfully' }
          }
        }
      },
      '/api/tasks': {
            post: {
                tags: ['Tasks'],
                summary: 'Create task',
                security: [{ bearerAuth: [] }],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        required: ['projectId', 'title'],
                        properties: {
                        projectId: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' }
                        }
                    }
                    }
                }
                },
                responses: { 201: { description: 'Task created' } }
            }
            },

            '/api/tasks/project/{projectId}': {
            get: {
                tags: ['Tasks'],
                summary: 'Get tasks by project',
                security: [{ bearerAuth: [] }],
                parameters: [{
                name: 'projectId',
                in: 'path',
                required: true,
                schema: { type: 'string' }
                }],
                responses: { 200: { description: 'List of tasks' } }
            }
            },

            '/api/tasks/{id}': {
            put: {
                tags: ['Tasks'],
                summary: 'Update task',
                security: [{ bearerAuth: [] }],
                parameters: [{
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
                }],
                requestBody: {
                content: {
                    'application/json': {
                    schema: {
                        properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        status: { type: 'string' }
                        }
                    }
                    }
                }
                },
                responses: { 200: { description: 'Task updated' } }
            },
            delete: {
                tags: ['Tasks'],
                summary: 'Delete task',
                security: [{ bearerAuth: [] }],
                parameters: [{
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
                }],
                responses: { 200: { description: 'Task deleted' } }
            }
            },
            '/api/auth/register-tenant': {
            post: {
                tags: ['Tenant Registration'],
                summary: 'Register a new tenant',
                requestBody: {
                required: true,
                   content: {
        'application/json': {
          schema: {
            required: [
              'organizationName',
              'subdomain',
              'adminEmail',
              'adminFullName',
              'password',
              'confirmPassword'
            ],
            properties: {
              organizationName: { type: 'string' },
              subdomain: { type: 'string' },
              adminEmail: { type: 'string' },
              adminFullName: { type: 'string' },
              password: { type: 'string' },
              confirmPassword: { type: 'string' }
            }
          }
        }
      }
                },
                responses: {
                201: { description: 'Tenant registered successfully' }
                }
            }
            },
                        '/api/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Logout user',
                security: [{ bearerAuth: [] }],
                responses: {
                200: { description: 'Logged out successfully' },
                401: { description: 'Unauthorized' }
                }
            }
            }



    }
    /* 👆 END */
  },

  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
