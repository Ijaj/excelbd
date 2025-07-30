import { lazy } from 'react';

// project imports
import Loadable from 'ui/loadable';

// layout imports
const AuthLayout = Loadable(lazy(() => import('layouts/AuthLayout')));

// page imports
const LoginPage = Loadable(lazy(() => import('views/auth/login')));
const SignupPage = Loadable(lazy(() => import('views/auth/signup')));

// ==============================|| MAIN ROUTING ||============================== //
const AuthRoutes = {
  path: 'auth',
  element: <AuthLayout />,
  children: [
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'signup',
      element: <SignupPage />
    }
  ]
};

export default AuthRoutes;
