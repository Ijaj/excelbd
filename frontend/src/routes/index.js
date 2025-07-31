import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthenticationRoutes';
import HomeRoute from './HomeRoutes';
import ErrorRoute from './ErrorRoute';
import { useAuth } from 'hooks/AuthProvider';

export default function Routes() {
  const { user } = useAuth();
  const mainRoutes = MainRoutes(user?.role);

  return useRoutes([HomeRoute, mainRoutes, AuthRoutes, ErrorRoute]);
}
