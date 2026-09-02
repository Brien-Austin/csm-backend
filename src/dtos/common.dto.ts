import { z } from 'zod';

export const PaginationQueryDtoSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
});

export type PaginationQueryDto = z.infer<typeof PaginationQueryDtoSchema>;
