/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { UserModule } from './infra/http/modules/user/user.module';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './infra/http/modules/auth/auth.module';
import { APP_GUARD, Reflector } from '@nestjs/core'; // Adicione Reflector
import { JwtAuthGuard } from './infra/http/modules/auth/guards/jwtAuth.Guard';
import { UrlModule } from './infra/http/modules/url/url.module';

@Module({
  imports: [UserModule, UrlModule, DatabaseModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    Reflector,
  ],
})
export class AppModule {}
