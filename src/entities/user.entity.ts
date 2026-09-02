import { Entity, Property, Unique, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { UserRole } from '../enums/user.enum';

@Entity({ schema: 'identity', tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Property({ type: 'string' })
  @Unique()
  email!: string;

  @Property({ type: 'string' })
  name!: string;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRole = UserRole.USER;

  @Property({ type: 'boolean', default: true })
  isActive: boolean = true;

  constructor({
    email,
    name,
    role = UserRole.USER,
    isActive = true,
  }: {
    email: string;
    name: string;
    role?: UserRole;
    isActive?: boolean;
  }) {
    super();
    this.email = email;
    this.name = name;
    this.role = role;
    this.isActive = isActive;
  }
}
