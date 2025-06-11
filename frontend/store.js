import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import user from './reducers/user';
import userProfile from './reducers/userProfile';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [], // on persiste tout pour l’instant
};

const rootReducer = combineReducers({ 
  user,
  userProfile, // 👈 obligatoire
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export default store;