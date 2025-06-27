import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

// Action asynchrone pour récupérer les infos du point relais
export const fetchRelayInfo = createAsyncThunk(
  'horaires/fetchRelayInfo',
  async (relayId, { rejectWithValue }) => {
    try {

      console.log("🌐 URL APPELÉE:", `${API_URL}/pros/info/${relayId}`);
      const response = await fetch(`${API_URL}/pros/info/${relayId}`); const result = await response.json();

      console.log("=== API RESPONSE DEBUG ===");
      console.log("API Response complète:", result);
      console.log("result.data:", result.data);
      console.log("result.data.horaires:", result.data?.horaires);
      console.log("Type horaires API:", typeof result.data?.horaires);
      console.log("========================");

      if (result.result && result.data) {
        // Formatage de l'adresse complète
        const adresseComplete = `${result.data.adresse}, ${result.data.ville} ${result.data.codePostal}`;

        const finalData = {
          ...result.data,
          adresseComplete: adresseComplete
        };

        console.log("=== DONNÉES FINALES REDUX ===");
        console.log("Données envoyées à Redux:", finalData);
        console.log("Horaires finales:", finalData.horaires);
        console.log("=============================");

        return finalData;
      } else {
        return rejectWithValue(result.error || 'Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error("Erreur fetch pro:", error);
      return rejectWithValue('Impossible de charger les informations du point relais');
    }
  }
);

// Modifie ton initialState existant
const initialState = {
  value: null,           // Garde ton ancien state
  relayData: null,       // Ajoute les nouvelles données
  loading: false,
  error: null
};

export const horairesSlice = createSlice({
  name: 'horaires',
  initialState,
  reducers: {
    // reducers 
    setHoraires: (state, action) => {
      state.value = action.payload;
    },
    clearHoraires: (state) => {
      state.value = null;
    },

    clearRelayData: (state) => {
      state.relayData = null;
      state.error = null;
    },
  },
  // extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelayInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("🔄 LOADING - Récupération des données...");
      })
      .addCase(fetchRelayInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.relayData = action.payload;
        state.error = null;

        // Debug pour voir les horaires
        console.log("✅ SUCCESS - Données stockées dans Redux");
        console.log("State.relayData:", state.relayData);
        console.log("Horaires dans Redux:", action.payload.horaires);
        console.log("Type horaires Redux:", typeof action.payload.horaires);
      })
      .addCase(fetchRelayInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.relayData = null;
        console.log("❌ ERROR - Échec récupération:", action.payload);
      });
  },
});

// exports 
export const { setHoraires, clearHoraires, clearRelayData } = horairesSlice.actions;
export default horairesSlice.reducer;