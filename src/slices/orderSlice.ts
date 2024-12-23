import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from './userSlice';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../utils/burger-api';
import { TOrder } from '../utils/types';
export const ORDER_SLICE = 'order';

type TOrderState = {
  order: TOrder | null;
  name: string;
  requestStatus: RequestStatus;
  isError: string;
  userOrders: TOrder[];
};

const initialState: TOrderState = {
  order: null,
  name: '',
  requestStatus: RequestStatus.Idle,
  isError: '',
  userOrders: []
};

const orderSlice = createSlice({
  name: ORDER_SLICE,
  initialState,
  reducers: {
    clearOrder: (state) => (state = initialState),
    clearModalData: (state) => {
      state.order = null;
    }
  },
  selectors: {
    getOrderModalData: (state) => state.order,
    getIsLoading: (state) => state.requestStatus === RequestStatus.Loading,
    getUserOrders: (state) => state.userOrders
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPostOrder.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.isError = '';
      })
      .addCase(fetchPostOrder.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.isError = action.error.message ?? '';
      })
      .addCase(fetchPostOrder.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.name = action.payload.name;
        state.order = action.payload.order;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.isError = '';
      })

      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.isError = action.error.message ?? '';
      })

      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.isError = '';
        state.userOrders = action.payload;
      })

      .addCase(fetchGetOrderByNumber.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.isError = '';
      })
      .addCase(fetchGetOrderByNumber.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.isError = action.error.message ?? '';
      })
      .addCase(fetchGetOrderByNumber.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.order = action.payload.orders[0];
      });
  }
});

export const orderSelectors = orderSlice.selectors;
export const orderActions = orderSlice.actions;

export const orderReducer = orderSlice.reducer;

export const fetchPostOrder = createAsyncThunk(
  `${ORDER_SLICE}/fetchPostOrder`,
  async (ingredientsID: string[]) => {
    const data = await orderBurgerApi(ingredientsID);

    return data;
  }
);

export const fetchUserOrders = createAsyncThunk(
  `${ORDER_SLICE}/fetchUserOrders`,
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const fetchGetOrderByNumber = createAsyncThunk(
  `${ORDER_SLICE}/fetchGetOrderByNumber`,
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data;
  }
);
