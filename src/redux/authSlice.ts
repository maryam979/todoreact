import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiGetMe } from '../services/auth/api';


export interface AuthState {
  user?:API.User;
  isLoggedIn:boolean;
}

const initialState: AuthState = {
  isLoggedIn:false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<API.UserLoginResponse>) => {
      localStorage.setItem('access_token', action.payload.access);
      localStorage.setItem('refresh_token', action.payload.refresh);
      state.user = action.payload.user
      state.isLoggedIn = true
    },

    setUser:(state,action:PayloadAction<API.User>)=>{
      state.user = action.payload
      state.isLoggedIn = true
    },

    logoutAction: (state, action) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      state.user = undefined
      state.isLoggedIn = false
    },

  },
});

export const { loginAction, logoutAction } = authSlice.actions;

export default authSlice;
