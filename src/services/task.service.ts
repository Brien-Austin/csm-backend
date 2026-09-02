import { EntityManager } from '@mikro-orm/postgresql';
import { TaskEntity } from '../entities/task.entity';
import { AccountEntity } from '../entities/account.entity';
import { ContactEntity } from '../entities/contact.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from '../dtos/task.dto';
import { TaskRto, toTaskRto, toTaskRtoCollection } from '../rtos/task.rto';
import { AppError } from '../utils/app-error';

export class TaskService {
  constructor(private readonly entityManager: EntityManager) {}

  async createTask(taskInputData: CreateTaskDto): Promise<TaskRto> {
    const parentAccountEntity = await this.entityManager.findOne(AccountEntity, {
      id: taskInputData.accountId,
    });
    
    const isParentAccountMissing = !parentAccountEntity;
    if (isParentAccountMissing) {
      throw AppError.notFound(`Account with ID '${taskInputData.accountId}' not found`);
    }

    const hasContactId = Boolean(taskInputData.contactId);
    const relatedContactEntity = hasContactId
      ? await this.entityManager.findOne(ContactEntity, { id: taskInputData.contactId })
      : null;

    const isRelatedContactMissing = hasContactId && !relatedContactEntity;
    if (isRelatedContactMissing) {
      throw AppError.notFound(`Contact with ID '${taskInputData.contactId}' not found`);
    }

    const hasAssignedToId = Boolean(taskInputData.assignedToId);
    const assignedUserEntity = hasAssignedToId
      ? await this.entityManager.findOne(UserEntity, { id: taskInputData.assignedToId })
      : null;

    const isAssignedUserMissing = hasAssignedToId && !assignedUserEntity;
    if (isAssignedUserMissing) {
      throw AppError.notFound(`Assigned User '${taskInputData.assignedToId}' not found`);
    }

    const dueDateValue = taskInputData.dueDate ? new Date(taskInputData.dueDate) : undefined;

    const newTaskEntity = new TaskEntity({
      account: parentAccountEntity,
      title: taskInputData.title,
      status: taskInputData.status,
      priority: taskInputData.priority,
      description: taskInputData.description,
      dueDate: dueDateValue,
      contact: relatedContactEntity || undefined,
      assignedTo: assignedUserEntity || undefined,
    });

    await this.entityManager.persistAndFlush(newTaskEntity);
    return toTaskRto(newTaskEntity);
  }

  async getTaskById(taskId: string): Promise<TaskRto> {
    const foundTaskEntity = await this.entityManager.findOne(
      TaskEntity,
      { id: taskId },
      { populate: ['account', 'contact', 'assignedTo'] }
    );

    const isTaskNotFound = !foundTaskEntity;
    if (isTaskNotFound) {
      throw AppError.notFound(`Task with ID '${taskId}' not found`);
    }

    return toTaskRto(foundTaskEntity);
  }

  async getTasks(filterOptions: TaskQueryDto): Promise<{ tasks: TaskRto[]; total: number }> {
    const pageNumber = filterOptions.page || 1;
    const itemsPerPage = filterOptions.limit || 10;
    const searchFilterText = filterOptions.search;
    const targetAccountId = filterOptions.accountId;
    const taskStatusFilter = filterOptions.status;
    const taskPriorityFilter = filterOptions.priority;
    const queryOffset = (pageNumber - 1) * itemsPerPage;

    const hasAccountIdFilter = Boolean(targetAccountId);
    const hasStatusFilter = Boolean(taskStatusFilter);
    const hasPriorityFilter = Boolean(taskPriorityFilter);
    const hasSearchFilterText = Boolean(searchFilterText);

    const searchCondition = hasSearchFilterText
      ? [
          { title: { $ilike: `%${searchFilterText}%` } },
          { description: { $ilike: `%${searchFilterText}%` } },
        ]
      : [];

    const queryFilters = {
      ...(hasAccountIdFilter ? { account: targetAccountId } : {}),
      ...(hasStatusFilter ? { status: taskStatusFilter } : {}),
      ...(hasPriorityFilter ? { priority: taskPriorityFilter } : {}),
      ...(hasSearchFilterText ? { $or: searchCondition } : {}),
    };

    const [taskEntitiesList, totalTasksCount] = await this.entityManager.findAndCount(
      TaskEntity,
      queryFilters,
      {
        limit: itemsPerPage,
        offset: queryOffset,
        orderBy: { createdAt: 'DESC' },
        populate: ['account', 'contact', 'assignedTo'],
      }
    );

    return {
      tasks: toTaskRtoCollection(taskEntitiesList),
      total: totalTasksCount,
    };
  }

  async updateTask(taskId: string, updateInputData: UpdateTaskDto): Promise<TaskRto> {
    const existingTaskEntity = await this.entityManager.findOne(
      TaskEntity,
      { id: taskId },
      { populate: ['account', 'contact', 'assignedTo'] }
    );

    const isTaskNotFound = !existingTaskEntity;
    if (isTaskNotFound) {
      throw AppError.notFound(`Task with ID '${taskId}' not found`);
    }

    this.entityManager.assign(existingTaskEntity, updateInputData);
    await this.entityManager.flush();

    return toTaskRto(existingTaskEntity);
  }

  async deleteTask(taskId: string): Promise<void> {
    const existingTaskEntity = await this.entityManager.findOne(TaskEntity, { id: taskId });

    const isTaskNotFound = !existingTaskEntity;
    if (isTaskNotFound) {
      throw AppError.notFound(`Task with ID '${taskId}' not found`);
    }

    await this.entityManager.removeAndFlush(existingTaskEntity);
  }
}
