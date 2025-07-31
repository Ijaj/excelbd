import { lazy } from 'react';

// project imports
import Loadable from 'ui/loadable';

// layout imports
const CustomerLayout = Loadable(lazy(() => import('layouts/CustomerLayout')));

// page imports
const CustomerDashboard = Loadable(lazy(() => import('views/customer/')));
const NotFound = Loadable(lazy(() => import('views/not-found/')));

const HomeRoute = {
  path: '/',
  element: <CustomerLayout />,
  children: [
    {
      index: true,
      element: <CustomerDashboard />
    },
    {
      path: '/404',
      element: <NotFound />
    }
  ]
};

export default HomeRoute;
