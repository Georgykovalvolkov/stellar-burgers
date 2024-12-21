import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../utils/types';
import { orderBurgerApi } from '../utils/burger-api';
import { v4 as uuidv4 } from 'uuid';
import { RequestStatus } from './userSlice';

export const CONSTRUCTOR_SLICE = 'burgerConstructor';

type TConstructorState = {
  bun?: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  ingredients: TConstructorIngredient[];
  requestStatus: RequestStatus;
};

const initialState: TConstructorState = {
  ingredients: [],
  requestStatus: RequestStatus.Idle
};

const constructorSlice = createSlice({
  name: CONSTRUCTOR_SLICE,
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = {
            _id: action.payload._id,
            name: action.payload.name,
            image: action.payload.image,
            price: action.payload.price
          };
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: Omit<TConstructorIngredient, 'id'>) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },

    clearIngredients(state) {
      state.bun = undefined;
      state.ingredients = [];
    },

    onUpdateIngredients(
      state,
      action: PayloadAction<TConstructorIngredient[]>
    ) {
      state.ingredients = action.payload;
    }
  },
  selectors: {
    getConstructor: (state) => state,
    getIngredients: (state) => state.ingredients
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPostOrders.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(fetchPostOrders.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
      })
      .addCase(fetchPostOrders.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
      });
  }
});

export const constructorReducer = constructorSlice.reducer;

export const constructorSelectors = constructorSlice.selectors;
export const constructorActions = constructorSlice.actions;
export default constructorSlice;

export const fetchPostOrders = createAsyncThunk(
  `${CONSTRUCTOR_SLICE}/fetchPostOrders`,
  async (ingredients: TConstructorIngredient[]) => {
    const id: string[] = ingredients.map((ingredient) => ingredient._id);
    const data = await orderBurgerApi(id);
    return data;
  }
);
