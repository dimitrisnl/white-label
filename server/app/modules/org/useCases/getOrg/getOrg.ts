import Org from '../../models/Org';

export function getOrg() {
  async function execute(org: Org) {
    const users = await org.related('users').query().pivotColumns(['role']);

    return {org, users};
  }

  return {
    execute,
  };
}
