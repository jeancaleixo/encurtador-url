/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { SignInService } from 'src/modules/auth/services/signIn.service';
import { User } from 'src/modules/users/entities/User';

let signInService: SignInService;
let jwtService: JwtService;

describe('Sign In', () => {
  beforeEach(() => {
    jwtService = new JwtService({ secret: 'secret' });
    signInService = new SignInService(jwtService);
  });
  it('should be able to return a jwt token when user is signed in', async () => {
    const userPassWordWithoutEncrypt = 'senha123';
    const user = new User({
      email: 'email@email.com',
      name: 'jean',
      password: await hash(userPassWordWithoutEncrypt, 10),
    });

    const token = await signInService.execute({ user });
    const payload = jwtService.decode(token);

    expect(payload.sub).toEqual(user.id);
  });
});
