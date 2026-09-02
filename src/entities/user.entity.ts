import { Entity, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Property({ type: 'string' })
  @Unique()
  email!: string;

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string', default: 'user' })
  role: string = 'user';

  @Property({ type: 'boolean', default: true })
  isActive: boolean = true;
}
