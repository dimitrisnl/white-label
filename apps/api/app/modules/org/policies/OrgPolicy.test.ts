import {test} from '@japa/runner';

import {Role} from '@/app/constants/Role';
import {OrgFactory} from '@/database/factories/OrgFactory';
import {UserFactory} from '@/database/factories/UserFactory';

import OrgPolicy from './OrgPolicy';

test.group('OrgPolicy', () => {
  test('should be able to view an org if has any membership', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.MEMBER,
      },
    });

    const policy = new OrgPolicy();

    const canView = await policy.view(user, org);

    assert.isTrue(canView);
  });

  test('should not be able to view an org if not a member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    const policy = new OrgPolicy();

    const canView = await policy.view(user, org);

    assert.isFalse(canView);
  });

  test('should be able to update an org if Owner', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.OWNER,
      },
    });

    const policy = new OrgPolicy();

    const canUpdate = await policy.update(user, org);

    assert.isTrue(canUpdate);
  });

  test('should be able to update an org if Admin', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.ADMIN,
      },
    });

    const policy = new OrgPolicy();

    const canUpdate = await policy.update(user, org);

    assert.isTrue(canUpdate);
  });

  test('should not be able to update an org if Member', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.MEMBER,
      },
    });

    const policy = new OrgPolicy();

    const canUpdate = await policy.update(user, org);

    assert.isFalse(canUpdate);
  });

  test('should not be able to update an org if not a member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    const policy = new OrgPolicy();

    const canUpdate = await policy.update(user, org);

    assert.isFalse(canUpdate);
  });

  test('should be able to delete an org if Owner', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.OWNER,
      },
    });

    const policy = new OrgPolicy();

    const canDelete = await policy.delete(user, org);

    assert.isTrue(canDelete);
  });

  test('should not be able to delete an org if Admin', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.ADMIN,
      },
    });

    const policy = new OrgPolicy();

    const canDelete = await policy.delete(user, org);

    assert.isFalse(canDelete);
  });

  test('should not be able to delete an org if Member', async ({assert}) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    await user.related('orgs').attach({
      [org.id]: {
        role: Role.MEMBER,
      },
    });

    const policy = new OrgPolicy();

    const canDelete = await policy.delete(user, org);

    assert.isFalse(canDelete);
  });

  test('should not be able to delete an org if not a member', async ({
    assert,
  }) => {
    const user = await UserFactory.create();
    const org = await OrgFactory.create();

    const policy = new OrgPolicy();

    const canDelete = await policy.delete(user, org);

    assert.isFalse(canDelete);
  });
});
