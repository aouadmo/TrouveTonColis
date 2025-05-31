import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// les screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import SignUpScreen from './screens/SignUpScreen';

//redux
import { Provider, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TabNavigationClient from './navigation/TabNavigationClient';
import TabNavigationPro from './navigation/TabNavigationPro';

const reducers = combineReducers({ user });
const persistConfig = { key: 'user', storage: AsyncStorage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainNavigation() {
  const user = useSelector((state) => state.user.value);

  if (!user.token) {
    // Si non connecté, on affiche ici les écrans publics
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      </Stack.Navigator>
    );
  }
  if (user.role === 'client') {
    return <TabNavigationClient />;
  } else if (user.role === 'pro') {
    return <TabNavigationPro />;
  } else {
    return null;
  }
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <MainNavigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
