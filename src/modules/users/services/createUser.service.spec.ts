import { CreateUserService } from './createUser.service';
import { UserRepositoryInMemory } from '../repository/userRepositoryInMemory';

let createUserService: CreateUserService;
let userRepositoryInMemory: UserRepositoryInMemory;

describe('Create User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserService = new CreateUserService(userRepositoryInMemory);
  });

  it('should be able to create a new user', async () => {
    expect(userRepositoryInMemory.users).toEqual([]);
    const user = await createUserService.execute({
      email: 'email@email.com',
      name: 'Jean',
      password: 'senha123',
    });
    expect(userRepositoryInMemory.users).toEqual([user]);
  });
});
