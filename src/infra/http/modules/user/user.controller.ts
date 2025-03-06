import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserService } from 'src/modules/users/services/createUser.service';
import { CreateUserBody } from './dtos/createUserBody';
import { UserViewModel } from './viewModel/userViewModel';

@Controller('users')
export class UserController {
  constructor(private createUserService: CreateUserService) {}

  @Post()
  async createUser(@Body() body: CreateUserBody) {
    const { email, name, password } = body;
    const user = await this.createUserService.execute({
      email,
      name,
      password,
    });

    return UserViewModel.toHttp(user);
  }
}
