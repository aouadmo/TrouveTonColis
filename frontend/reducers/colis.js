import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const colisSlice = createSlice({
  name: 'colis',
  initialState,
  reducers: {
    setColis: (state, action) => { //afficher la liste du stock colis
      state.value = action.payload;
    },
    addColis: (state, action) => { //ajouter un colis
      state.value.push(action.payload);
    },
    resetColis: (state) => { //enlever un ou plusieurs colis
      state.value = [];
    },
    updateColisStatus: (state, action) => { //création d'un statut colis pour le filtre dans "Mon Stock"
        const { trackingNumber, nouveauStatut } = action.payload;
        const index = state.value.findIndex(c => c.trackingNumber === trackingNumber);
        if (index !== -1) {
          state.value[index].status = nouveauStatut;
        }
      },      
  },
});

export const { setColis, addColis, resetColis, updateColisStatus } = colisSlice.actions;
export default colisSlice.reducer;
