import { configureStore } from '@reduxjs/toolkit';
import {
  feedSliceReducer,
  fetchFeedsData,
  getOrderByNum
} from '../slices/feedSlice';
import { TOrdersData } from '@utils-types';
import { RequestStatus } from '../slices/userSlice';
import { getFeedsApi } from '../utils/burger-api';

jest.mock('../utils/burger-api', () => ({
  getFeedsApi: jest.fn() as jest.MockedFunction<typeof getFeedsApi>
}));

const createMockStore = () =>
  configureStore({
    reducer: {
      feed: feedSliceReducer
    }
  });

describe('проверка редьюсера feed', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });
  test('проверка запроса в момент загрузки заказов', async () => {
    store.dispatch(fetchFeedsData());
    const stateBefore = store.getState().feed;
    expect(stateBefore.requestStatus).toBe(RequestStatus.Loading);
  });
  describe('проверка после успешной загрузки заказов', () => {
    (getFeedsApi as jest.Mock).mockResolvedValue({
      orders: [
        {
          _id: '6777b9f0750864001d376d83',
          ingredients: [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa0941'
          ],
          status: 'done',
          name: 'Флюоресцентный био-марсианский бургер',
          createdAt: '2025-01-03T10:20:32.871Z',
          updatedAt: '2025-01-03T10:20:33.782Z',
          number: 64602
        },
        {
          _id: '6777ade1750864001d376d79',
          ingredients: [
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa0941',
            '643d69a5c3f7b9001cfa093f',
            '643d69a5c3f7b9001cfa0947'
          ],
          status: 'done',
          name: 'Краторный бессмертный фалленианский био-марсианский бургер',
          createdAt: '2025-01-03T09:29:05.022Z',
          updatedAt: '2025-01-03T09:29:06.004Z',
          number: 64601
        }
      ]
    });

    test('проверка запроса после успешной загрузки заказов', async () => {
      await store.dispatch(fetchFeedsData());

      const state = store.getState().feed;
      expect(state.requestStatus).toBe(RequestStatus.Success);
      expect(state.error).toBeNull();
      expect(state.feeds.orders).toHaveLength(2);
    });
    test('проверка получения заказа по номеру', async () => {
      await store.dispatch(fetchFeedsData());

      const state = store.getState().feed;
      const orderData = getOrderByNum(state, Number('64601'));

      expect(orderData).not.toBeNull();
    });
  });

  test('проверка запроса при ошибке загрузки заказов', async () => {
    const mockError = new Error('Error fetching feeds');
    (getFeedsApi as jest.Mock).mockRejectedValue(mockError);
    await store.dispatch(fetchFeedsData());
    const state = store.getState().feed;
    expect(state.requestStatus).toBe(RequestStatus.Failed);
    expect(state.error).toBe(mockError.message);
  });
});
