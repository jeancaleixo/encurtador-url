/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const result = super.canActivate(context);

      if (result instanceof Promise) {
        return result.then(() => true).catch(() => true);
      }

      if (result instanceof Observable) {
        return new Observable((subscriber) => {
          subscriber.next(true);
          subscriber.complete();
        });
      }

      return true;
    } catch (error) {
      return true;
    }
  }

  handleRequest(err: any, user: any) {
    return user || null;
  }
}
