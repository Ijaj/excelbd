import { Navigate } from 'react-router-dom';

const ErrorRoute = {
  path: '/*',
  element: <Navigate to={'/404'} replace />
};

export default ErrorRoute;
