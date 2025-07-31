import { lazy } from 'react';

// project imports
import Loadable from 'ui/loadable';

// layout imports
const Layout = Loadable(lazy(() => import('layouts/CustomerLayout')));

// page imports
const LandingPage = Loadable(lazy(() => import('views/customer/')));
const AdminDashboard = Loadable(lazy(() => import('views/admin/')));
const AllAgents = Loadable(lazy(() => import('views/admin/agents')));
const AgentDashboard = Loadable(lazy(() => import('views/agent/')));
const CustomerBookings = Loadable(lazy(() => import('views/customer/bookings')));

import { ProtectedRoute } from './ProtectedRoutes';
import { Navigate } from 'react-router-dom';

export default function RoleBasedRoutes(role) {
  const AdminRoutes = {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: 'agents',
        element: <AllAgents />
      },
      {
        path: '*',
        element: <Navigate to={'/404'} replace />
      }
    ]
  };

  const AgentRoutes = {
    path: 'dashboard',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AgentDashboard />
      },
      {
        path: '*',
        element: <Navigate to={'/404'} replace />
      }
    ]
  };

  const CustomerRoutes = {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: '/bookings',
        element: (
          <ProtectedRoute>
            <CustomerBookings />
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: <Navigate to={'/404'} replace />
      }
    ]
  };

  const GuestRoutes = {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: '*',
        element: <Navigate to={'/404'} replace />
      }
    ]
  };

  const activeRoutes = role === 'admin' ? AdminRoutes : role === 'agent' ? AgentRoutes : role === 'customer' ? CustomerRoutes : GuestRoutes;
  return activeRoutes;
}
