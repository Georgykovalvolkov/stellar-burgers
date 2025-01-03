import { configureStore } from '@reduxjs/toolkit';
import {
  orderReducer,
  fetchPostOrder,
  fetchUserOrders,
  fetchGetOrderByNumber
} from '../slices/orderSlice';
import { TOrder } from '@utils-types';
import { RequestStatus } from '../slices/userSlice';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../utils/burger-api';
import {
  mockOrderByIdResponse,
  mockPostOrderResponse,
  mockUserOrdersResponse
} from '../mocks/mocks';

jest.mock('../utils/burger-api', () => ({
  orderBurgerApi: jest.fn() as jest.MockedFunction<typeof orderBurgerApi>,
  getOrdersApi: jest.fn() as jest.MockedFunction<typeof getOrdersApi>,
  getOrderByNumberApi: jest.fn() as jest.MockedFunction<
    typeof getOrderByNumberApi
  >
}));

const createMockStore = () =>
  configureStore({
    reducer: {
      orderDetails: orderReducer
    }
  });

let store: ReturnType<typeof createMockStore>;

beforeEach(() => {
  store = createMockStore();
});

describe('проверка редьюсера order', () => {
  describe('проверка запроса orderBurgerApi', () => {
    const orderIngredients = [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0941'
    ];
    test('проверка запроса в момент загрузки', async () => {
      (orderBurgerApi as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {})
      );
      store.dispatch(fetchPostOrder(orderIngredients));
      const loadingState = store.getState().orderDetails;
      expect(loadingState.requestStatus).toBe(RequestStatus.Loading);
    });

    test('проверка запроса после успешной загрузки', async () => {
      (orderBurgerApi as jest.Mock).mockResolvedValueOnce(
        mockPostOrderResponse
      );
      await store.dispatch(fetchPostOrder(orderIngredients));
      const finalState = store.getState().orderDetails;
      expect(finalState.requestStatus).toBe(RequestStatus.Success);
      expect(finalState.order).toBeDefined();
    });

    test('ошибка API', async () => {
      (orderBurgerApi as jest.Mock).mockRejectedValueOnce(
        new Error('Error fetching orders')
      );

      await store.dispatch(fetchPostOrder(orderIngredients));

      const newState = store.getState();
      expect(newState.orderDetails.requestStatus).toBe(RequestStatus.Failed);
      expect(newState.orderDetails.isError).toBe('Error fetching orders');
    });

    describe('проверка запроса getOrdersApi', () => {
      test('проверка запроса в момент загрузки', async () => {
        (getOrdersApi as jest.Mock).mockImplementationOnce(
          () => new Promise(() => {})
        );
        store.dispatch(fetchUserOrders());
        const loadingState = store.getState().orderDetails;
        expect(loadingState.requestStatus).toBe(RequestStatus.Loading);
      });

      test('проверка запроса после успешной загрузки', async () => {
        (getOrdersApi as jest.Mock).mockResolvedValueOnce(
          mockUserOrdersResponse
        );
        await store.dispatch(fetchUserOrders());
        const finalState = store.getState().orderDetails;
        expect(finalState.requestStatus).toBe(RequestStatus.Success);
        expect(finalState.userOrders).toBeDefined();
        expect(finalState.userOrders).toHaveLength(2);
      });

      test('проверка запроса после ошибки', async () => {
        (getOrdersApi as jest.Mock).mockRejectedValueOnce(
          new Error('Error fetching orders')
        );
        await store.dispatch(fetchUserOrders());
        const finalState = store.getState().orderDetails;
        expect(finalState.requestStatus).toBe(RequestStatus.Failed);
        expect(finalState.isError).toBe('Error fetching orders');
      });
    });

    describe('проверка запроса getOrderByNumberApi', () => {
      test('проверка запроса в момент загрузки', async () => {
        (getOrderByNumberApi as jest.Mock).mockImplementationOnce(
          () => new Promise(() => {})
        );
        store.dispatch(fetchGetOrderByNumber(58352));
        const loadingState = store.getState().orderDetails;
        expect(loadingState.requestStatus).toBe(RequestStatus.Loading);
      });

      test('проверка запроса после успешной загрузки', async () => {
        (getOrderByNumberApi as jest.Mock).mockResolvedValueOnce(
          mockOrderByIdResponse
        );
        await store.dispatch(fetchGetOrderByNumber(58352));
        const finalState = store.getState().orderDetails;
        expect(finalState.requestStatus).toBe(RequestStatus.Success);
        expect(finalState.order).toBeDefined();
      });

      test('проверка запроса после ошибки', async () => {
        (getOrderByNumberApi as jest.Mock).mockRejectedValueOnce(
          new Error('Error fetching orders')
        );
        await store.dispatch(fetchGetOrderByNumber(58352));
        const finalState = store.getState().orderDetails;
        expect(finalState.requestStatus).toBe(RequestStatus.Failed);
        expect(finalState.isError).toBe('Error fetching orders');
      });
    });
  });
});
