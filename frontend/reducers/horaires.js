import { createSlice } from '@reduxjs/toolkit';
const initialState = { value: null };
export const horairesSlice = createSlice({
  name: 'horaires',
  initialState,
  reducers: {
    setHoraires: (state, action) => {
      state.value = action.payload;
    },
    clearHoraires: (state) => {
      state.value = null;
    },
  },
});
export const { setHoraires, clearHoraires } = horairesSlice.actions;
export default horairesSlice.reducer;
