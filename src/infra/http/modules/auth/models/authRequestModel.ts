import { Request } from 'express';
import { User } from 'src/modules/users/entities/User';

export class AuthRequestModel extends Request {
  user: User;
}
