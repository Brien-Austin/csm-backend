export const openApiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'CSM Backend API',
    version: '1.0.0',
    description: 'Interactive API Documentation for CSM Module 1 (Accounts, Contacts, Activities, Tasks, Users) built with Express.js, TypeScript, and MikroORM.',
    contact: {
      name: 'Brien Austin',
      email: 'brienaustinclayton@gmail.com',
    },
  },
  servers: [
    {
      url: '/',
      description: 'Current Application Server (Live Production / Dev)',
    },
    {
      url: 'http://localhost:4000',
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Server & Database Health Check',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'System is healthy',
          },
          '503': {
            description: 'System is degraded',
          },
        },
      },
    },
    '/api/v1/accounts': {
      post: {
        summary: 'Create a new Account',
        tags: ['Accounts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accountName'],
                properties: {
                  accountName: { type: 'string', example: 'Acme Technologies' },
                  accountType: { type: 'string', enum: ['Customer', 'Prospect', 'Partner', 'Reseller', 'Former Customer', 'Trial'], example: 'Prospect' },
                  segment: { type: 'string', enum: ['Enterprise', 'Mid-Market', 'SMB'], example: 'Enterprise' },
                  website: { type: 'string', example: 'https://acme.com' },
                  accountDomain: { type: 'string', example: 'acme.com' },
                  hqCountry: { type: 'string', example: 'India' },
                  hqState: { type: 'string', example: 'Kerala' },
                  operatingCountries: { type: 'array', items: { type: 'string' }, example: ['India', 'USA'] },
                  healthStatus: { type: 'string', enum: ['Healthy', 'Neutral', 'At Risk', 'Critical'], example: 'Healthy' },
                  riskLevel: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'], example: 'Low' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Account created successfully' },
        },
      },
      get: {
        summary: 'List Accounts',
        tags: ['Accounts'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'accountType', in: 'query', schema: { type: 'string' } },
          { name: 'segment', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Paginated list of Accounts' },
        },
      },
    },
    '/api/v1/accounts/{id}': {
      get: {
        summary: 'Get Account by ID',
        tags: ['Accounts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Account details' }, '404': { description: 'Account not found' } },
      },
      patch: {
        summary: 'Update Account by ID',
        tags: ['Accounts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Account updated successfully' } },
      },
      delete: {
        summary: 'Delete Account by ID',
        tags: ['Accounts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Account deleted successfully' } },
      },
    },
    '/api/v1/contacts': {
      post: {
        summary: 'Create a Contact linked to an Account',
        tags: ['Contacts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accountId', 'firstName', 'lastName', 'email'],
                properties: {
                  accountId: { type: 'string', format: 'uuid' },
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Smith' },
                  email: { type: 'string', example: 'john.smith@acme.com' },
                  title: { type: 'string', example: 'VP of Customer Success' },
                  isPrimary: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Contact created successfully' } },
      },
      get: {
        summary: 'List Contacts',
        tags: ['Contacts'],
        parameters: [
          { name: 'accountId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Paginated list of Contacts' } },
      },
    },
    '/api/v1/activities': {
      post: {
        summary: 'Log Activity for an Account',
        tags: ['Activities'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accountId', 'subject'],
                properties: {
                  accountId: { type: 'string', format: 'uuid' },
                  contactId: { type: 'string', format: 'uuid' },
                  type: { type: 'string', enum: ['Call', 'Email', 'Meeting', 'Note', 'Review'], example: 'Meeting' },
                  subject: { type: 'string', example: 'Executive Business Review Q3' },
                  description: { type: 'string', example: 'Reviewed roadmap and ARR renewal goals.' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Activity logged successfully' } },
      },
      get: {
        summary: 'List Activities',
        tags: ['Activities'],
        responses: { '200': { description: 'Paginated list of Activities' } },
      },
    },
    '/api/v1/tasks': {
      post: {
        summary: 'Create Follow-up Task',
        tags: ['Tasks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accountId', 'title'],
                properties: {
                  accountId: { type: 'string', format: 'uuid' },
                  contactId: { type: 'string', format: 'uuid' },
                  title: { type: 'string', example: 'Send renewed contract proposal' },
                  status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], example: 'Pending' },
                  priority: { type: 'string', enum: ['Low', 'Medium', 'High', 'Urgent'], example: 'High' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Task created successfully' } },
      },
      get: {
        summary: 'List Tasks',
        tags: ['Tasks'],
        responses: { '200': { description: 'Paginated list of Tasks' } },
      },
    },
    '/api/v1/users': {
      post: { summary: 'Create User', tags: ['Users'], responses: { '201': { description: 'User created' } } },
      get: { summary: 'List Users', tags: ['Users'], responses: { '200': { description: 'List of Users' } } },
    },
  },
};
