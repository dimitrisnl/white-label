import {DateTime} from 'luxon';

import User from '../models/User';
import VerifyEmailToken from '../models/VerifyEmailToken';

export interface VerifyEmailService {
  generateToken(user: User): Promise<string>;
  deleteToken(user: User): Promise<void>;
  getUserByToken(token: string): Promise<User | undefined>;
}

export function getVerifyEmailService(): VerifyEmailService {
  async function generateToken(user: User) {
    // Delete any existing tokens.
    await deleteToken(user);

    const tokenRecord = await user.related('verifyEmailToken').create({
      expiresAt: DateTime.now().plus({hour: 48}),
    });

    return tokenRecord.id;
  }

  async function deleteToken(user: User) {
    await user.related('verifyEmailToken').query().delete();
  }

  async function getUserByToken(token: string) {
    const record = await VerifyEmailToken.query()
      .preload('user')
      .where('id', token)
      .where('expiresAt', '>', DateTime.now().toSQL()!)
      .first();

    return record?.user;
  }

  return {
    generateToken,
    deleteToken,
    getUserByToken,
  };
}
