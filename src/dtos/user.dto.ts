import { z } from 'zod';

export const CreateUserDtoSchema = z.object({
  email: z.string().email('Invalid email address format'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  role: z.enum(['admin', 'user', 'manager']).optional().default('user'),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  role: z.enum(['admin', 'user', 'manager']).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

export const UserParamDtoSchema = z.object({
  id: z.string().uuid('Invalid user UUID format'),
});

export type UserParamDto = z.infer<typeof UserParamDtoSchema>;
