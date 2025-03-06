import { User } from '../entities/User';
import { UserRepository } from './userRepository';

export class UserRepositoryInMemory implements UserRepository {
  public users: User[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(userId: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === userId);
    return user || null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      return null;
    }
    return user || null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async update(updatedUser: User): Promise<void> {
    const userIndex = this.users.findIndex(
      (user) => user.id === updatedUser.id,
    );

    if (userIndex >= 0) {
      this.users[userIndex] = updatedUser;
    }
  }
}
