import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '../repository/userRepository';
import { hash } from 'bcrypt';
import { User } from '../entities/User';

interface UpdateUserRequest {
  userId: string;
  email?: string;
  password?: string;
  name?: string;
}

@Injectable()
export class UpdateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
    email,
    password,
    name,
  }: UpdateUserRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (email && email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(email);
      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
      user.email = email;
    }

    if (password) {
      user.password = await hash(password, 10);
    }

    if (name) {
      user.name = name;
    }

    await this.userRepository.update(user);
    return user;
  }
}
