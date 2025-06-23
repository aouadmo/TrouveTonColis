import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import user from './reducers/user';
import userProfile from './reducers/userProfile';
import colis from './reducers/colis';
import rdv from './reducers/rdv';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [],
};

const rootReducer = combineReducers({ user, userProfile, colis, rdv });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;