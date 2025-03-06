/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequestModel } from './models/authRequestModel';

@Controller()
export class AuthController {
  @Post('signIn')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  signIn(@Request() req: AuthRequestModel) {
    return req.user;
  }
}
