import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  CreateContactDtoSchema,
  UpdateContactDtoSchema,
  ContactQueryDtoSchema,
  ContactParamDtoSchema,
} from '../dtos/contact.dto';

const router = Router();

router.post(
  '/',
  validateRequest({ body: CreateContactDtoSchema }),
  ContactController.createContact
);

router.get(
  '/',
  validateRequest({ query: ContactQueryDtoSchema }),
  ContactController.getContactsByAccount
);

router.get(
  '/:id',
  validateRequest({ params: ContactParamDtoSchema }),
  ContactController.getContactById
);

router.patch(
  '/:id',
  validateRequest({ params: ContactParamDtoSchema, body: UpdateContactDtoSchema }),
  ContactController.updateContact
);

router.delete(
  '/:id',
  validateRequest({ params: ContactParamDtoSchema }),
  ContactController.deleteContact
);

export default router;
