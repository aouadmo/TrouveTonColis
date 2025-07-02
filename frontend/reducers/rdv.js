import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const rdvSlice = createSlice({
  name: 'rdv',
  initialState,
  reducers: {
    setRdv: (state, action) => {
      if (!Array.isArray(state.value)) {
        state.value = [];
      }
      state.value.push(action.payload);
    },
    clearRdv: (state) => {
      state.value = [];
    },
  },
});

export const { setRdv, clearRdv } = rdvSlice.actions;
export default rdvSlice.reducer;
