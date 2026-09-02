import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { AccountEntity } from './account.entity';
import { ContactEntity } from './contact.entity';
import { UserEntity } from './user.entity';
import { ActivityType } from '../enums/activity.enum';

@Entity({ schema: 'account', tableName: 'activities' })
export class ActivityEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity, { deleteRule: 'cascade' })
  account!: AccountEntity;

  @ManyToOne(() => ContactEntity, { nullable: true, deleteRule: 'set null' })
  contact?: ContactEntity;

  @Enum({ items: () => ActivityType, default: ActivityType.NOTE })
  type: ActivityType = ActivityType.NOTE;

  @Property({ type: 'string' })
  subject!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'datetime' })
  activityDate: Date = new Date();

  @ManyToOne(() => UserEntity, { nullable: true })
  performedBy?: UserEntity;

  constructor({
    account,
    subject,
    type = ActivityType.NOTE,
    activityDate = new Date(),
    description,
    contact,
    performedBy,
  }: {
    account: AccountEntity;
    subject: string;
    type?: ActivityType;
    activityDate?: Date;
    description?: string;
    contact?: ContactEntity;
    performedBy?: UserEntity;
  }) {
    super();
    this.account = account;
    this.subject = subject;
    this.type = type;
    this.activityDate = activityDate;
    this.description = description;
    this.contact = contact;
    this.performedBy = performedBy;
  }
}
