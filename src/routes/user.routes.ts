import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  CreateUserDtoSchema,
  UpdateUserDtoSchema,
  UserParamDtoSchema,
} from '../dtos/user.dto';
import { PaginationQueryDtoSchema } from '../dtos/common.dto';

const router = Router();

router.post(
  '/',
  validateRequest({ body: CreateUserDtoSchema }),
  UserController.createUser
);

router.get(
  '/',
  validateRequest({ query: PaginationQueryDtoSchema }),
  UserController.getAllUsers
);

router.get(
  '/:id',
  validateRequest({ params: UserParamDtoSchema }),
  UserController.getUserById
);

router.patch(
  '/:id',
  validateRequest({ params: UserParamDtoSchema, body: UpdateUserDtoSchema }),
  UserController.updateUser
);

router.delete(
  '/:id',
  validateRequest({ params: UserParamDtoSchema }),
  UserController.deleteUser
);

export default router;
