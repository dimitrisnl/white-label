import {slugify} from '@ioc:Adonis/Addons/LucidSlugify';
import ORM from '@ioc:Adonis/Lucid/Orm';
import {DateTime} from 'luxon';
import {v4 as uuidv4} from 'uuid';

import {Role} from '@/app/constants/Role';
import AppBaseModel from '@/app/modules/common/AppBaseModel';
import MembershipInvitation from '@/app/modules/membershipInvitation/models/MembershipInvitation';
import User from '@/app/modules/user/models/User';

export default class Org extends AppBaseModel {
  static selfAssignPrimaryKey = true;

  // -- Columns ---------------------------------------------------------------
  @ORM.column({isPrimary: true})
  id: string;

  @ORM.column()
  name: string;

  @ORM.column()
  @slugify({strategy: 'shortId', fields: ['name']})
  slug: string | null;

  @ORM.column.dateTime({autoCreate: true, serializeAs: null})
  createdAt: DateTime;

  @ORM.column.dateTime({autoCreate: true, autoUpdate: true, serializeAs: null})
  updatedAt: DateTime;

  // -- Relationships ---------------------------------------------------------
  @ORM.manyToMany(() => User, {
    pivotTable: 'memberships',
    pivotColumns: ['role'],
    pivotTimestamps: true,
  })
  users: ORM.ManyToMany<typeof User>;

  @ORM.hasMany(() => MembershipInvitation)
  membershipInvitations: ORM.HasMany<typeof MembershipInvitation>;

  // -- Hooks ---------------------------------------------------------------
  // Assign a UUID to the org before it is created.
  @ORM.beforeCreate()
  static assignUuid(org: Org) {
    org.id = uuidv4();
  }

  // -- Extras ---------------------------------------------------------------
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

export type OrgType = ORM.ModelAttributes<Org>;
