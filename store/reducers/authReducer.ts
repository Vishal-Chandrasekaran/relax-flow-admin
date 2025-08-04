/* eslint-disable @typescript-eslint/no-explicit-any */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

let token = null;
let refreshToken = null;
let user = null;
let accessToken = null;

token = Cookies.get('token');
refreshToken = Cookies.get('refresh_token');
user = Cookies.get('user');
accessToken = Cookies.get('access_token');

// const getParsedUser = () => {
//     if(user) {
//         return JSON.parse(user);
//     } else {
//         return undefined;
//     }
// };

const initialState: any = {
  token: token ?? '',
  refresh_token: refreshToken ?? '',
  access_token: accessToken ?? '',
  user: user ?? '',
  updateUserProfile: user ?? ''
};

export const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      Cookies.set('token', action.payload.token);
      Cookies.set('refresh_token', action.payload.refresh_token);
      Cookies.set('access_token', action.payload.access_token);

      Cookies.set('user', JSON.stringify(action.payload.user));
      state.token = action.payload.token;
      state.user = action.payload.user;

      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },

    logout: state => {
      Cookies.remove('token');
      Cookies.remove('refresh_token');
      Cookies.remove('access_token');

      Cookies.remove('user');
      localStorage.clear();
      state.token = '';
      state.refresh_token = '';
      state.user = null;
    },

    getRefreshToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<any>) => {
      Cookies.set('user', JSON.stringify(action.payload));

      state.user = action.payload;
    }
  }
});
export const {login, logout, getRefreshToken, updateUserProfile} =
  authSlice.actions;

export default authSlice.reducer;
