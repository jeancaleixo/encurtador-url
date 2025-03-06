import { UserRepository } from 'src/modules/users/repository/userRepository';
import { PrismaService } from '../prisma.service';
import { User } from 'src/modules/users/entities/User';
import { PrismaUserMapper } from '../mappers/prismaUserMapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const userRaw = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data: userRaw,
    });
  }

  async findById(userId: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return prismaUser ? PrismaUserMapper.toDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });
    return prismaUser ? PrismaUserMapper.toDomain(prismaUser) : null;
  }

  async update(user: User): Promise<void> {
    const userRaw = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.update({
      where: { id: userRaw.id },
      data: userRaw,
    });
  }
}
