import {schema, validator} from '@ioc:Adonis/Core/Validator';

import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
} from '../../constants/validations';

const validationSchema = schema.create({
  email: emailSchema,
  password: passwordSchema,
  name: fullNameSchema,
});

export async function validate(props: Record<string, unknown>) {
  const {email, password, name} = await validator.validate({
    schema: validationSchema,
    data: props,
    messages: {
      'email.email': 'Please enter a valid email address',
      'email.required': 'Please enter a valid email address',
      //
      'password.required': 'Please enter a password',
      //
      'password.minLength': 'Your password must be at least 8 characters',
      'password.maxLength': 'Your password must be less than 100 characters',
      //
      'name.required': 'Please enter your name',
      //
      'name.minLength': 'Your name must be at least 2 characters',
      'name.maxLength': 'Your name must be less than 100 characters',
    },
  });
  return {email, password, name};
}
