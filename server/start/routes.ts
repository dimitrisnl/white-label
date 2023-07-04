import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';

Route.get('health', async ({response}) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
}).prefix('api/v1/');

import '@/app/modules/user/routes';
import '@/app/modules/org/routes';
import '@/app/modules/membershipInvitation/routes';
