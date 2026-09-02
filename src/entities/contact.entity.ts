import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { AccountEntity } from './account.entity';

@Entity({ schema: 'account', tableName: 'contacts' })
export class ContactEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity, { deleteRule: 'cascade' })
  account!: AccountEntity;

  @Property({ type: 'string' })
  firstName!: string;

  @Property({ type: 'string' })
  lastName!: string;

  @Property({ type: 'string' })
  email!: string;

  @Property({ type: 'string', nullable: true })
  phone?: string;

  @Property({ type: 'string', nullable: true })
  title?: string;

  @Property({ type: 'boolean', default: false })
  isPrimary: boolean = false;

  constructor({
    account,
    firstName,
    lastName,
    email,
    phone,
    title,
    isPrimary = false,
  }: {
    account: AccountEntity;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    title?: string;
    isPrimary?: boolean;
  }) {
    super();
    this.account = account;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.title = title;
    this.isPrimary = isPrimary;
  }
}
