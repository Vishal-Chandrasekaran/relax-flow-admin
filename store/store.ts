import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import authReducer from '../store/reducers/authReducer';
import userReducer from '../store/reducers/userReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof configureStore>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
