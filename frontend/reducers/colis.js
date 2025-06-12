import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const colisSlice = createSlice({
  name: 'colis',
  initialState,
  reducers: {
    setColis: (state, action) => { // Actualise la liste de colis
      state.value = action.payload;
    },
    addColis: (state, action) => { // Ajoute un nouveau colis à la liste existante
      state.value.push(action.payload);
    },
    resetColis: (state) => {  // Réinitialise complètement le stock (pour la déconnexion)
      state.value = [];
    },
    updateColisStatus: (state, action) => { // MAJ du statut d’un colis grâce à son tracking number
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
