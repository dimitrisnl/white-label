import {Exception} from '@adonisjs/core/build/standalone';

export default class MissingOrgException extends Exception {
  constructor() {
    super('', 422, 'E_MISSING_ORG_EXCEPTION');
  }
}
