/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthRequestModel } from './models/authRequestModel';
import { SignInService } from 'src/modules/auth/services/signIn.service';
import { LocalAuthGuard } from './guards/localAuth.Guard';
import { Public } from './decorators/isPublic';

@Controller()
export class AuthController {
  constructor(private signInService: SignInService) {}
  @Post('signIn')
  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() req: AuthRequestModel) {
    const access_token = await this.signInService.execute({
      user: req.user,
    });
    return { access_token };
  }
}
