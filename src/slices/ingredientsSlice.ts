import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../utils/burger-api';
import { RequestStatus } from './userSlice';

export const INGREDIENTS_SLICE = 'Ingredients';

type TIngredientsState = {
  ingredients: TIngredient[];
  requestStatus: RequestStatus;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  requestStatus: RequestStatus.Idle,
  error: null
};

const ingredientsSlice = createSlice({
  name: INGREDIENTS_SLICE,
  initialState,
  reducers: {},
  selectors: {
    loadingIngredients: (state) =>
      state.requestStatus === RequestStatus.Loading,
    getIngredients: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsData.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(fetchIngredientsData.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.ingredients = action.payload;
        state.error = null;
      })
      .addCase(fetchIngredientsData.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.error = action.error.message ?? null;
      });
  }
});

export const ingredientsSelectors = ingredientsSlice.selectors;
export const getIngredientById = (state: TIngredientsState, id: string) =>
  state.ingredients.find((ingredient) => ingredient._id === id);
export const ingredientsReducer = ingredientsSlice.reducer;

export const fetchIngredientsData = createAsyncThunk<TIngredient[]>(
  `${INGREDIENTS_SLICE}/fetchIngredientsData`,
  async () => await getIngredientsApi()
);
