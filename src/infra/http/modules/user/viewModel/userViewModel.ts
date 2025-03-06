import { User } from 'src/modules/users/entities/User';

export class UserViewModel {
  static toHttp({ createdAt, name, email, id }: User) {
    return {
      id,
      name,
      email,
      createdAt,
    };
  }
}
