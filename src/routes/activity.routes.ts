import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  CreateActivityDtoSchema,
  UpdateActivityDtoSchema,
  ActivityQueryDtoSchema,
  ActivityParamDtoSchema,
} from '../dtos/activity.dto';

const router = Router();

router.post(
  '/',
  validateRequest({ body: CreateActivityDtoSchema }),
  ActivityController.createActivity
);

router.get(
  '/',
  validateRequest({ query: ActivityQueryDtoSchema }),
  ActivityController.getActivities
);

router.get(
  '/:id',
  validateRequest({ params: ActivityParamDtoSchema }),
  ActivityController.getActivityById
);

router.patch(
  '/:id',
  validateRequest({ params: ActivityParamDtoSchema, body: UpdateActivityDtoSchema }),
  ActivityController.updateActivity
);

router.delete(
  '/:id',
  validateRequest({ params: ActivityParamDtoSchema }),
  ActivityController.deleteActivity
);

export default router;
