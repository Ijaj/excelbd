/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from 'hooks/AuthProvider';

export const ProtectedRoute = ({ children }) => {
  // const url = `${process.env.REACT_APP_HOST}/user/validate`;
  // since the other routes wont even generate, no point checking for role based route access
  // just check if either logged in or if logged user has ttk
  // maybe add server side token validation periodically :)

  const { isLoggedIn, validateUser, logout } = useAuth();
  if (isLoggedIn && validateUser()) {
    return children;
  } else {
    logout();
    return <Navigate to={'/auth/login'} replace />;
  }
};
