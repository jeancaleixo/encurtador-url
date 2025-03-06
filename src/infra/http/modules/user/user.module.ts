import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserService } from 'src/modules/users/services/createUser.service';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [CreateUserService],
})
export class UserModule {}
