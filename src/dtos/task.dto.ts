import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../enums/task.enum';

export const CreateTaskDtoSchema = z.object({
  accountId: z.string().uuid('Account ID must be a valid UUID'),
  contactId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.PENDING),
  priority: z.nativeEnum(TaskPriority).optional().default(TaskPriority.MEDIUM),
  dueDate: z.string().datetime().optional().or(z.string().date().optional()),
});

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;

export const UpdateTaskDtoSchema = CreateTaskDtoSchema.omit({ accountId: true }).partial();

export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoSchema>;

export const TaskQueryDtoSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  accountId: z.string().uuid().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
});

export type TaskQueryDto = z.infer<typeof TaskQueryDtoSchema>;

export const TaskParamDtoSchema = z.object({
  id: z.string().uuid('Invalid Task UUID format'),
});

export type TaskParamDto = z.infer<typeof TaskParamDtoSchema>;
