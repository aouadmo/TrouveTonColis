import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    loginEmail: '',
  },
};

export const userProfile = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    updateClientProfile: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateClientProfile } = userProfile.actions;
export default userProfile.reducer;
