import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import user from './reducers/user';
import userProfile from './reducers/userProfile';
import colis from './reducers/colis';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [], // on persiste tout pour l’instant
};

const rootReducer = combineReducers({ user, userProfile, colis });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
      serializableCheck: {
        // Ignore les actions de redux-persist
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export default store;