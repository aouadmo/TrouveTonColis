import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

// Action pour récupérer les colis du client connecté
export const fetchMesColis = createAsyncThunk(
  'colis/fetchMesColis',
  async ({ nom, prenom }, { rejectWithValue }) => {
    try {
      console.log("🔍 Récupération des colis pour:", nom, prenom);
      
      const response = await fetch(`${API_URL}/colis/mes-colis/${nom}/${prenom}`);
      const result = await response.json();

      console.log("📦 Résultat API mes colis:", result);

      if (result.result && result.colis) {
        return result.colis;
      } else {
        return rejectWithValue(result.error || 'Aucun colis trouvé');
      }
    } catch (error) {
      console.error("❌ Erreur fetch mes colis:", error);
      return rejectWithValue('Erreur de connexion');
    }
  }
);

// Action pour réserver un RDV
export const reserverRdv = createAsyncThunk(
  'colis/reserverRdv',
  async ({ trackingNumber, rdvDate, relayId }, { rejectWithValue }) => {
    try {
      console.log("📅 Réservation RDV pour:", trackingNumber, rdvDate);
      
      const response = await fetch(`${API_URL}/colis/reserver-rdv/${trackingNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rdvDate, relayId }),
      });

      const result = await response.json();

      if (result.result) {
        return result.colis;
      } else {
        return rejectWithValue(result.error || 'Erreur réservation RDV');
      }
    } catch (error) {
      console.error("❌ Erreur réservation RDV:", error);
      return rejectWithValue('Erreur de connexion');
    }
  }
);

// SLICE ÉTENDU
const initialState = {
  value: [],
  loading: false,  
  error: null,     
};

export const colisSlice = createSlice({
  name: 'colis',
  initialState,
  reducers: {

    setColis: (state, action) => {
      state.value = action.payload;
    },
    addColis: (state, action) => {
      state.value.push(action.payload);
    },
    resetColis: (state) => {
      state.value = [];
    },
    updateColisStatus: (state, action) => {
      const { trackingNumber, nouveauStatut } = action.payload;
      const index = state.value.findIndex(c => c.trackingNumber === trackingNumber);
      if (index !== -1) {
        state.value[index].status = nouveauStatut;
      }
    },
    
    // REDUCERS POUR RDV
    updateColisRdv: (state, action) => {
      const { trackingNumber, rdvDate, rdvRelayId } = action.payload;
      const index = state.value.findIndex(c => c.trackingNumber === trackingNumber);
      if (index !== -1) {
        state.value[index].rdvConfirmed = true;
        state.value[index].rdvDate = rdvDate;
        state.value[index].rdvRelayId = rdvRelayId;
        state.value[index].status = 'RDV réservé';
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  // ✅ EXTRAREDUCERS POUR LES ACTIONS ASYNC
  extraReducers: (builder) => {
    builder
      // Récupération des colis
      .addCase(fetchMesColis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMesColis.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload; // Remplace les colis
        state.error = null;
        console.log("✅ Colis du client chargés:", action.payload.length);
      })
      .addCase(fetchMesColis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Réservation RDV
      .addCase(reserverRdv.pending, (state) => {
        state.loading = true;
      })
      .addCase(reserverRdv.fulfilled, (state, action) => {
        state.loading = false;
        // Mettre à jour le colis avec le nouveau RDV
        const index = state.value.findIndex(c => c.trackingNumber === action.payload.trackingNumber);
        if (index !== -1) {
          state.value[index] = action.payload;
        }
        console.log("✅ RDV mis à jour:", action.payload);
      })
      .addCase(reserverRdv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ EXPORTS
export const { 
  setColis, 
  addColis, 
  resetColis, 
  updateColisStatus,
  updateColisRdv,   
  clearError         
} = colisSlice.actions;

export default colisSlice.reducer;