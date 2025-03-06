/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/User';
import { UserPayload } from '../models/userPayloadModel';
import { JwtService } from '@nestjs/jwt';

interface SignInRequest {
  user: User;
}

@Injectable()
export class SignInService {
  constructor(private jwtService: JwtService) {}
  async execute({ user }: SignInRequest) {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toJSON(),
    };

    const jwtToken = this.jwtService.sign(payload);
    return jwtToken;
  }
}
