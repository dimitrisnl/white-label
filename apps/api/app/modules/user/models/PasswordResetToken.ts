import ORM from '@ioc:Adonis/Lucid/Orm';
import {DateTime} from 'luxon';
import {v4 as uuidv4} from 'uuid';

import AppBaseModel from '@/app/modules/common/AppBaseModel';

import User from './User';

export default class PasswordResetToken extends AppBaseModel {
  static selfAssignPrimaryKey = true;

  @ORM.column({isPrimary: true})
  id: string;

  @ORM.column()
  userId: string;

  @ORM.column.dateTime()
  expiresAt: DateTime | null;

  @ORM.column.dateTime({autoCreate: true})
  createdAt: DateTime;

  @ORM.column.dateTime({autoCreate: true, autoUpdate: true})
  updatedAt: DateTime;

  @ORM.belongsTo(() => User)
  user: ORM.BelongsTo<typeof User>;

  @ORM.beforeCreate()
  static assignUuid(user: User) {
    user.id = uuidv4();
  }
}
