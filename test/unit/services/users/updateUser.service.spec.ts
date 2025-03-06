import { UpdateUserService } from '../../../../src/modules/users/services/updateUser.service';
import { UserRepositoryInMemory } from '../../../../src/modules/users/repository/userRepositoryInMemory';
import { User } from '../../../../src/modules/users/entities/User';
import { hash, compare } from 'bcrypt';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('Update User', () => {
  let updateUserService: UpdateUserService;
  let userRepositoryInMemory: UserRepositoryInMemory;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    updateUserService = new UpdateUserService(userRepositoryInMemory);
  });

  it('should be able to update a user', async () => {
    const originalPassword = await hash('password123', 10);
    const user = new User({
      email: 'user@email.com',
      name: 'User',
      password: originalPassword,
    });
    await userRepositoryInMemory.create(user);

    const updatedUser = await updateUserService.execute({
      userId: user.id,
      email: 'new@email.com',
      name: 'New Name',
      password: 'newpassword',
    });

    expect(updatedUser.email).toBe('new@email.com');
    expect(updatedUser.name).toBe('New Name');

    const isPasswordValid = await compare('newpassword', updatedUser.password);
    expect(isPasswordValid).toBe(true);

    const repositoryUser = await userRepositoryInMemory.findById(user.id);
    expect(repositoryUser).toEqual(updatedUser);
  });

  it('should throw ConflictException when email is already in use', async () => {
    const user1 = new User({
      email: 'user1@email.com',
      name: 'User1',
      password: await hash('pass1', 10),
    });
    const user2 = new User({
      email: 'user2@email.com',
      name: 'User2',
      password: await hash('pass2', 10),
    });
    await userRepositoryInMemory.create(user1);
    await userRepositoryInMemory.create(user2);

    await expect(
      updateUserService.execute({
        userId: user1.id,
        email: user2.email,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    await expect(
      updateUserService.execute({
        userId: 'non-existent-id',
        name: 'Test',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update only the name when other fields are not provided', async () => {
    const originalEmail = 'original@email.com';
    const originalPassword = await hash('password123', 10);
    const originalName = 'Original Name';
    const user = new User({
      email: originalEmail,
      name: originalName,
      password: originalPassword,
    });
    await userRepositoryInMemory.create(user);

    const updatedName = 'Updated Name';
    const updatedUser = await updateUserService.execute({
      userId: user.id,
      name: updatedName,
    });

    expect(updatedUser.name).toBe(updatedName);
    expect(updatedUser.email).toBe(originalEmail);
    expect(updatedUser.password).toBe(originalPassword);
  });

  it('should allow updating email to the same email', async () => {
    const user = new User({
      email: 'user@email.com',
      name: 'User',
      password: await hash('password', 10),
    });
    await userRepositoryInMemory.create(user);

    const updatedUser = await updateUserService.execute({
      userId: user.id,
      email: user.email,
    });

    expect(updatedUser.email).toBe(user.email);
  });

  it('should update only the password', async () => {
    const originalEmail = 'user@email.com';
    const originalName = 'User';
    const originalPassword = await hash('oldpassword', 10);
    const user = new User({
      email: originalEmail,
      name: originalName,
      password: originalPassword,
    });
    await userRepositoryInMemory.create(user);

    const newPassword = 'newpassword';
    const updatedUser = await updateUserService.execute({
      userId: user.id,
      password: newPassword,
    });

    const isPasswordValid = await compare(newPassword, updatedUser.password);
    expect(isPasswordValid).toBe(true);
    expect(updatedUser.email).toBe(originalEmail);
    expect(updatedUser.name).toBe(originalName);
  });
});
