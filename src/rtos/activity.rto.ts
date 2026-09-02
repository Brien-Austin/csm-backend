import { ActivityEntity } from '../entities/activity.entity';
import { UserRto, toUserRto } from './user.rto';

export interface ActivityRto {
  id: string;
  accountId: string;
  contactId?: string;
  type: string;
  subject: string;
  description?: string;
  activityDate: string;
  performedBy?: UserRto;
  createdAt: string;
  updatedAt: string;
}

export function toActivityRto(activity: ActivityEntity): ActivityRto {
  return {
    id: activity.id,
    accountId: activity.account.id,
    contactId: activity.contact ? activity.contact.id : undefined,
    type: activity.type,
    subject: activity.subject,
    description: activity.description,
    activityDate: activity.activityDate.toISOString(),
    performedBy: activity.performedBy ? toUserRto(activity.performedBy) : undefined,
    createdAt: activity.createdAt.toISOString(),
    updatedAt: activity.updatedAt.toISOString(),
  };
}

export function toActivityRtoCollection(activities: ActivityEntity[]): ActivityRto[] {
  return activities.map(toActivityRto);
}
