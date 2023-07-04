import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';
import * as E from 'fp-ts/Either';

import {getPasswordResetService} from '../services/passwordResetService';
import {getVerifyEmailService} from '../services/verifyEmailService';
import {changePassword} from '../useCases/changePassword';
import {editUser} from '../useCases/editUser';
import {requestPasswordReset} from '../useCases/requestPasswordReset';
import {resetPassword} from '../useCases/resetPassword';
import {verifyEmail} from '../useCases/verifyEmail';
import {whoAmI} from '../useCases/whoAmI';

export class UserController {
  async whoAmI({auth, response}: HttpContextContract) {
    const user = auth.user!;
    const result = await whoAmI().execute(user);

    return response.ok(result);
  }

  async editUser({request, auth, response}: HttpContextContract) {
    const user = auth.user!;
    const body = request.body();

    const {validate, execute} = editUser();

    const props = await validate(body);
    const result = await execute(props, user);

    return response.ok(result);
  }

  async requestPasswordReset({request, response}: HttpContextContract) {
    const payload = request.body();
    const {validate, execute} = requestPasswordReset({
      passwordResetService: getPasswordResetService(),
    });

    const props = await validate(payload);
    const result = await execute(props);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'UserNotFoundError':
          return response.badRequest({message: 'User not found'});
      }
    }

    return response.ok(null);
  }

  async resetPassword({request, response}: HttpContextContract) {
    const body = request.body();

    const {validate, execute} = resetPassword({
      passwordResetService: getPasswordResetService(),
    });

    const props = await validate(body);
    const result = await execute(props);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'InvalidTokenError':
          return response.badRequest({message: 'Token is invalid'});
      }
    }

    return response.ok(null);
  }

  async changePassword({request, auth, response}: HttpContextContract) {
    const payload = request.body();
    const user = auth.user!;

    const {validate, execute} = changePassword();
    const props = await validate(payload);
    const result = await execute(props, user);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'IncorrectPasswordError':
          return response.badRequest({message: 'Incorrect password'});
      }
    }

    return response.ok(null);
  }

  async verifyEmail({request, response}: HttpContextContract) {
    const params = request.params();
    const {validate, execute} = verifyEmail({
      verifyEmailService: getVerifyEmailService(),
    });
    const props = await validate(params);
    const result = await execute(props);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'InvalidTokenError':
          return response.badRequest({message: 'Token is invalid'});
      }
    }

    return response.ok(null);
  }
}
