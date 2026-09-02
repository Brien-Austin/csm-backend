import { z } from 'zod';
import { ActivityType } from '../enums/activity.enum';

export const CreateActivityDtoSchema = z.object({
  accountId: z.string().uuid('Account ID must be a valid UUID'),
  contactId: z.string().uuid().optional(),
  type: z.nativeEnum(ActivityType).optional().default(ActivityType.NOTE),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  activityDate: z.string().datetime().optional().or(z.string().date().optional()),
  performedById: z.string().uuid().optional(),
});

export type CreateActivityDto = z.infer<typeof CreateActivityDtoSchema>;

export const UpdateActivityDtoSchema = CreateActivityDtoSchema.omit({ accountId: true }).partial();

export type UpdateActivityDto = z.infer<typeof UpdateActivityDtoSchema>;

export const ActivityQueryDtoSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  accountId: z.string().uuid().optional(),
  type: z.nativeEnum(ActivityType).optional(),
});

export type ActivityQueryDto = z.infer<typeof ActivityQueryDtoSchema>;

export const ActivityParamDtoSchema = z.object({
  id: z.string().uuid('Invalid Activity UUID format'),
});

export type ActivityParamDto = z.infer<typeof ActivityParamDtoSchema>;
