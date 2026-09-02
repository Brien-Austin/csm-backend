import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { AccountEntity } from './account.entity';
import { ContactEntity } from './contact.entity';
import { UserEntity } from './user.entity';
import { TaskStatus, TaskPriority } from '../enums/task.enum';

@Entity({ schema: 'account', tableName: 'tasks' })
export class TaskEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity, { deleteRule: 'cascade' })
  account!: AccountEntity;

  @ManyToOne(() => ContactEntity, { nullable: true, deleteRule: 'set null' })
  contact?: ContactEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  assignedTo?: UserEntity;

  @Property({ type: 'string' })
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Enum({ items: () => TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus = TaskStatus.PENDING;

  @Enum({ items: () => TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority = TaskPriority.MEDIUM;

  @Property({ type: 'datetime', nullable: true })
  dueDate?: Date;

  constructor({
    account,
    title,
    status = TaskStatus.PENDING,
    priority = TaskPriority.MEDIUM,
    description,
    dueDate,
    contact,
    assignedTo,
  }: {
    account: AccountEntity;
    title: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    description?: string;
    dueDate?: Date;
    contact?: ContactEntity;
    assignedTo?: UserEntity;
  }) {
    super();
    this.account = account;
    this.title = title;
    this.status = status;
    this.priority = priority;
    this.description = description;
    this.dueDate = dueDate;
    this.contact = contact;
    this.assignedTo = assignedTo;
  }
}
