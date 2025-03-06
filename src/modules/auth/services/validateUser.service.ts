import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserRepository } from 'src/modules/users/repository/userRepository';

interface ValidateUserRequest {
  email: string;
  password: string;
}

@Injectable()
export class ValidateUserService {
  constructor(private userRepository: UserRepository) {}
  async execute({ email, password }: ValidateUserRequest) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email ou senha Incorretos');

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect)
      throw new UnauthorizedException('Email ou senha Incorretos');

    return user;
  }
}
