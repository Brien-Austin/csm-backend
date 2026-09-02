import { z } from 'zod';

export const CreateContactDtoSchema = z.object({
  accountId: z.string().uuid('Account ID must be a valid UUID'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  title: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
});

export type CreateContactDto = z.infer<typeof CreateContactDtoSchema>;

export const UpdateContactDtoSchema = CreateContactDtoSchema.omit({ accountId: true }).partial();

export type UpdateContactDto = z.infer<typeof UpdateContactDtoSchema>;

export const ContactQueryDtoSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  accountId: z.string().uuid().optional(),
});

export type ContactQueryDto = z.infer<typeof ContactQueryDtoSchema>;

export const ContactParamDtoSchema = z.object({
  id: z.string().uuid('Invalid Contact UUID format'),
});

export type ContactParamDto = z.infer<typeof ContactParamDtoSchema>;
