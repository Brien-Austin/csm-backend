import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  CreateTaskDtoSchema,
  UpdateTaskDtoSchema,
  TaskQueryDtoSchema,
  TaskParamDtoSchema,
} from '../dtos/task.dto';

const router = Router();

router.post(
  '/',
  validateRequest({ body: CreateTaskDtoSchema }),
  TaskController.createTask
);

router.get(
  '/',
  validateRequest({ query: TaskQueryDtoSchema }),
  TaskController.getTasks
);

router.get(
  '/:id',
  validateRequest({ params: TaskParamDtoSchema }),
  TaskController.getTaskById
);

router.patch(
  '/:id',
  validateRequest({ params: TaskParamDtoSchema, body: UpdateTaskDtoSchema }),
  TaskController.updateTask
);

router.delete(
  '/:id',
  validateRequest({ params: TaskParamDtoSchema }),
  TaskController.deleteTask
);

export default router;
