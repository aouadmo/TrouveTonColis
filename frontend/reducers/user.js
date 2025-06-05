import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    token: null,
    email: null,
    isPro: null, // true pour pro, false pour client
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.isPro = action.payload.isPro;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.isPro = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
