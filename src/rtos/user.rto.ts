import { UserEntity } from '../entities/user.entity';

export interface UserRto {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toUserRto(user: UserEntity): UserRto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function toUserRtoCollection(users: UserEntity[]): UserRto[] {
  return users.map(toUserRto);
}
