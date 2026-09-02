import { ContactEntity } from '../entities/contact.entity';

export interface ContactRto {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toContactRto(contact: ContactEntity): ContactRto {
  return {
    id: contact.id,
    accountId: contact.account.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    title: contact.title,
    isPrimary: contact.isPrimary,
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
  };
}

export function toContactRtoCollection(contacts: ContactEntity[]): ContactRto[] {
  return contacts.map(toContactRto);
}
