import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer, USER_SLICE } from '../slices/userSlice';
import {
  INGREDIENTS_SLICE,
  ingredientsReducer
} from '../slices/ingredientsSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import {
  CONSTRUCTOR_SLICE,
  constructorReducer
} from '../slices/constructorSlice';
import { ORDER_SLICE, orderReducer } from '../slices/orderSlice';
import { FEEDS_SLICE, feedSliceReducer } from '../slices/feedSlice';

const rootReducer = combineReducers({
  [USER_SLICE]: userReducer,
  [INGREDIENTS_SLICE]: ingredientsReducer,
  [CONSTRUCTOR_SLICE]: constructorReducer,
  [ORDER_SLICE]: orderReducer,
  [FEEDS_SLICE]: feedSliceReducer
});
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
