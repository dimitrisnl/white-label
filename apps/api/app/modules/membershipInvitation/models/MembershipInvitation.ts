import ORM from '@ioc:Adonis/Lucid/Orm';
import {DateTime} from 'luxon';
import {v4 as uuidv4} from 'uuid';

import {InviteStatus} from '@/app/constants/InviteStatus';
import AppBaseModel from '@/app/modules/common/AppBaseModel';

import Org from '../../org/models/Org';

export default class MembershipInvitation extends AppBaseModel {
  static selfAssignPrimaryKey = true;

  @ORM.column({isPrimary: true})
  id: string;

  @ORM.column()
  email: string;

  @ORM.column()
  orgId: string;

  @ORM.column()
  status: InviteStatus;

  @ORM.column()
  role: string;

  @ORM.column.dateTime({autoCreate: true})
  createdAt: DateTime;

  @ORM.column.dateTime({autoCreate: true, autoUpdate: true})
  updatedAt: DateTime;

  @ORM.belongsTo(() => Org)
  org: ORM.BelongsTo<typeof Org>;

  @ORM.beforeCreate()
  static assignToken(membershipInvitation: MembershipInvitation) {
    membershipInvitation.id = uuidv4();
  }
}

export type MembershipInvitationType =
  ORM.ModelAttributes<MembershipInvitation>;
