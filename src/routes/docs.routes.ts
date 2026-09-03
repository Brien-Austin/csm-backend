import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiSpecification } from '../docs/openapi.spec';

const router = Router();

// Serve raw OpenAPI JSON specification
router.get('/docs/json', (_request: Request, response: Response) => {
  response.setHeader('Content-Type', 'application/json');
  response.send(openApiSpecification);
});

// Serve Swagger UI on /api-docs and /docs (Exact match for learnet-stage-backend style)
const swaggerUiOptions = {
  customSiteTitle: 'CSM Backend API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
};

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpecification, swaggerUiOptions));
router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecification, swaggerUiOptions));

export default router;
