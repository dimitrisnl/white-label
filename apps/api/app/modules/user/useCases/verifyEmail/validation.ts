import {schema, validator} from '@ioc:Adonis/Core/Validator';

import {uuidTokenSchema} from '../../constants/validations';

const validationSchema = schema.create({
  token: uuidTokenSchema,
});

export async function validate(props: Record<string, unknown>) {
  const {token} = await validator.validate({
    schema: validationSchema,
    data: props,
    messages: {
      'token.required': 'Please enter a token',
      'token.uuid': 'Please enter a valid token',
    },
  });
  return {token};
}
