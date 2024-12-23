import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { userSelectors } from '../../slices/userSlice';
import { Preloader } from '../ui/preloader/preloader';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(userSelectors.getAuthChecked);
  const isAuth = useSelector(userSelectors.getAuthenticated);
  const user = useSelector(userSelectors.getUserState);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user.name && !isAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user.name) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};
