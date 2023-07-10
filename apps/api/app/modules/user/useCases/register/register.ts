import * as E from 'fp-ts/Either';

import {Role} from '@/app/constants/Role';
import Org from '@/app/modules/org/models/Org';

import {sendVerificationEmailEvent} from '../../events/sendVerificationEmailEvent';
import {AccessToken} from '../../models/AccessToken';
import User from '../../models/User';
import {AccessTokenService} from '../../services/accessTokenService';
import {VerifyEmailService} from '../../services/verifyEmailService';
import {validate} from './validation';

type Response = E.Either<
  'AccountAlreadyExistsError',
  {token: AccessToken; user: User}
>;

interface Props {
  email: string;
  password: string;
  name: string;
}

interface Dependencies {
  accessTokenService: AccessTokenService;
  verifyEmailService: VerifyEmailService;
}

export function register({
  accessTokenService,
  verifyEmailService,
}: Dependencies) {
  async function execute(props: Props): Promise<Response> {
    let user: User;

    try {
      user = await User.create(props);
    } catch (error) {
      return E.left('AccountAlreadyExistsError' as const);
    }

    // Stub default org
    const defaultOrg = await Org.create({name: 'My Team'});
    await user.related('orgs').attach({
      [defaultOrg.id]: {
        role: Role.OWNER,
      },
    });

    // Verification email
    const verificationToken = await verifyEmailService.generateToken(user);
    await sendVerificationEmailEvent(user, verificationToken);

    // Access token
    const token = await accessTokenService.generate(user);

    return E.right({user, token});
  }

  return {
    execute,
    validate,
  };
}
