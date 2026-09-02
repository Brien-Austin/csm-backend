import { Router, Request, Response } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import { openApiSpecification } from '../docs/openapi.spec';

const router = Router();

// Serve raw OpenAPI JSON specification
router.get('/docs/json', (_request: Request, response: Response) => {
  response.setHeader('Content-Type', 'application/json');
  response.send(openApiSpecification);
});

// Serve Interactive Scalar API Reference UI on /docs
router.use(
  '/docs',
  apiReference({
    spec: {
      content: openApiSpecification,
    },
    theme: 'purple',
    pageTitle: 'CSM API Documentation',
  })
);

export default router;
