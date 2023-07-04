import {rules, schema} from '@ioc:Adonis/Core/Validator';

import {Role} from '@/app/constants/Role';

export const emailSchema = schema.string({trim: true, escape: true}, [
  rules.email(),
]);

export const uuidTokenSchema = schema.string({trim: true}, [rules.uuid()]);

export const roleSchema = schema.enum(Object.values(Role));
