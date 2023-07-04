import {DateTime} from 'luxon';

import PasswordResetToken from '../models/PasswordResetToken';
import User from '../models/User';

export interface PasswordResetService {
  generateToken(user: User): Promise<string>;
  deleteToken(user: User): Promise<void>;
  getUserByToken(token: string): Promise<User | undefined>;
}

export function getPasswordResetService(): PasswordResetService {
  async function generateToken(user: User) {
    // Delete any existing tokens.
    await deleteToken(user);

    const tokenRecord = await user.related('passwordResetToken').create({
      expiresAt: DateTime.now().plus({hour: 1}),
    });

    return tokenRecord.id;
  }

  async function deleteToken(user: User) {
    await user.related('passwordResetToken').query().delete();
  }

  async function getUserByToken(token: string) {
    const tokenRecord = await PasswordResetToken.query()
      .preload('user')
      .where('id', token)
      .where('expiresAt', '>', DateTime.now().toSQL()!)
      .first();

    return tokenRecord?.user;
  }

  return {
    generateToken,
    deleteToken,
    getUserByToken,
  };
}
