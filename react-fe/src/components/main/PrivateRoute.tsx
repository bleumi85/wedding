import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { Role } from '../../common/enums';

interface IPrivateRouteProps {
  role?: Role;
}

const PrivateRoute: React.FunctionComponent<IPrivateRouteProps> = ({ role }) => {
  const invitation = useAppSelector((state) => state.auth.invitation);

  if (!invitation) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/auth/login" data-testid="authRedirect" />;
  }

  // check if route is restricted by role
  if (role && !invitation.guests.some((guest) => guest.role === role)) {
    // role not authorized so redirect to home page
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
