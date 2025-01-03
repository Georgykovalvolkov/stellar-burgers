import { configureStore } from '@reduxjs/toolkit';
import {
  fetchIngredientsData,
  ingredientsReducer
} from '../slices/ingredientsSlice';
import { RequestStatus } from '../slices/userSlice';
import { getIngredientsApi } from '../utils/burger-api';
import mockIngredients from '../../cypress/fixtures/ingredients.json';

jest.mock('../utils/burger-api', () => ({
  getIngredientsApi: jest.fn() as jest.MockedFunction<typeof getIngredientsApi>
}));

const createMockStore = () =>
  configureStore({
    reducer: {
      burgerIngredients: ingredientsReducer
    }
  });

describe('проверка редьюсера ingredients', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });

  test('проверка запроса при загрузке ингредиентов', async () => {
    store.dispatch(fetchIngredientsData());
    const stateBefore = store.getState().burgerIngredients;
    expect(stateBefore.requestStatus).toBe(RequestStatus.Loading);
  });

  test('проверка запроса после загрузки ингредиентов', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients.data);
    await store.dispatch(fetchIngredientsData());
    const state = store.getState().burgerIngredients;
    expect(state.requestStatus).toBe(RequestStatus.Success);
    expect(state.error).toBeNull();
    expect(state.ingredients).toHaveLength(3);
  });

  test('проверка запроса при ошибке загрузки ингредиентов', async () => {
    const mockError = new Error('Error fetching ingredients');
    (getIngredientsApi as jest.Mock).mockRejectedValue(mockError);
    await store.dispatch(fetchIngredientsData());
    const state = store.getState().burgerIngredients;
    expect(state.requestStatus).toBe(RequestStatus.Failed);
    expect(state.error).toBe(mockError.message);
  });
});
