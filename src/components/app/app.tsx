import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserApiThunk, userSelectors } from '../../slices/userSlice';

const App = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(fetchIngredientsData());
  //   dispatch(getUserApiThunk());
  // }, [dispatch]);
  const location = useLocation();
  const background = location.state?.background;
  const user = useSelector(userSelectors.getUserState);
  const profileMatch = useMatch('/profile/orders/:id')?.params.id;
  const feedMatch = useMatch('/feed/:id')?.params.id;
  const orderNumber = profileMatch || feedMatch;
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
