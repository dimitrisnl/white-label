import {Outlet} from '@remix-run/react';

export {loader} from './_loader.server';

export default function DashboardLayout() {
  return <Outlet />;
}
