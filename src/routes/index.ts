import { Router } from 'express';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';

const router = Router();

// Root health check endpoint
router.use('/', healthRoutes);

// API v1 routes
const apiV1Router = Router();
apiV1Router.use('/users', userRoutes);

router.use('/api/v1', apiV1Router);

export default router;
