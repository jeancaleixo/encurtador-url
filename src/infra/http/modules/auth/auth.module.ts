import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import { AuthController } from './auth.controller';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ValidateUserService } from 'src/modules/auth/services/validateUser.service';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { SignInDTOValidateMiddleware } from './middleware/signInDTOValidate.middleware';
import { SignInService } from 'src/modules/auth/services/signIn.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, ValidateUserService, SignInService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignInDTOValidateMiddleware).forRoutes('signIn');
  }
}
