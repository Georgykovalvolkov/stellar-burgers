import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedSliceSelectors, fetchFeedsData } from '../../slices/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const loading = useSelector(feedSliceSelectors.isLoading);
  const orders: TOrder[] = useSelector(feedSliceSelectors.getOrders);
  useEffect(() => {
    dispatch(fetchFeedsData());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeedsData());
      }}
    />
  );
};
