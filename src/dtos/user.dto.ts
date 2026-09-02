import { z } from 'zod';
import { UserRole } from '../enums/user.enum';

export const CreateUserDtoSchema = z.object({
  email: z.string().email('Invalid email address format'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

export const UserParamDtoSchema = z.object({
  id: z.string().uuid('Invalid user UUID format'),
});

export type UserParamDto = z.infer<typeof UserParamDtoSchema>;
