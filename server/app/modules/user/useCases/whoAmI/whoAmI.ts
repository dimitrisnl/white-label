import User from '../../models/User';

export function whoAmI() {
  async function execute(user: User): Promise<User> {
    await user.load('orgs');
    return user;
  }

  return {execute};
}
