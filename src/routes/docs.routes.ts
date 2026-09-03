import { Router, Request, Response } from 'express';
import { openApiSpecification } from '../docs/openapi.spec';

const router = Router();

// Endpoint 1: OpenAPI JSON specification
router.get('/docs/json', (_request: Request, response: Response) => {
  response.setHeader('Content-Type', 'application/json');
  response.send(openApiSpecification);
});

// Endpoint 2: Interactive Scalar API Reference UI (Inline Spec for Instant Loading)
router.get('/docs', (_request: Request, response: Response) => {
  const specJsonString = JSON.stringify(openApiSpecification);

  const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <title>CSM API Reference - Scalar</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #0f172a;
      }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      type="application/json"
      data-configuration='{
        "theme": "purple",
        "showSidebar": true,
        "searchHotKey": "k",
        "hideDownloadButton": false
      }'>
      ${specJsonString}
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;

  response.setHeader('Content-Type', 'text/html');
  response.status(200).send(htmlContent);
});

// Alias route: /reference -> /docs
router.get('/reference', (request: Request, response: Response) => {
  response.redirect('/docs');
});

export default router;
