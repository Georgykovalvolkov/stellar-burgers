import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '../utils/burger-api';
import { RequestStatus } from './userSlice';
export const FEEDS_SLICE = 'feeds';

type TOrdersDataState = {
  feeds: TOrdersData;
  requestStatus: RequestStatus;
  error: string | null;
};

const initialState: TOrdersDataState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  requestStatus: RequestStatus.Idle,
  error: null
};

const feedSlice = createSlice({
  name: FEEDS_SLICE,
  initialState,
  reducers: {},
  selectors: {
    isLoading: (state) => state.requestStatus === RequestStatus.Loading,
    getOrders: (state) => state.feeds.orders,
    getFeed: (state) => state.feeds
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsData.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(fetchFeedsData.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.error = null;
        state.feeds = action.payload;
      })
      .addCase(fetchFeedsData.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.error = action.error.message ?? null;
      });
  }
});

export const feedSliceSelectors = feedSlice.selectors;

export const getOrderByNum = (state: TOrdersDataState, num: number) =>
  state.feeds.orders.find((order) => order.number === num);
export const feedSliceReducer = feedSlice.reducer;

export const fetchFeedsData = createAsyncThunk<TOrdersData>(
  `${FEEDS_SLICE}/fetchFeedsData`,
  async () => await getFeedsApi()
);
