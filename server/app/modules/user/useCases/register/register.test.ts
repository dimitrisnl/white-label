import Mail from '@ioc:Adonis/Addons/Mail';
import {test} from '@japa/runner';
import * as E from 'fp-ts/Either';
import {pipe} from 'fp-ts/lib/function';

import {getUserObj, UserFactory} from '@/database/factories/UserFactory';

import {AccessToken} from '../../models/AccessToken';
import {AccessTokenService} from '../../services/accessTokenService';
import {getVerifyEmailService} from '../../services/verifyEmailService';
import {register} from './register';

function getAccessTokenServiceStub(): AccessTokenService {
  async function generate(): Promise<AccessToken> {
    return Promise.resolve({type: 'bearer', token: 'token'});
  }
  async function revoke(): Promise<void> {
    return Promise.resolve();
  }
  async function attempt(): Promise<AccessToken> {
    return Promise.resolve({type: 'bearer', token: 'token'});
  }
  return {
    generate,
    revoke,
    attempt,
  };
}

test.group('register', () => {
  test('should register user', async ({assert}) => {
    const payload = getUserObj();

    const result = await register({
      accessTokenService: getAccessTokenServiceStub(),
      verifyEmailService: getVerifyEmailService(),
    }).execute(payload);

    pipe(
      result,
      E.fold(
        (error) => {
          assert.fail(error);
        },
        (result) => {
          const {user, token} = result;
          assert.isTrue(user.email === payload.email);
          assert.isTrue(user.name === payload.name);
          assert.isTrue(token.token === 'token');
        }
      )
    );
  });

  test('should send a verification email', async ({assert}) => {
    const mailer = Mail.fake();
    const payload = getUserObj();

    const result = await register({
      accessTokenService: getAccessTokenServiceStub(),
      verifyEmailService: getVerifyEmailService(),
    }).execute(payload);

    pipe(
      result,
      E.fold(
        (error) => {
          assert.fail(error);
        },
        ({user}) => {
          assert.isTrue(
            mailer.exists((mail) => {
              if (!mail.to) {
                return false;
              }
              return mail.to[0].address === user.email;
            })
          );
        }
      )
    );

    Mail.restore();
  });

  test('should not register user with duplicate email', async ({assert}) => {
    const user = await UserFactory.create();
    const payload = getUserObj();

    const result = await register({
      accessTokenService: getAccessTokenServiceStub(),
      verifyEmailService: getVerifyEmailService(),
    }).execute({
      ...payload,
      email: user.email,
    });

    pipe(
      result,
      E.fold(
        (error) => {
          assert.equal(error, 'AccountAlreadyExistsError');
        },
        () => {
          assert.fail();
        }
      )
    );
  });
});
