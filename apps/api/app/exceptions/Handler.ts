/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */

import Application from '@ioc:Adonis/Core/Application';
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';
import Logger from '@ioc:Adonis/Core/Logger';

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  async handle(error: any, ctx: HttpContextContract) {
    // 1. Handle all validation exceptions
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send(error.messages);
    }

    // 2. Handle the middleware exceptions
    // 2.1. Handle the authentication exception
    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ctx.response.status(401).send({
        message: 'You need to login first',
      });
    }

    // 2.2. Handle the missing org exception
    if (error.code === 'E_MISSING_ORG_EXCEPTION') {
      return ctx.response.status(422).send({
        message: 'No x-org-id provided in the request header',
      });
    }

    if (Application.inDev) {
      console.log(error);
    }

    // 2. Handle all other unhandled exceptions
    return ctx.response.status(500).send('Something went wrong');
  }
}
