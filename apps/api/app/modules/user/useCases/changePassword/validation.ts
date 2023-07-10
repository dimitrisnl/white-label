import {schema, validator} from '@ioc:Adonis/Core/Validator';

import {passwordSchema} from '../../constants/validations';

const validationSchema = schema.create({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export async function validate(props: Record<string, unknown>) {
  const {oldPassword, newPassword} = await validator.validate({
    schema: validationSchema,
    data: props,
    messages: {
      'oldPassword.required': 'Please enter your current password',
      'newPassword.required': 'Please enter a new password',
      //
      'oldPassword.minLength': 'Your password must be at least 8 characters',
      'newPassword.minLength': 'Your password must be at least 8 characters',
      //
      'oldPassword.maxLength': 'Your password must be less than 100 characters',
      'newPassword.maxLength': 'Your password must be less than 100 characters',
    },
  });
  return {oldPassword, newPassword};
}
