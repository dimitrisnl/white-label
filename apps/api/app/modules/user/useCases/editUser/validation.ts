import {schema, validator} from '@ioc:Adonis/Core/Validator';

import {fullNameSchema} from '../../constants/validations';

const validationSchema = schema.create({
  name: fullNameSchema,
});

export async function validate(props: Record<string, unknown>) {
  const {name} = await validator.validate({
    schema: validationSchema,
    data: props,
    messages: {
      //
      'name.required': 'Please enter your name',
      //
      'name.minLength': 'Your name must be at least 2 characters',
      'name.maxLength': 'Your name must be less than 100 characters',
    },
  });
  return {name};
}
