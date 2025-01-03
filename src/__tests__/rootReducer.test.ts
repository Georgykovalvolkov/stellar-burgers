import { rootReducer } from '../services/store';
import { CONSTRUCTOR_SLICE } from '../slices/constructorSlice';
import { FEEDS_SLICE } from '../slices/feedSlice';
import { INGREDIENTS_SLICE } from '../slices/ingredientsSlice';
import { ORDER_SLICE } from '../slices/orderSlice';
import { USER_SLICE } from '../slices/userSlice';

describe('проверка инициализации rootReducer', () => {
  it('возврат начального состояния', () => {
    const initialState = {
      [INGREDIENTS_SLICE]: {
        error: null,
        ingredients: [],
        requestStatus: 'Idle'
      },
      [CONSTRUCTOR_SLICE]: {
        ingredients: [],
        requestStatus: 'Idle'
      },
      [FEEDS_SLICE]: {
        error: null,
        feeds: {
          orders: [],
          total: 0,
          totalToday: 0
        },
        requestStatus: 'Idle'
      },
      [ORDER_SLICE]: {
        isError: '',
        name: '',
        order: null,
        requestStatus: 'Idle',
        userOrders: []
      },
      [USER_SLICE]: {
        isAuthChecked: false,
        isAuthenticated: false,
        loginUserError: '',
        requestStatus: 'Idle',
        user: {
          email: '',
          name: ''
        }
      }
    };

    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });
});
