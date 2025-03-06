import { CreateUserService } from '../../../../src/modules/users/services/createUser.service';
import { UserRepositoryInMemory } from '../../../../src/modules/users/repository/userRepositoryInMemory';
import { ConflictException } from '@nestjs/common';
import { compare } from 'bcrypt';

describe('Create User', () => {
  let createUserService: CreateUserService;
  let userRepositoryInMemory: UserRepositoryInMemory;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserService = new CreateUserService(userRepositoryInMemory);
  });

  it('should create a new user with hashed password', async () => {
    const userData = {
      email: 'email@email.com',
      name: 'Jean de Castro',
      password: 'senha123',
    };

    const createdUser = await createUserService.execute(userData);

    expect(createdUser).toHaveProperty('id');
    expect(createdUser.id).toBeDefined();
    expect(createdUser.email).toBe(userData.email);
    expect(createdUser.name).toBe(userData.name);

    const isPasswordValid = await compare(
      userData.password,
      createdUser.password,
    );
    expect(isPasswordValid).toBe(true);

    expect(userRepositoryInMemory.users.length).toBe(1);
    expect(userRepositoryInMemory.users[0]).toEqual(createdUser);
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      email: 'duplicate@email.com',
      name: 'First User',
      password: 'senha123',
    };

    await createUserService.execute(userData);

    await expect(
      createUserService.execute({
        ...userData,
        name: 'Second User',
        password: 'senha123',
      }),
    ).rejects.toThrow(ConflictException);

    expect(userRepositoryInMemory.users.length).toBe(1);
  });

  it('should generate different ids for different users', async () => {
    const user1 = await createUserService.execute({
      email: 'one@email.com',
      name: 'User One',
      password: 'senha123',
    });

    const user2 = await createUserService.execute({
      email: 'two@email.com',
      name: 'User Two',
      password: 'senha123',
    });

    expect(user1.id).not.toBe(user2.id);
    expect(userRepositoryInMemory.users.length).toBe(2);
  });

  it('should handle empty password gracefully', async () => {
    await expect(
      createUserService.execute({
        email: 'sem@senha.com',
        name: 'Test User',
        password: '',
      }),
    ).rejects.toThrow();
  });
});
