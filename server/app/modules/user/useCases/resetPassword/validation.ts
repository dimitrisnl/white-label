import {schema, validator} from '@ioc:Adonis/Core/Validator';

import {passwordSchema, uuidTokenSchema} from '../../constants/validations';

const validatorSchema = schema.create({
  password: passwordSchema,
  token: uuidTokenSchema,
});

export async function validate(props: Record<string, unknown>) {
  const {token, password} = await validator.validate({
    schema: validatorSchema,
    data: props,
    messages: {
      'password.required': 'Please enter a password',
      //
      'password.minLength': 'Your password must be at least 8 characters',
      'password.maxLength': 'Your password must be less than 100 characters',
      //
      'token.required': 'Please enter a token',
      'token.uuid': 'Please enter a valid token',
    },
  });
  return {token, password};
}
