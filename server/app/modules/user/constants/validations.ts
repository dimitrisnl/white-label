import {rules, schema} from '@ioc:Adonis/Core/Validator';

export const passwordSchema = schema.string({trim: true}, [
  rules.minLength(8),
  rules.maxLength(100),
]);

export const emailSchema = schema.string({trim: true, escape: true}, [
  rules.email(),
]);

export const fullNameSchema = schema.string({trim: true, escape: true}, [
  rules.minLength(2),
  rules.maxLength(100),
]);

export const uuidTokenSchema = schema.string({trim: true}, [rules.uuid()]);
