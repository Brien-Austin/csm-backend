import { TaskEntity } from '../entities/task.entity';
import { UserRto, toUserRto } from './user.rto';

export interface TaskRto {
  id: string;
  accountId: string;
  contactId?: string;
  assignedTo?: UserRto;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export function toTaskRto(task: TaskEntity): TaskRto {
  return {
    id: task.id,
    accountId: task.account.id,
    contactId: task.contact ? task.contact.id : undefined,
    assignedTo: task.assignedTo ? toUserRto(task.assignedTo) : undefined,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function toTaskRtoCollection(tasks: TaskEntity[]): TaskRto[] {
  return tasks.map(toTaskRto);
}
