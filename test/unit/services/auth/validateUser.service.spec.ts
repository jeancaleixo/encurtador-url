import { ValidateUserService } from 'src/modules/auth/services/validateUser.service';
import { UserRepositoryInMemory } from 'src/modules/users/repository/userRepositoryInMemory';
import { hash } from 'bcrypt';
import { User } from 'src/modules/users/entities/User';

let validateUserService: ValidateUserService;
let userRepositoryInMemory: UserRepositoryInMemory;

describe('Validate User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    validateUserService = new ValidateUserService(userRepositoryInMemory);
  });

  it('should be able to return user when credentials are correct', async () => {
    const userPassWordWithoutEncrypt = 'senha123';

    const user = new User({
      email: 'email@email.com',
      name: 'jean',
      password: await hash(userPassWordWithoutEncrypt, 10),
    });

    userRepositoryInMemory.users.push(user);

    const result = await validateUserService.execute({
      email: user.email,
      password: userPassWordWithoutEncrypt,
    });
    expect(result).toEqual(user);
  });
});
