import Hash from '@ioc:Adonis/Core/Hash';
import ORM from '@ioc:Adonis/Lucid/Orm';
import {DateTime} from 'luxon';
import {v4 as uuidv4} from 'uuid';

import {Role} from '@/app/constants/Role';
import AppBaseModel from '@/app/modules/common/AppBaseModel';
import Org from '@/app/modules/org/models/Org';

import PasswordResetToken from './PasswordResetToken';
import VerifyEmailToken from './VerifyEmailToken';

export default class User extends AppBaseModel {
  static selfAssignPrimaryKey = true;

  // -- Columns ---------------------------------------------------------------
  @ORM.column({isPrimary: true})
  id: string;

  @ORM.column()
  email: string;

  @ORM.column({serializeAs: null})
  password: string;

  @ORM.column()
  name: string;

  @ORM.column()
  emailVerified: boolean;

  @ORM.column.dateTime({autoCreate: true, serializeAs: null})
  createdAt: DateTime;

  @ORM.column.dateTime({autoCreate: true, autoUpdate: true, serializeAs: null})
  updatedAt: DateTime;

  // -- Relationships ---------------------------------------------------------
  @ORM.manyToMany(() => Org, {
    pivotTable: 'memberships',
    pivotColumns: ['role'],
    pivotTimestamps: true,
  })
  orgs: ORM.ManyToMany<typeof Org>;

  @ORM.hasOne(() => PasswordResetToken)
  passwordResetToken: ORM.HasOne<typeof PasswordResetToken>;

  @ORM.hasOne(() => VerifyEmailToken)
  verifyEmailToken: ORM.HasOne<typeof VerifyEmailToken>;

  // -- Hooks ---------------------------------------------------------------
  // Generate the UUID before creating the record
  // We do this so that we don't expose our # of users
  @ORM.beforeCreate()
  static assignUuid(user: User) {
    user.id = uuidv4();
  }

  // Hash the password before saving the record
  @ORM.beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  serializeExtras() {
    if (!this.$extras.pivot_role) {
      return {};
    }

    return {
      membership: {
        role: this.$extras.pivot_role as Role,
      },
    };
  }
}

export type UserType = Omit<ORM.ModelAttributes<User>, 'password'>;
