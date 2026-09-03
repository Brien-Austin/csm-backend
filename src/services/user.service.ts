import { EntityManager } from '@mikro-orm/postgresql';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { PaginationQueryDto } from '../dtos/common.dto';
import { UserRto, toUserRto, toUserRtoCollection } from '../rtos/user.rto';
import { PaginatedResult } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';

export class UserService {
  constructor(private readonly entityManager: EntityManager) {}

  async createUser(userCreationData: CreateUserDto): Promise<UserRto> {
    const existingUserWithEmail = await this.entityManager.findOne(UserEntity, {
      email: userCreationData.email,
    });
    
    const isEmailAlreadyRegistered = Boolean(existingUserWithEmail);
    if (isEmailAlreadyRegistered) {
      throw AppError.conflict(`User with email '${userCreationData.email}' already exists`);
    }

    const newUser = new UserEntity({
      email: userCreationData.email,
      name: userCreationData.name,
      role: userCreationData.role,
    });

    await this.entityManager.persistAndFlush(newUser);
    return toUserRto(newUser);
  }

  async getUserById(userId: string): Promise<UserRto> {
    const foundUser = await this.entityManager.findOne(UserEntity, { id: userId });
    
    const isUserNotFound = !foundUser;
    if (isUserNotFound) {
      throw AppError.notFound(`User with ID '${userId}' not found`);
    }

    return toUserRto(foundUser);
  }

  async getAllUsers(paginationOptions: PaginationQueryDto): Promise<PaginatedResult<UserRto>> {
    const pageNumber = paginationOptions.page || 1;
    const itemsPerPage = paginationOptions.limit || 10;
    const searchFilterText = paginationOptions.search;
    const queryOffset = (pageNumber - 1) * itemsPerPage;

    const hasSearchFilter = Boolean(searchFilterText);
    const searchCriteria = hasSearchFilter
      ? {
          $or: [
            { email: { $ilike: `%${searchFilterText}%` } },
            { name: { $ilike: `%${searchFilterText}%` } },
          ],
        }
      : {};

    const [userEntitiesList, totalUsersCount] = await this.entityManager.findAndCount(
      UserEntity,
      searchCriteria,
      {
        limit: itemsPerPage,
        offset: queryOffset,
        orderBy: { createdAt: 'DESC' },
      }
    );

    return {
      items: toUserRtoCollection(userEntitiesList),
      total: totalUsersCount,
      page: pageNumber,
      limit: itemsPerPage,
    };
  }

  async updateUser(userId: string, updateData: UpdateUserDto): Promise<UserRto> {
    const existingUser = await this.entityManager.findOne(UserEntity, { id: userId });
    
    const isUserNotFound = !existingUser;
    if (isUserNotFound) {
      throw AppError.notFound(`User with ID '${userId}' not found`);
    }

    const isEmailBeingChanged = Boolean(updateData.email) && updateData.email !== existingUser.email;
    if (isEmailBeingChanged) {
      const emailOwnerUser = await this.entityManager.findOne(UserEntity, {
        email: updateData.email,
      });
      const isEmailTakenByAnotherUser = Boolean(emailOwnerUser);
      if (isEmailTakenByAnotherUser) {
        throw AppError.conflict(`User with email '${updateData.email}' already exists`);
      }
    }

    this.entityManager.assign(existingUser, updateData);
    await this.entityManager.flush();

    return toUserRto(existingUser);
  }

  async deleteUser(userId: string): Promise<void> {
    const existingUser = await this.entityManager.findOne(UserEntity, { id: userId });
    
    const isUserNotFound = !existingUser;
    if (isUserNotFound) {
      throw AppError.notFound(`User with ID '${userId}' not found`);
    }

    await this.entityManager.removeAndFlush(existingUser);
  }
}
