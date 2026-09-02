import { EntityManager } from '@mikro-orm/postgresql';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto, PaginationQueryDto } from '../dtos/user.dto';
import { UserRto, toUserRto, toUserRtoCollection } from '../rtos/user.rto';
import { AppError } from '../utils/app-error';

export class UserService {
  constructor(private readonly em: EntityManager) {}

  async createUser(dto: CreateUserDto): Promise<UserRto> {
    const existingUser = await this.em.findOne(UserEntity, { email: dto.email });
    if (existingUser) {
      throw AppError.conflict(`User with email '${dto.email}' already exists`);
    }

    const user = new UserEntity({
      email: dto.email,
      name: dto.name,
      role: dto.role,
    });

    await this.em.persistAndFlush(user);
    return toUserRto(user);
  }

  async getUserById(id: string): Promise<UserRto> {
    const user = await this.em.findOne(UserEntity, { id });
    if (!user) {
      throw AppError.notFound(`User with ID '${id}' not found`);
    }
    return toUserRto(user);
  }

  async getAllUsers(query: PaginationQueryDto): Promise<{ users: UserRto[]; total: number }> {
    const { page = 1, limit = 10, search } = query;
    const offset = (page - 1) * limit;

    const where = search
      ? {
          $or: [
            { email: { $ilike: `%${search}%` } },
            { name: { $ilike: `%${search}%` } },
          ],
        }
      : {};

    const [users, total] = await this.em.findAndCount(UserEntity, where, {
      limit,
      offset,
      orderBy: { createdAt: 'DESC' },
    });

    return {
      users: toUserRtoCollection(users),
      total,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserRto> {
    const user = await this.em.findOne(UserEntity, { id });
    if (!user) {
      throw AppError.notFound(`User with ID '${id}' not found`);
    }

    if (dto.email && dto.email !== user.email) {
      const emailConflict = await this.em.findOne(UserEntity, { email: dto.email });
      if (emailConflict) {
        throw AppError.conflict(`User with email '${dto.email}' already exists`);
      }
    }

    this.em.assign(user, dto);
    await this.em.flush();

    return toUserRto(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.em.findOne(UserEntity, { id });
    if (!user) {
      throw AppError.notFound(`User with ID '${id}' not found`);
    }

    await this.em.removeAndFlush(user);
  }
}
