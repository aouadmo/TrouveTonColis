import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import user from './reducers/user'; // <-- ton reducer

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // 👇 Ignore les actions persist/* qui causent les warnings
  blacklist: [],
};

const rootReducer = combineReducers({ user });
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
