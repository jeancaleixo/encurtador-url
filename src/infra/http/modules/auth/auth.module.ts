import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import { AuthController } from './auth.controller';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ValidateUserService } from 'src/modules/auth/services/validateUser.service';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { SignInDTOValidateMiddleware } from './middleware/signInDTOvalidate.middleware';

@Module({
  controllers: [DatabaseModule, AuthController],
  imports: [UserModule],
  providers: [LocalStrategy, ValidateUserService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignInDTOValidateMiddleware).forRoutes('signIn');
  }
}
