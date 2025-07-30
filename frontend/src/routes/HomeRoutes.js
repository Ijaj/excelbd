import { lazy } from 'react';

// project imports
import Loadable from 'ui/loadable';

// layout imports
const CustomerLayout = Loadable(lazy(() => import('layouts/CustomerLayout')));

// page imports
const CustomerDashboard = Loadable(lazy(() => import('views/customer/')));

import { ProtectedRoute } from './ProtectedRoutes';

const HomeRoute = {
  path: '/',
  element: (
    <ProtectedRoute>
      <CustomerLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <CustomerDashboard />
    }
  ]
};

export default HomeRoute;
