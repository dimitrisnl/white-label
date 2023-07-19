import {schema, validator} from '@ioc:Adonis/Core/Validator';

import {emailSchema} from '../../constants/validations';

const validationSchema = schema.create({
  email: emailSchema,
});

export async function validate(props: Record<string, unknown>) {
  const {email} = await validator.validate({
    schema: validationSchema,
    data: props,
    messages: {
      'email.email': 'Please enter a valid email address',
      'email.required': 'Please enter a valid email address',
    },
  });
  return {email};
}
