import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, role: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.role = action.payload.role;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.role = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
