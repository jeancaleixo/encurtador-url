import { User as PrismaUser } from '@prisma/client';
import { User } from 'src/modules/users/entities/User';

export class PrismaUserMapper {
  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id,
      createdAt: user.createdAt,
      name: user.name,
      email: user.email,
      password: user.password,
      updatedAt: user.updatedAt,
    };
  }

  static toDomain(raw: PrismaUser): User {
    return new User(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
