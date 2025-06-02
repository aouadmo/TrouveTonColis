import { createSlice } from '@reduxjs/toolkit';

const initialState = {token: null, email: null, isPro: null};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isPro = action.payload.isPro;
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.isPro = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
