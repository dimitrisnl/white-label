import {faker} from '@faker-js/faker';
import Hash from '@ioc:Adonis/Core/Hash';
import {test} from '@japa/runner';
import * as E from 'fp-ts/Either';
import {pipe} from 'fp-ts/lib/function';
import {DateTime} from 'luxon';

import {UserFactory} from '@/database/factories/UserFactory';

import {getPasswordResetService} from '../../services/passwordResetService';
import {resetPassword} from './resetPassword';

test.group('resetPassword', () => {
  test('should reset password if token belongs to user', async ({assert}) => {
    const newPassword = 'newPassword';
    const oldPassword = 'oldPassword';

    const user = await UserFactory.merge({password: oldPassword}).create();
    const token = await user.related('passwordResetToken').create({
      expiresAt: DateTime.now().plus({hour: 1}),
    });

    await resetPassword({
      passwordResetService: getPasswordResetService(),
    }).execute({
      token: token.id,
      password: newPassword,
    });

    await user.refresh();

    const isPasswordValid = await Hash.verify(user.password, newPassword);
    assert.isTrue(isPasswordValid);
  });

  test('should not reset password if token does not belong to user', async ({
    assert,
  }) => {
    const newPassword = 'newPassword';

    const result = await resetPassword({
      passwordResetService: getPasswordResetService(),
    }).execute({
      token: faker.string.uuid(),
      password: newPassword,
    });

    pipe(
      result,
      E.fold(
        (error) => {
          assert.equal(error, 'InvalidTokenError');
        },
        () => {
          assert.fail('Should not have succeeded');
        }
      )
    );
  });
});
