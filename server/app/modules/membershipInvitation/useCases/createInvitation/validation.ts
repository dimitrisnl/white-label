import {schema, validator} from '@ioc:Adonis/Core/Validator';

import {emailSchema, roleSchema} from '../../constants/validation';

const validationSchema = schema.create({
  email: emailSchema,
  role: roleSchema,
});

export async function validate(props: unknown) {
  const {email, role} = await validator.validate({
    schema: validationSchema,
    data: props,
    messages: {
      'email.email': 'Please enter a valid email address',
      'email.required': 'Please enter a valid email address',
      //
      'role.required': 'Please select a role',
      'role.enum': 'Please select a valid role',
    },
  });

  return {email, role};
}
