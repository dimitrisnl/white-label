import {rules, schema} from '@ioc:Adonis/Core/Validator';

export const orgNameSchema = schema.string({trim: true, escape: true}, [
  rules.minLength(2),
  rules.maxLength(100),
]);
