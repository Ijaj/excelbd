import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthenticationRoutes';
import HomeRoute from './HomeRoutes';

import { useAuth } from 'hooks/AuthProvider';

export default function Routes() {
  const { login, user } = useAuth();
  console.log('user: ', user);
  // useEffect(() => {
  //   if (!user) {
  //     login({ name: 'something', role: 'admin' });
  //   }
  // }, [login, user]);
  console.log(user);
  const mainRoutes = MainRoutes(user?.role);
  return useRoutes([HomeRoute, mainRoutes, AuthRoutes]);
}
