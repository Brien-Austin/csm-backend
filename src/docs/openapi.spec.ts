export const openApiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'CSM Backend API',
    version: '1.0.0',
    description:
      'Interactive API Documentation for CSM Module 1 — Manual Data Intake (Accounts, Contacts, Activities, Tasks, Users). Built with Express.js, TypeScript, MikroORM, and PostgreSQL.',
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
  tags: [
    {
      name: 'Health',
      description: 'System health and readiness checks',
    },
    {
      name: 'Accounts',
      description:
        'Feature 1 & 2 — Account Creation and Updates. The root entity of Module 1. Every other Module 1 record references the Account ID.',
    },
    {
      name: 'Contacts',
      description:
        'Feature 3 — Contact Management. People attached to an Account. Each Contact belongs to one Account (MVP).',
    },
    {
      name: 'Activities',
      description:
        'Feature 4 — Activity Management. Interactions and events recorded against an Account; optionally against a specific Contact.',
    },
    {
      name: 'Tasks',
      description:
        'Feature 5 — Task Management. Follow-up work items created against an Account; optionally against a specific Contact.',
    },
    {
      name: 'Users',
      description: 'Internal user management. Users are referenced by Accounts as Primary CSM or Account Manager.',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Server & Database Health Check',
        tags: ['Health'],
        responses: {
          '200': { description: 'System is healthy' },
          '503': { description: 'System is degraded' },
        },
      },
    },

    // ──────────────────────────────────────────────────────────────────────────
    // ACCOUNTS
    // ──────────────────────────────────────────────────────────────────────────
    '/api/v1/accounts': {
      post: {
        summary: 'Create a new Account',
        description:
          'Creates the parent customer entity and generates the Account ID. Every other Module 1 record (Contacts, Activities, Tasks) will reference this Account ID.',
        tags: ['Accounts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateAccountRequest' },
              example: {
                accountName: 'Acme Technologies',
                accountType: 'Customer',
                segment: 'Enterprise',
                website: 'https://acme.com',
                accountDomain: 'acme.com',
                hqCountry: 'India',
                hqState: 'Kerala',
                operatingCountries: ['India', 'USA', 'UK'],
                operatingStates: ['Kerala', 'Karnataka', 'Tamil Nadu'],
                reportingRegion: 'APAC',
                customerType: 'Direct Customer',
                lifecycleStage: 'Onboarding',
                accountTier: 'Tier 1',
                isStrategic: true,
                industry: 'SaaS',
                companySize: '201-500',
                healthStatus: 'Healthy',
                riskLevel: 'Low',
                riskReasons: [],
                healthNotes: 'Customer is actively onboarding and engaged.',
                healthScore: 82,
                csmTeam: 'Enterprise CS',
                contractStartDate: '2026-01-01',
                contractEndDate: '2026-12-31',
                renewalDate: '2026-12-01',
                contractValueArr: 50000.00,
                billingCurrency: 'USD',
                planTier: 'Enterprise',
                primaryCustomerGoal: 'Reduce onboarding time by 40%',
                useCases: ['Analytics', 'Automation'],
                successCriteria: '80% active-user adoption within 90 days',
                customerSince: '2024-05-10',
                onboardingStartDate: '2026-01-03',
                goLiveDate: '2026-02-01',
                nextReviewDate: '2026-10-02',
                dataSource: 'Manual',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Account created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AccountSuccessResponse' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '409': { $ref: '#/components/responses/Conflict' },
        },
      },
      get: {
        summary: 'List Accounts with filters and pagination',
        description:
          'Returns a paginated list of Accounts. Supports search by name, domain, and website; and filtering by all major enum dimensions.',
        tags: ['Accounts'],
        parameters: [
          { name: 'page', in: 'query', description: 'Page number (1-indexed)', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', description: 'Items per page', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', description: 'Search by account name, website, or domain', schema: { type: 'string' } },
          { name: 'accountType', in: 'query', schema: { type: 'string', enum: ['Customer', 'Prospect', 'Partner', 'Reseller', 'Former Customer', 'Trial'] } },
          { name: 'segment', in: 'query', schema: { type: 'string', enum: ['Enterprise', 'Mid-Market', 'SMB'] } },
          { name: 'healthStatus', in: 'query', schema: { type: 'string', enum: ['Healthy', 'Neutral', 'At Risk', 'Critical'] } },
          { name: 'riskLevel', in: 'query', schema: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] } },
          { name: 'lifecycleStage', in: 'query', schema: { type: 'string', enum: ['Onboarding', 'Active / Adoption', 'Renewal', 'Churned', 'Reactivation'] } },
          { name: 'accountTier', in: 'query', schema: { type: 'string', enum: ['Tier 1', 'Tier 2', 'Tier 3'] } },
          { name: 'recordStatus', in: 'query', schema: { type: 'string', enum: ['Active', 'Archived'] } },
          { name: 'isStrategic', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          '200': {
            description: 'Paginated list of Accounts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AccountPaginatedResponse' },
              },
            },
          },
        },
      },
    },

    '/api/v1/accounts/{id}': {
      get: {
        summary: 'Get Account by ID',
        description: 'Retrieves a single Account record with all fields and populated User references (Primary CSM, Account Manager).',
        tags: ['Accounts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Account details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AccountSuccessResponse' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        summary: 'Update Account by ID',
        description: 'Partially updates an Account. All fields are optional. Account Name can be changed; Account ID is immutable.',
        tags: ['Accounts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateAccountRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Account updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AccountSuccessResponse' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        summary: 'Archive Account by ID (soft delete)',
        description:
          'Archives the Account by setting recordStatus to "Archived". No data is physically deleted. All child records (Contacts, Activities, Tasks) are preserved per the data retention policy. Use PATCH /:id/archive for explicit soft-archive semantics.',
        tags: ['Accounts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Account archived successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AccountSuccessResponse' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
          '409': { $ref: '#/components/responses/Conflict' },
        },
      },
    },

    '/api/v1/accounts/{id}/archive': {
      patch: {
        summary: 'Archive Account (explicit soft archive)',
        description:
          'Sets the Account recordStatus to "Archived". Preserves all historical Contacts, Activities, and Tasks. Returns 409 if the Account is already archived.',
        tags: ['Accounts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Account archived successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AccountSuccessResponse' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
          '409': { $ref: '#/components/responses/Conflict' },
        },
      },
    },

    // Nested Account child resource endpoints
    '/api/v1/accounts/{accountId}/contacts': {
      get: {
        summary: 'List Contacts for an Account',
        description: 'Returns all Contacts belonging to the specified Account. Child records reference Account ID as the relational key.',
        tags: ['Contacts'],
        parameters: [
          { name: 'accountId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Paginated list of Contacts for Account' } },
      },
    },

    '/api/v1/accounts/{accountId}/activities': {
      get: {
        summary: 'List Activities for an Account',
        description: 'Returns all Activities recorded against the specified Account.',
        tags: ['Activities'],
        parameters: [
          { name: 'accountId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { '200': { description: 'Paginated list of Activities for Account' } },
      },
    },

    '/api/v1/accounts/{accountId}/tasks': {
      get: {
        summary: 'List Tasks for an Account',
        description: 'Returns all Tasks created against the specified Account.',
        tags: ['Tasks'],
        parameters: [
          { name: 'accountId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { '200': { description: 'Paginated list of Tasks for Account' } },
      },
    },

    // ──────────────────────────────────────────────────────────────────────────
    // CONTACTS
    // ──────────────────────────────────────────────────────────────────────────
    '/api/v1/contacts': {
      post: {
        summary: 'Create a Contact linked to an Account',
        description: 'Creates a Contact person record. Must reference a valid Account ID. Each Contact belongs to one Account in the MVP.',
        tags: ['Contacts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accountId', 'firstName', 'lastName', 'email'],
                properties: {
                  accountId: { type: 'string', format: 'uuid', description: 'Account ID this Contact belongs to (relational key)' },
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Smith' },
                  email: { type: 'string', format: 'email', example: 'john.smith@acme.com' },
                  phone: { type: 'string', example: '+1-555-000-1234' },
                  title: { type: 'string', example: 'VP of Customer Success' },
                  isPrimary: { type: 'boolean', example: true, description: 'Whether this is the primary contact for the Account' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Contact created successfully' },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { description: 'Account not found' },
        },
      },
      get: {
        summary: 'List Contacts',
        tags: ['Contacts'],
        parameters: [
          { name: 'accountId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filter by Account ID' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by name or email' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { '200': { description: 'Paginated list of Contacts' } },
      },
    },

    '/api/v1/contacts/{id}': {
      get: {
        summary: 'Get Contact by ID',
        tags: ['Contacts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Contact details' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
      patch: {
        summary: 'Update Contact by ID',
        tags: ['Contacts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  title: { type: 'string' },
                  isPrimary: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Contact updated' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        summary: 'Delete Contact by ID',
        tags: ['Contacts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Contact deleted' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
    },

    // ──────────────────────────────────────────────────────────────────────────
    // ACTIVITIES
    // ──────────────────────────────────────────────────────────────────────────
    '/api/v1/activities': {
      post: {
        summary: 'Log an Activity for an Account',
        description: 'Records an interaction or event against an Account. Contact is optional — set contactId when the activity involves a specific person.',
        tags: ['Activities'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accountId', 'subject'],
                properties: {
                  accountId: { type: 'string', format: 'uuid', description: 'Account ID (required relational key)' },
                  contactId: { type: 'string', format: 'uuid', description: 'Optional Contact ID when activity involves a specific person' },
                  type: { type: 'string', enum: ['Call', 'Email', 'Meeting', 'Note', 'Review'], example: 'Meeting' },
                  subject: { type: 'string', example: 'Executive Business Review Q3' },
                  description: { type: 'string', example: 'Reviewed roadmap and ARR renewal goals.' },
                  activityDate: { type: 'string', format: 'date-time', example: '2026-09-02T10:00:00+05:30' },
                  performedById: { type: 'string', format: 'uuid', description: 'User ID of the CSM who performed the activity' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Activity logged successfully' },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
      get: {
        summary: 'List Activities',
        tags: ['Activities'],
        parameters: [
          { name: 'accountId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'contactId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['Call', 'Email', 'Meeting', 'Note', 'Review'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { '200': { description: 'Paginated list of Activities' } },
      },
    },

    '/api/v1/activities/{id}': {
      get: {
        summary: 'Get Activity by ID',
        tags: ['Activities'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Activity details' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
      patch: {
        summary: 'Update Activity by ID',
        tags: ['Activities'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['Call', 'Email', 'Meeting', 'Note', 'Review'] },
                  subject: { type: 'string' },
                  description: { type: 'string' },
                  activityDate: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Activity updated' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        summary: 'Delete Activity by ID',
        tags: ['Activities'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Activity deleted' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
    },

    // ──────────────────────────────────────────────────────────────────────────
    // TASKS
    // ──────────────────────────────────────────────────────────────────────────
    '/api/v1/tasks': {
      post: {
        summary: 'Create a Follow-up Task',
        description: 'Creates a follow-up work item against an Account. Contact is optional — set contactId when the task concerns a specific person.',
        tags: ['Tasks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accountId', 'title'],
                properties: {
                  accountId: { type: 'string', format: 'uuid', description: 'Account ID (required relational key)' },
                  contactId: { type: 'string', format: 'uuid', description: 'Optional Contact ID when task concerns a specific person' },
                  assignedToId: { type: 'string', format: 'uuid', description: 'User ID of the assignee' },
                  title: { type: 'string', example: 'Send renewed contract proposal' },
                  description: { type: 'string', example: 'Prepare updated SOW and send for signature.' },
                  status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], example: 'Pending' },
                  priority: { type: 'string', enum: ['Low', 'Medium', 'High', 'Urgent'], example: 'High' },
                  dueDate: { type: 'string', format: 'date-time', example: '2026-10-15T17:00:00+05:30' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Task created successfully' },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
      get: {
        summary: 'List Tasks',
        tags: ['Tasks'],
        parameters: [
          { name: 'accountId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'contactId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'] } },
          { name: 'priority', in: 'query', schema: { type: 'string', enum: ['Low', 'Medium', 'High', 'Urgent'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { '200': { description: 'Paginated list of Tasks' } },
      },
    },

    '/api/v1/tasks/{id}': {
      get: {
        summary: 'Get Task by ID',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Task details' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
      patch: {
        summary: 'Update Task by ID',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'] },
                  priority: { type: 'string', enum: ['Low', 'Medium', 'High', 'Urgent'] },
                  dueDate: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Task updated' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        summary: 'Delete Task by ID',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Task deleted' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
    },

    // ──────────────────────────────────────────────────────────────────────────
    // USERS
    // ──────────────────────────────────────────────────────────────────────────
    '/api/v1/users': {
      post: {
        summary: 'Create User',
        description: 'Creates an internal user. Users are referenced in Accounts as Primary CSM or Account Manager.',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'name'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'csm@company.com' },
                  name: { type: 'string', example: 'Jane Doe' },
                  role: { type: 'string', enum: ['admin', 'user', 'manager', 'csm'], example: 'csm' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'User created' }, '400': { $ref: '#/components/responses/BadRequest' } },
      },
      get: {
        summary: 'List Users',
        tags: ['Users'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { '200': { description: 'List of Users' } },
      },
    },

    '/api/v1/users/{id}': {
      get: {
        summary: 'Get User by ID',
        tags: ['Users'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'User details' }, '404': { $ref: '#/components/responses/NotFound' } },
      },
      patch: {
        summary: 'Update User by ID',
        tags: ['Users'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, role: { type: 'string' }, isActive: { type: 'boolean' } } } } },
        },
        responses: { '200': { description: 'User updated' } },
      },
      delete: {
        summary: 'Delete User by ID',
        tags: ['Users'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'User deleted' } },
      },
    },
  },

  components: {
    schemas: {
      // ── Account Request Schemas ────────────────────────────────────────────
      CreateAccountRequest: {
        type: 'object',
        required: ['accountName'],
        properties: {
          // 1. Account Identity
          accountName: { type: 'string', description: 'Customer/company display name. Used for search and display; not the relational key.', example: 'Acme Technologies' },
          externalAccountId: { type: 'string', description: 'ID of the Account in an external platform (e.g. Salesforce 001...).', example: '001ABC123' },
          externalSource: { type: 'string', enum: ['Salesforce', 'HubSpot', 'Other'], description: 'Origin system for the external ID.' },
          accountType: { type: 'string', enum: ['Customer', 'Prospect', 'Partner', 'Reseller', 'Former Customer', 'Trial'], default: 'Prospect', description: 'Business relationship classification. Different concept from Lifecycle Stage.' },
          website: { type: 'string', format: 'uri', description: 'Primary company website. Must be a valid URL.', example: 'https://acme.com' },
          accountDomain: { type: 'string', description: 'Normalized internet domain. Useful for matching Contacts and imports.', example: 'acme.com' },

          // 2. Headquarters and Geography
          hqCountry: { type: 'string', description: 'Country of company headquarters (standardised country name).', example: 'India' },
          hqState: { type: 'string', description: 'State/province of headquarters. Choices depend on hqCountry.', example: 'Kerala' },
          operatingCountries: { type: 'array', items: { type: 'string' }, description: 'Countries where the customer operates or has meaningful users. Stored as a structured list.', example: ['India', 'USA', 'UK'] },
          operatingStates: { type: 'array', items: { type: 'string' }, description: 'States/regions relevant to footprint or user distribution.', example: ['Kerala', 'Karnataka', 'Tamil Nadu'] },
          reportingRegion: { type: 'string', enum: ['APAC', 'EMEA', 'North America', 'LATAM'], description: 'Higher-level reporting geography abstraction. Does not replace hqCountry or hqState.' },

          // 3. Customer Classification
          segment: { type: 'string', enum: ['Enterprise', 'Mid-Market', 'SMB'], description: 'Commercial/customer segment. Data Dictionary controlled.' },
          customerType: { type: 'string', enum: ['Direct Customer', 'Partner', 'Reseller', 'Prospect', 'Former Customer'], description: 'Business/customer relationship category.' },
          lifecycleStage: { type: 'string', enum: ['Onboarding', 'Active / Adoption', 'Renewal', 'Churned', 'Reactivation'], default: 'Onboarding', description: 'Current lifecycle position. Separate from Health Status and Risk Level.' },
          accountTier: { type: 'string', enum: ['Tier 1', 'Tier 2', 'Tier 3'], description: 'Service/commercial priority tier. Configurable.' },
          isStrategic: { type: 'boolean', default: false, description: 'High-touch strategic treatment flag.' },
          industry: { type: 'string', enum: ['SaaS', 'Financial Services', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Professional Services', 'Media', 'Telecom', 'Government', 'Nonprofit', 'Other'], description: 'Primary industry classification. Reporting dimension.' },
          companySize: { type: 'string', enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'], description: 'Approximate organisation size as a band/range.' },

          // 4. Health and Risk
          healthStatus: { type: 'string', enum: ['Healthy', 'Neutral', 'At Risk', 'Critical'], description: 'Current overall Account health. Initial human assessment.' },
          riskLevel: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'], description: 'Current customer risk level. Independent from Health Status.' },
          riskReasons: { type: 'array', items: { type: 'string', enum: ['Low Adoption', 'Support Issues', 'Champion Loss', 'Budget Risk', 'Competition', 'Renewal Risk', 'Relationship Risk', 'Product Gap', 'Other'] }, description: 'Structured multi-select risk reason tags for reporting and automation.' },
          healthNotes: { type: 'string', description: 'Free narrative context behind the health/risk assessment. Preserves reasoning.' },
          healthScore: { type: 'number', minimum: 0, maximum: 100, description: 'Numerical score (0-100). Do not populate before an agreed scoring model exists.' },

          // 5. Ownership
          primaryCsmId: { type: 'string', format: 'uuid', description: 'UUID of the internal User who is the primary CSM for this Account.' },
          csmTeam: { type: 'string', description: 'Team responsible for the Account.', example: 'Enterprise CS' },
          accountManagerId: { type: 'string', format: 'uuid', description: 'UUID of the internal User who is the commercial relationship owner (AE).' },
          csmStartDate: { type: 'string', format: 'date', description: 'Date the current CSM took ownership. Supports ownership analytics.', example: '2026-09-02' },

          // 6. Commercial and Contract
          contractStartDate: { type: 'string', format: 'date', description: 'Start date of current agreement.', example: '2026-01-01' },
          contractEndDate: { type: 'string', format: 'date', description: 'End date of current agreement.', example: '2026-12-31' },
          renewalDate: { type: 'string', format: 'date', description: 'Expected renewal decision/action date. May differ from contractEndDate.', example: '2026-12-01' },
          contractValueArr: { type: 'number', minimum: 0, description: 'Annualised commercial value (ARR). Stored as numeric decimal — not free text.', example: 50000.00 },
          billingCurrency: { type: 'string', enum: ['USD', 'EUR', 'GBP', 'INR'], description: 'ISO 4217 currency code for monetary values.' },
          planTier: { type: 'string', description: 'Customer product package.', example: 'Enterprise' },

          // 7. Customer Context
          primaryCustomerGoal: { type: 'string', description: 'Main outcome the customer wants to achieve.', example: 'Reduce onboarding time by 40%' },
          useCases: { type: 'array', items: { type: 'string', enum: ['Analytics', 'Automation', 'Reporting', 'Integrations', 'Collaboration', 'Compliance', 'Onboarding', 'Support', 'Other'] }, description: 'Structured multi-select use-case tags. Controlled Data Dictionary values.' },
          successCriteria: { type: 'string', description: 'How the customer defines success. Can become structured goals later.', example: '80% active-user adoption within 90 days' },
          keyProducts: { type: 'array', items: { type: 'string' }, description: 'Product/module entity reference IDs purchased or in scope.' },

          // 8. Lifecycle and Review Freshness
          customerSince: { type: 'string', format: 'date', description: 'Start of the customer relationship (historical date).', example: '2024-05-10' },
          onboardingStartDate: { type: 'string', format: 'date', description: 'Date onboarding began. Lifecycle milestone.', example: '2026-01-03' },
          goLiveDate: { type: 'string', format: 'date', description: 'Date customer became live. Lifecycle milestone.', example: '2026-02-01' },
          lastCsmReviewDate: { type: 'string', format: 'date-time', description: 'Most recent review timestamp (ISO 8601 with timezone). Detects stale health/risk data.' },
          nextReviewDate: { type: 'string', format: 'date', description: 'Next planned review date.', example: '2026-10-02' },

          // 9. System Metadata (creatable)
          recordStatus: { type: 'string', enum: ['Active', 'Archived'], default: 'Active', description: 'Whether the Account is active or archived. Prefer archive over hard delete.' },
          dataSource: { type: 'string', enum: ['Manual', 'CRM Import', 'Migration', 'API'], default: 'Manual', description: 'How the Account entered the platform.' },
        },
      },

      UpdateAccountRequest: {
        type: 'object',
        description: 'All fields are optional. Only provided fields will be updated. Account ID is immutable.',
        properties: {
          accountName: { type: 'string' },
          externalAccountId: { type: 'string' },
          externalSource: { type: 'string', enum: ['Salesforce', 'HubSpot', 'Other'] },
          accountType: { type: 'string', enum: ['Customer', 'Prospect', 'Partner', 'Reseller', 'Former Customer', 'Trial'] },
          website: { type: 'string', format: 'uri' },
          accountDomain: { type: 'string' },
          hqCountry: { type: 'string' },
          hqState: { type: 'string' },
          operatingCountries: { type: 'array', items: { type: 'string' } },
          operatingStates: { type: 'array', items: { type: 'string' } },
          reportingRegion: { type: 'string', enum: ['APAC', 'EMEA', 'North America', 'LATAM'] },
          segment: { type: 'string', enum: ['Enterprise', 'Mid-Market', 'SMB'] },
          customerType: { type: 'string', enum: ['Direct Customer', 'Partner', 'Reseller', 'Prospect', 'Former Customer'] },
          lifecycleStage: { type: 'string', enum: ['Onboarding', 'Active / Adoption', 'Renewal', 'Churned', 'Reactivation'] },
          accountTier: { type: 'string', enum: ['Tier 1', 'Tier 2', 'Tier 3'] },
          isStrategic: { type: 'boolean' },
          industry: { type: 'string', enum: ['SaaS', 'Financial Services', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Professional Services', 'Media', 'Telecom', 'Government', 'Nonprofit', 'Other'] },
          companySize: { type: 'string', enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'] },
          healthStatus: { type: 'string', enum: ['Healthy', 'Neutral', 'At Risk', 'Critical'] },
          riskLevel: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] },
          riskReasons: { type: 'array', items: { type: 'string', enum: ['Low Adoption', 'Support Issues', 'Champion Loss', 'Budget Risk', 'Competition', 'Renewal Risk', 'Relationship Risk', 'Product Gap', 'Other'] } },
          healthNotes: { type: 'string' },
          healthScore: { type: 'number', minimum: 0, maximum: 100 },
          primaryCsmId: { type: 'string', format: 'uuid' },
          csmTeam: { type: 'string' },
          accountManagerId: { type: 'string', format: 'uuid' },
          csmStartDate: { type: 'string', format: 'date' },
          contractStartDate: { type: 'string', format: 'date' },
          contractEndDate: { type: 'string', format: 'date' },
          renewalDate: { type: 'string', format: 'date' },
          contractValueArr: { type: 'number', minimum: 0 },
          billingCurrency: { type: 'string', enum: ['USD', 'EUR', 'GBP', 'INR'] },
          planTier: { type: 'string' },
          primaryCustomerGoal: { type: 'string' },
          useCases: { type: 'array', items: { type: 'string', enum: ['Analytics', 'Automation', 'Reporting', 'Integrations', 'Collaboration', 'Compliance', 'Onboarding', 'Support', 'Other'] } },
          successCriteria: { type: 'string' },
          keyProducts: { type: 'array', items: { type: 'string' } },
          customerSince: { type: 'string', format: 'date' },
          onboardingStartDate: { type: 'string', format: 'date' },
          goLiveDate: { type: 'string', format: 'date' },
          lastCsmReviewDate: { type: 'string', format: 'date-time' },
          nextReviewDate: { type: 'string', format: 'date' },
          recordStatus: { type: 'string', enum: ['Active', 'Archived'] },
          dataSource: { type: 'string', enum: ['Manual', 'CRM Import', 'Migration', 'API'] },
        },
      },

      // ── Account Response Schemas ───────────────────────────────────────────
      AccountResponse: {
        type: 'object',
        description: 'Full Account record returned from the API.',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Account ID — the immutable primary relational key for all Module 1 child records.' },
          accountName: { type: 'string' },
          externalAccountId: { type: 'string' },
          externalSource: { type: 'string', enum: ['Salesforce', 'HubSpot', 'Other'] },
          accountType: { type: 'string', enum: ['Customer', 'Prospect', 'Partner', 'Reseller', 'Former Customer', 'Trial'] },
          website: { type: 'string' },
          accountDomain: { type: 'string' },
          hqCountry: { type: 'string' },
          hqState: { type: 'string' },
          operatingCountries: { type: 'array', items: { type: 'string' } },
          operatingStates: { type: 'array', items: { type: 'string' } },
          reportingRegion: { type: 'string', enum: ['APAC', 'EMEA', 'North America', 'LATAM'] },
          segment: { type: 'string', enum: ['Enterprise', 'Mid-Market', 'SMB'] },
          customerType: { type: 'string', enum: ['Direct Customer', 'Partner', 'Reseller', 'Prospect', 'Former Customer'] },
          lifecycleStage: { type: 'string', enum: ['Onboarding', 'Active / Adoption', 'Renewal', 'Churned', 'Reactivation'] },
          accountTier: { type: 'string', enum: ['Tier 1', 'Tier 2', 'Tier 3'] },
          isStrategic: { type: 'boolean' },
          industry: { type: 'string', enum: ['SaaS', 'Financial Services', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Professional Services', 'Media', 'Telecom', 'Government', 'Nonprofit', 'Other'] },
          companySize: { type: 'string', enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'] },
          healthStatus: { type: 'string', enum: ['Healthy', 'Neutral', 'At Risk', 'Critical'] },
          riskLevel: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] },
          riskReasons: { type: 'array', items: { type: 'string' } },
          healthNotes: { type: 'string' },
          healthScore: { type: 'number', minimum: 0, maximum: 100 },
          primaryCsm: { $ref: '#/components/schemas/UserReference' },
          csmTeam: { type: 'string' },
          accountManager: { $ref: '#/components/schemas/UserReference' },
          csmStartDate: { type: 'string', format: 'date-time' },
          contractStartDate: { type: 'string', format: 'date-time' },
          contractEndDate: { type: 'string', format: 'date-time' },
          renewalDate: { type: 'string', format: 'date-time' },
          contractValueArr: { type: 'number' },
          billingCurrency: { type: 'string', enum: ['USD', 'EUR', 'GBP', 'INR'] },
          planTier: { type: 'string' },
          primaryCustomerGoal: { type: 'string' },
          useCases: { type: 'array', items: { type: 'string' } },
          successCriteria: { type: 'string' },
          keyProducts: { type: 'array', items: { type: 'string' } },
          customerSince: { type: 'string', format: 'date-time' },
          onboardingStartDate: { type: 'string', format: 'date-time' },
          goLiveDate: { type: 'string', format: 'date-time' },
          lastCsmReviewDate: { type: 'string', format: 'date-time' },
          nextReviewDate: { type: 'string', format: 'date-time' },
          createdBy: { $ref: '#/components/schemas/UserReference' },
          updatedBy: { $ref: '#/components/schemas/UserReference' },
          recordStatus: { type: 'string', enum: ['Active', 'Archived'] },
          dataSource: { type: 'string', enum: ['Manual', 'CRM Import', 'Migration', 'API'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      AccountSuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Account created successfully' },
          data: { $ref: '#/components/schemas/AccountResponse' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },

      AccountPaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'array', items: { $ref: '#/components/schemas/AccountResponse' } },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' },
              hasNextPage: { type: 'boolean' },
              hasPreviousPage: { type: 'boolean' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },

      UserReference: {
        type: 'object',
        description: 'Lightweight user reference embedded in Account responses.',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string' },
        },
      },
    },

    responses: {
      BadRequest: {
        description: 'Validation failed — one or more fields are invalid.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Validation failed' },
                error: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'BAD_REQUEST' },
                    details: { type: 'array', items: { type: 'object' } },
                  },
                },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
      NotFound: {
        description: 'The requested resource was not found.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Account with ID x not found' },
                error: { type: 'object', properties: { code: { type: 'string', example: 'NOT_FOUND' } } },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
      Conflict: {
        description: 'The request conflicts with an existing resource state.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Account with name x already exists' },
                error: { type: 'object', properties: { code: { type: 'string', example: 'CONFLICT' } } },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  },
};
