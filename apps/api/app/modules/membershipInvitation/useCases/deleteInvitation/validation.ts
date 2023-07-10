import {schema, validator} from '@ioc:Adonis/Core/Validator';

import {uuidTokenSchema} from '../../constants/validation';

const validationSchema = schema.create({
  invitationId: uuidTokenSchema,
});

export async function validate(props: unknown) {
  const {invitationId} = await validator.validate({
    schema: validationSchema,
    data: props,
    messages: {
      'invitationId.required': 'Please enter an invitation id',
      'invitationId.uuid': 'Please enter a valid invitation id',
    },
  });

  return {invitationId};
}
