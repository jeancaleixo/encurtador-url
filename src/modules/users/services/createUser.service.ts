import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/userRepository';
import { hash } from 'bcrypt';
import { User } from '../entities/User';

interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

@Injectable()
export class CreateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password, name }: CreateUserRequest) {
    const user = new User({
      email,
      password: await hash(password, 10),
      name,
    });

    await this.userRepository.create(user);
  }
}
