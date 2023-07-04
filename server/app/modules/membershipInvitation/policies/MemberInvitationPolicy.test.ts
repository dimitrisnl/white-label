import {test} from '@japa/runner';

import {Role} from '@/app/constants/Role';
import {OrgFactory} from '@/database/factories/OrgFactory';
import {UserFactory} from '@/database/factories/UserFactory';

import MemberInvitationPolicy from './MemberInvitationPolicy';

test.group('MemberInvitationPolicy', () => {
  test('should be able to view invitations list if has any membership', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.MEMBER,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canView = await policy.viewList(user, org);

    assert.isTrue(canView);
  });

  test('should not be able to view invitations list if not a member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    const policy = new MemberInvitationPolicy();

    const canView = await policy.viewList(user, org);

    assert.isFalse(canView);
  });

  test('should be able to view an invitation if has any membership', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.MEMBER,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canView = await policy.view(user, org);

    assert.isTrue(canView);
  });

  test('should not be able to view an invitation if not a member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    const policy = new MemberInvitationPolicy();

    const canView = await policy.view(user, org);

    assert.isFalse(canView);
  });

  test('should be able to create an invitation if Owner', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.OWNER,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canCreate = await policy.create(user, org);

    assert.isTrue(canCreate);
  });

  test('should be able to create an invitation if Admin', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.ADMIN,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canCreate = await policy.create(user, org);

    assert.isTrue(canCreate);
  });

  test('should not be able to create an invitation if Member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.MEMBER,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canCreate = await policy.create(user, org);

    assert.isFalse(canCreate);
  });

  test('should not be able to create an invitation if not a member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    const policy = new MemberInvitationPolicy();

    const canCreate = await policy.create(user, org);

    assert.isFalse(canCreate);
  });

  test('should be able to update an invitation if Owner', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.OWNER,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canUpdate = await policy.update(user, org);

    assert.isTrue(canUpdate);
  });

  test('should be able to update an invitation if Admin', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.ADMIN,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canUpdate = await policy.update(user, org);

    assert.isTrue(canUpdate);
  });

  test('should not be able to update an invitation if Member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.MEMBER,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canUpdate = await policy.update(user, org);

    assert.isFalse(canUpdate);
  });

  test('should not be able to update an invitation if not a member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    const policy = new MemberInvitationPolicy();

    const canUpdate = await policy.update(user, org);

    assert.isFalse(canUpdate);
  });

  test('should be able to delete an invitation if Owner', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.OWNER,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canDelete = await policy.delete(user, org);

    assert.isTrue(canDelete);
  });

  test('should be able to delete an invitation if Admin', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.ADMIN,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canDelete = await policy.delete(user, org);

    assert.isTrue(canDelete);
  });

  test('should not be able to delete an invitation if Member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.MEMBER,
      },
    });

    const policy = new MemberInvitationPolicy();

    const canDelete = await policy.delete(user, org);

    assert.isFalse(canDelete);
  });

  test('should not be able to delete an invitation if not a member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    const policy = new MemberInvitationPolicy();

    const canDelete = await policy.delete(user, org);

    assert.isFalse(canDelete);
  });
});
