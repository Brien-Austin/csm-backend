import { Router } from 'express';
import healthRoutes from './health.routes';
import docsRoutes from './docs.routes';
import userRoutes from './user.routes';
import accountRoutes from './account.routes';
import contactRoutes from './contact.routes';
import activityRoutes from './activity.routes';
import taskRoutes from './task.routes';

const router = Router();

// Health check and Scalar API Documentation routes
router.use('/', healthRoutes);
router.use('/', docsRoutes);

// API v1 routers
const apiV1Router = Router();
apiV1Router.use('/users', userRoutes);
apiV1Router.use('/accounts', accountRoutes);
apiV1Router.use('/contacts', contactRoutes);
apiV1Router.use('/activities', activityRoutes);
apiV1Router.use('/tasks', taskRoutes);

router.use('/api/v1', apiV1Router);

export default router;
