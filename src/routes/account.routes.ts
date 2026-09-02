import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { ContactController } from '../controllers/contact.controller';
import { ActivityController } from '../controllers/activity.controller';
import { TaskController } from '../controllers/task.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  CreateAccountDtoSchema,
  UpdateAccountDtoSchema,
  AccountQueryDtoSchema,
  AccountParamDtoSchema,
} from '../dtos/account.dto';
import { ContactQueryDtoSchema } from '../dtos/contact.dto';
import { ActivityQueryDtoSchema } from '../dtos/activity.dto';
import { TaskQueryDtoSchema } from '../dtos/task.dto';

const router = Router();

router.post(
  '/',
  validateRequest({ body: CreateAccountDtoSchema }),
  AccountController.createAccount
);

router.get(
  '/',
  validateRequest({ query: AccountQueryDtoSchema }),
  AccountController.getAllAccounts
);

router.get(
  '/:id',
  validateRequest({ params: AccountParamDtoSchema }),
  AccountController.getAccountById
);

router.patch(
  '/:id',
  validateRequest({ params: AccountParamDtoSchema, body: UpdateAccountDtoSchema }),
  AccountController.updateAccount
);

router.delete(
  '/:id',
  validateRequest({ params: AccountParamDtoSchema }),
  AccountController.deleteAccount
);

// Nested child resource endpoints for Account ID context
router.get(
  '/:accountId/contacts',
  validateRequest({ query: ContactQueryDtoSchema }),
  ContactController.getContactsByAccount
);

router.get(
  '/:accountId/activities',
  validateRequest({ query: ActivityQueryDtoSchema }),
  ActivityController.getActivities
);

router.get(
  '/:accountId/tasks',
  validateRequest({ query: TaskQueryDtoSchema }),
  TaskController.getTasks
);

export default router;
