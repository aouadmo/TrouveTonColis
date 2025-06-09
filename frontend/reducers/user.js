import { createSlice } from '@reduxjs/toolkit';

const initialState = {
<<<<<<< HEAD
  value: {
    token: null,
    email: null,
    isPro: null, // true pour pro, false pour client
  },
=======
  value: { token: null, email: null },
>>>>>>> mohamed-codebarscan-feature
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
<<<<<<< HEAD
      state.value.isPro = action.payload.isPro;
=======
>>>>>>> mohamed-codebarscan-feature
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
<<<<<<< HEAD
      state.value.isPro = null;
=======
>>>>>>> mohamed-codebarscan-feature
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
