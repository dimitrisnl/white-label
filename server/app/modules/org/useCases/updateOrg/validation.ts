import {schema, validator} from '@ioc:Adonis/Core/Validator';

import {orgNameSchema} from '../../constants/validations';

const validationSchema = schema.create({
  name: orgNameSchema,
});

export async function validate(props: unknown) {
  const {name} = await validator.validate({
    schema: validationSchema,
    data: props,
    messages: {
      'name.required': 'Please enter an Organization name',
      'name.minLength': 'Organization name must be at least 2 characters',
      'name.maxLength': 'Organization name must be less than 100 characters',
    },
  });
  return {name};
}
