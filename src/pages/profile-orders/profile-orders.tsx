import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders, orderSelectors } from '../../slices/orderSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(orderSelectors.getUserOrders);

  return <ProfileOrdersUI orders={orders} />;
};
