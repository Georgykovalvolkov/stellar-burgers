import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  logoutApi,
  getUserApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { setCookie, deleteCookie } from '../utils/cookie';

export const USER_SLICE = 'user';

export const enum RequestStatus {
  Idle = 'Idle',
  Loading = 'Loading',
  Success = 'Success',
  Failed = 'Failed'
}

type TUserState = {
  user: TUser;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserError: string;
  requestStatus: RequestStatus;
};

const initialState: TUserState = {
  user: { name: '', email: '' },
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserError: '',
  requestStatus: RequestStatus.Idle
};

const userSlice = createSlice({
  name: USER_SLICE,
  initialState,
  reducers: {
    userLogout: (state) => {
      state = initialState;
    }
  },
  selectors: {
    getUserState: (state) => state.user,
    getError: (state) => state.loginUserError,
    getIsLoader: (state) => state.requestStatus === RequestStatus.Loading,
    getAuthenticated: (state) => state.isAuthenticated,
    getAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.loginUserError = '';
        state.isAuthChecked = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.loginUserError = action.error.message ?? '';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.requestStatus = RequestStatus.Success;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(registerUser.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.loginUserError = '';
        state.isAuthChecked = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.loginUserError = action.error.message ?? '';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.requestStatus = RequestStatus.Success;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(getUserApiThunk.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.loginUserError = '';
        state.isAuthChecked = false;
      })
      .addCase(getUserApiThunk.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.isAuthChecked = true;
      })
      .addCase(getUserApiThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.requestStatus = RequestStatus.Success;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.loginUserError = '';
        state.isAuthChecked = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.loginUserError = action.error.message ?? '';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = {
          name: '',
          email: ''
        };
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      });
  }
});

export const userSelectors = userSlice.selectors;
export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;

export const loginUser = createAsyncThunk(
  `${USER_SLICE}/loginUser`,
  async ({ email, password }: Omit<TLoginData, 'name'>) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      console.log(`Login error: ${data?.success}`);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const registerUser = createAsyncThunk(
  `${USER_SLICE}/registerUser`,
  async ({ email, password, name }: TRegisterData) => {
    const data = await registerUserApi({ email, password, name });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const getUserApiThunk = createAsyncThunk('user/getUser', async () => {
  const data = await getUserApi();
  if (!data?.success) {
    console.log(`Ошибка получения пользователя: ${data?.success}`);
  }
  return data;
});

export const logoutUser = createAsyncThunk(
  `${USER_SLICE}/logoutUser`,
  (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.clear();
        deleteCookie('accessToken');
        dispatch(userActions.userLogout());
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      });
  }
);

export const updateUser = createAsyncThunk(
  `${USER_SLICE}/updateUser`,
  async (user: Partial<TRegisterData>) => {
    const data = await updateUserApi(user);
    console.log(data);
    return data;
  }
);
