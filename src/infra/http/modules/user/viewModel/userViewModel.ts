import { User } from 'src/modules/users/entities/User';

export class UserViewModel {
  static toHttp({ createdAt, name, email, id, urls }: User) {
    return {
      id,
      name,
      email,
      urls: urls || [],
      createdAt,
    };
  }
}
