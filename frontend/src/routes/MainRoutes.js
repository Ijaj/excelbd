import { lazy, useEffect, useRef } from 'react';

// project imports
import Loadable from 'ui/loadable';

// layout imports
const AdminLayout = Loadable(lazy(() => import('layouts/AdminLayout')));
const AgentLayout = Loadable(lazy(() => import('layouts/AgentLayout')));
const CustomerLayout = Loadable(lazy(() => import('layouts/CustomerLayout')));

// page imports
const AdminDashboard = Loadable(lazy(() => import('views/admin/')));
const AgentDashboard = Loadable(lazy(() => import('views/agent/')));
const CustomerDashboard = Loadable(lazy(() => import('views/customer/')));

import { ProtectedRoute } from './ProtectedRoutes';

export default function RoleBasedRoutes(role) {
  console.log('role: ', role);
  const AdminRoutes = {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />
      }
    ]
  };

  const AgentRoutes = {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AgentLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AgentDashboard />
      }
    ]
  };

  const CustomerRoutes = {
    path: '/dashboard',
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

  const GuestRoutes = {
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

  const activeRoutes = role === 'admin' ? AdminRoutes : role === 'agent' ? AgentRoutes : role === 'customer' ? CustomerRoutes : GuestRoutes;
  return activeRoutes;
}

// export default [ AdminRoutes, AgentRoutes, CustomerRoutes ];
